import { RequestWithAgent } from '@vckit/core-types';
import {
  NextFunction,
  Request,
  Response,
  Router,
  urlencoded,
  json,
} from 'express';

/**
 *
 * @public
 */
export function revocationList2020(args: {
  apiRoutes: string[];
  revocationListPath: string;
  bitStringLength: string;
  revocationVCIssuer: string;
}): Router {
  const router = Router();

  router.use(urlencoded({ extended: false }));
  router.use(json());

  router.use(
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      if (!req.body || !args.apiRoutes.includes(req.path)) {
        next();
        return;
      }

      try {
        const revocationData = await req.agent.execute('getRevocationData', {
          revocationListPath: args.revocationListPath,
          bitStringLength: args.bitStringLength,
          revocationVCIssuer: args.revocationVCIssuer,
          req,
        });

        req.body.credential.credentialStatus = {
          id: `${args.revocationListPath}${revocationData.revocationListFullUrlPath}`,
          type: 'RevocationList2020Status',
          revocationListIndex: revocationData.indexCounter,
          revocationListCredential: `${args.revocationListPath}${revocationData.revocationListFullUrlPath}`,
        };

        next();
      } catch (err) {
        throw err;
      }
    }
  );
  return router;
}
