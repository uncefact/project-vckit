import { IAgent, VerifiableCredential } from '@vckit/core-types';
import { Request, Response, NextFunction, Router, json } from 'express';
import {
  IssueCredentialRequestPayload,
  UpdateCredentialStatusRequestPayload,
} from './types/index.js';
import { mapCredentialPayload } from './utils/index.js';
import {
  IssuerConfiguration,
  configuration as DEFAULT_CONFIG,
} from './config/index.js';
import { validatorMiddleware } from './validator-middleware.js';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 */
export interface IssuerRouterOptions {
  /**
   * Agent method to create credential
   */
  createCredential: string;

  /**
   * Agent method to update credential status (revocation)
   */
  updateCredentialStatus: string;

  config?: IssuerConfiguration;

  apiSpec: string;
}

/**
 * Creates a router that conform to vc-api interfaces for issuer.
 *
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const IssuerRouter = ({
  createCredential,
  updateCredentialStatus,
  config,
}: IssuerRouterOptions): Router => {
  const router = Router();
  router.use(json({ limit: '10mb' }));

  router.post(
    '/credentials/issue',
    validatorMiddleware(),
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const payload = mapCredentialPayload(
          req.body as IssueCredentialRequestPayload,
          { ...DEFAULT_CONFIG, ...config }
        );
        const verifiableCredential = (await req.agent.execute(
          createCredential,
          payload
        )) as VerifiableCredential;
        res.status(201).json({ verifiableCredential });
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    '/credentials/status',
    validatorMiddleware(),
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const result = await req.agent.execute(
          updateCredentialStatus,
          req.body as UpdateCredentialStatusRequestPayload
        );

        if (!result) {
          return res.status(500).json({ description: 'Internal Server Error' });
        }

        return res
          .status(200)
          .json({ description: 'Credential status successfully updated' });
      } catch (e: any) {
        if (e.name === 'NotFoundError') {
          return res.status(400).json({ description: 'Credential not found' });
        }
        res.status(500).json({ description: 'Internal Server Error' });
      }
    }
  );

  return router;
};
