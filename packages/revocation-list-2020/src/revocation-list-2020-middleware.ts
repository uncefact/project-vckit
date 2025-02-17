import { RequestWithAgent } from '@uncefact/vckit-core-types';
import { asArray, extractIssuer, processEntryToArray } from '@veramo/utils';
import {
  NextFunction,
  Request,
  Response,
  Router,
  urlencoded,
  json,
} from 'express';
const VC_REVOCATION_LIST_2020 = 'https://w3id.org/vc-revocation-list-2020/v1';

// TODO: remove the middleware and use the method/API directly
/**
 * @deprecated
 * @public
 */
export function revocationList2020Middleware(args: {
  apiRoutes: string[];
  supportedProofFormats: string[];
}): Router {
  const router = Router();

  router.use(urlencoded({ extended: false }));
  router.use(json());

  router.use(
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      try {
        if (!req.agent) {
          throw Error('Agent not available');
        }

        if (
          !req.body ||
          !args.apiRoutes.includes(req.path) ||
          (args.supportedProofFormats &&
            !args.supportedProofFormats.includes(req.body.proofFormat))
        ) {
          next();
          return;
        }

        const revocationVCIssuer = extractIssuer(req.body.credential);

        const revocationData = await req.agent.execute(
          'issueRevocationStatusList',
          {
            revocationVCIssuer,
          },
        );

        req.body.credential['@context'] = asArray<string>(
          req.body.credential['@context'],
        );

        if (
          !req.body.credential['@context'].find(
            (context: string) => context === VC_REVOCATION_LIST_2020,
          )
        ) {
          req.body.credential['@context'] = [
            ...req.body.credential['@context'],
            VC_REVOCATION_LIST_2020,
          ];
        }

        req.body.credential.credentialStatus = revocationData;

        next();
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  );
  return router;
}
