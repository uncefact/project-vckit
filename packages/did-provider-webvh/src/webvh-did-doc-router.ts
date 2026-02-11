import { Request, Router } from 'express';
import { WebvhDidLogStore } from './store/webvh-did-log-store.js';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';

/**
 * Request type with an optional agent property, matching VCkit's pattern.
 */
interface RequestWithAgent extends Request {
  agent?: any;
}

/**
 * Options for the WebvhDidDocRouter.
 * @public
 */
export interface WebvhDidDocRouterOptions {
  /** Database connection for loading DID logs */
  dbConnection: OrPromise<DataSource>;

  /**
   * Whether to serve a backward-compatible did.json alongside did.jsonl.
   * This allows did:web consumers to resolve the DID using the latest state.
   * Defaults to true.
   */
  serveDidJson?: boolean;
}

/**
 * Creates an Express router that serves did:webvh DID documents.
 *
 * Endpoints:
 * - `/.well-known/did.jsonl` — DID log for the root domain DID
 * - `/{path}/did.jsonl` — DID log for path-based DIDs
 * - `/.well-known/did.json` — (optional) Backward-compatible did:web document
 * - `/{path}/did.json` — (optional) Backward-compatible did:web document
 *
 * @public
 */
export const WebvhDidDocRouter = (options: WebvhDidDocRouterOptions): Router => {
  const router = Router();
  const logStore = new WebvhDidLogStore(options.dbConnection);
  const serveDidJson = options.serveDidJson ?? true;

  /**
   * Construct the DID string from the request hostname and path.
   */
  const getDidForRequest = (req: Request, pathSegment?: string): string => {
    const host = encodeURIComponent(req.get('host') || req.hostname);
    if (pathSegment) {
      const pathParts = pathSegment.replace(/\//g, ':');
      // We need to search by domain+path pattern since we don't know the SCID
      return `${host}:${pathParts}`;
    }
    return host;
  };

  /**
   * Find a DID log entity matching a domain+path pattern.
   * Since we don't know the SCID from the URL, we search all logs
   * for one whose currentDid matches the domain+path pattern.
   */
  const findLogByDomainPath = async (domainPath: string) => {
    const allLogs = await logStore.getAllLogs();
    return allLogs.find((log) => {
      // did:webvh:{SCID}:{domain}:{path...}
      const parts = log.currentDid.split(':');
      // Remove 'did:webvh:{SCID}:' prefix, keep domain:path
      const didDomainPath = parts.slice(3).join(':');
      return didDomainPath === domainPath;
    });
  };

  /**
   * Convert a DID log to JSONL format (one JSON object per line).
   */
  const logToJsonl = (log: any[]): string => {
    return log.map((entry) => JSON.stringify(entry)).join('\n');
  };

  /**
   * Extract the latest DID document from a DID log for backward-compatible did.json.
   */
  const latestDocFromLog = (log: any[]): any | null => {
    if (!log || log.length === 0) return null;
    const lastEntry = log[log.length - 1];
    return lastEntry?.state || null;
  };

  // Serve did.jsonl for root domain DID
  router.get('/.well-known/did.jsonl', async (req: RequestWithAgent, res) => {
    try {
      const domainPath = getDidForRequest(req);
      const logEntity = await findLogByDomainPath(domainPath);

      if (!logEntity) {
        res.status(404).json({ error: 'DID not found' });
        return;
      }

      const log = JSON.parse(logEntity.log);
      res.setHeader('Content-Type', 'application/jsonl');
      res.send(logToJsonl(log));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Serve did.jsonl for path-based DIDs
  router.get(/^\/(.+)\/did\.jsonl$/, async (req: RequestWithAgent, res) => {
    try {
      const pathSegment = req.params[0];
      const domainPath = getDidForRequest(req, pathSegment);
      const logEntity = await findLogByDomainPath(domainPath);

      if (!logEntity) {
        res.status(404).json({ error: 'DID not found' });
        return;
      }

      const log = JSON.parse(logEntity.log);
      res.setHeader('Content-Type', 'application/jsonl');
      res.send(logToJsonl(log));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Backward-compatible did.json (latest DID document state)
  if (serveDidJson) {
    router.get('/.well-known/did.json', async (req: RequestWithAgent, res, next) => {
      try {
        const domainPath = getDidForRequest(req);
        const logEntity = await findLogByDomainPath(domainPath);

        if (!logEntity) {
          // Fall through to let the standard WebDidDocRouter handle it
          next();
          return;
        }

        const log = JSON.parse(logEntity.log);
        const doc = latestDocFromLog(log);

        if (!doc) {
          next();
          return;
        }

        res.json(doc);
      } catch (e: any) {
        next();
      }
    });

    router.get(/^\/(.+)\/did\.json$/, async (req: RequestWithAgent, res, next) => {
      try {
        const pathSegment = req.params[0];
        const domainPath = getDidForRequest(req, pathSegment);
        const logEntity = await findLogByDomainPath(domainPath);

        if (!logEntity) {
          next();
          return;
        }

        const log = JSON.parse(logEntity.log);
        const doc = latestDocFromLog(log);

        if (!doc) {
          next();
          return;
        }

        res.json(doc);
      } catch (e: any) {
        next();
      }
    });
  }

  return router;
};
