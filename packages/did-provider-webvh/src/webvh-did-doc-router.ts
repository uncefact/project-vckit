import { type Request, Router } from 'express';
import { generateParallelDidWeb, resolveDIDFromLog } from 'didwebvh-ts';
import { WebvhDidLogStore } from './store/webvh-did-log-store.js';
import { VeramoVerifier } from './veramo-signer.js';
import type { OrPromise } from '@veramo/utils';
import type { DataSource } from 'typeorm';

/** @public */
export interface WebvhDidDocRouterOptions {
  dbConnection: OrPromise<DataSource>;
  /** Publish the parallel did:web document at did.json. Defaults to true. */
  serveDidJson?: boolean;
}

/**
 * Publishes root and path-based WebVH histories and parallel did:web documents.
 * Mount before the standard WebDidDocRouter so it can handle managed WebVH DIDs.
 * @public
 */
export const WebvhDidDocRouter = (options: WebvhDidDocRouterOptions): Router => {
  const router = Router();
  const store = new WebvhDidLogStore(options.dbConnection);

  const domainPathFor = (req: Request): string => {
    const host = encodeURIComponent((req.get('host') || req.hostname).toLowerCase());
    const path = req.path.replace(/\/did(?:-witness)?\.jsonl?$/, '').replace(/^\//, '');
    return host + (path && path !== '.well-known' ? ':' + path.replace(/\//g, ':') : '');
  };

  const findLog = async (req: Request) => {
    const domainPath = domainPathFor(req);
    return (await store.getAllLogs()).find(entity =>
      [entity.currentDid, ...JSON.parse(entity.previousDids || '[]')]
        .some(did => did.split(':').slice(3).join(':') === domainPath));
  };

  router.get(/^\/(.+)\/did-witness\.json$/, async (req, res) => {
    try {
      const proofs = await store.getWitnessProofsForDomainPath(domainPathFor(req));
      if (proofs === null && !(await findLog(req))) { res.status(404).json({ error: 'DID not found' }); return; }
      res.setHeader('Cache-Control', 'no-store');
      res.json(proofs ?? []);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  router.get(/^\/(.+)\/did\.jsonl$/, async (req, res) => {
    try {
      const entity = await findLog(req);
      if (!entity) { res.status(404).json({ error: 'DID not found' }); return; }
      res.setHeader('Cache-Control', 'no-store');
      res.type('application/jsonl').send(JSON.parse(entity.log).map((entry: unknown) => JSON.stringify(entry)).join('\n') + '\n');
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  if (options.serveDidJson ?? true) {
    router.get(/^\/(.+)\/did\.json$/, async (req, res, next) => {
      try {
        const entity = await findLog(req);
        if (!entity) { next(); return; }
        const resolved = await resolveDIDFromLog(JSON.parse(entity.log), { verifier: new VeramoVerifier(), witnessProofs: await store.getWitnessProofsForScid(entity.scid) });
        if (resolved.meta.error) throw new Error(resolved.meta.problemDetails?.detail ?? resolved.meta.error);
        if (resolved.meta.deactivated) { res.status(410).json({ error: 'DID deactivated' }); return; }
        // Resolve first to verify the history and materialize implicit services.
        const document = generateParallelDidWeb(resolved.did, resolved.doc);
        res.setHeader('Cache-Control', 'no-store');
        res.type('application/did+ld+json').send(document);
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
      }
    });
  }
  return router;
};
