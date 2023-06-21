import { IAgent, VerifiableCredential } from '@vckit/core-types';
import { Request, Response, NextFunction, Router, json } from 'express';
import { validateCredentialPayload, validateUpdateStatusCredentialPayload } from './middlewares/index.js';
import { IssueCredentialRequestPayload, UpdateCredentialStatusRequestPayload } from './types/index.js';
import { mapCredentialPayload, mapCredentialResponse } from './utils/index.js';
import { configuration } from './config/index.js';
import { validationResult } from 'express-validator';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 */
export interface IssuerRouterOptions {
  /**
   * Agaent method to create credential
   */
  createCredential: string;

  /**
   * Agent method to update credential status (revocation)
   */
  updateCredentialStatus: string;
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
}: IssuerRouterOptions): Router => {
  const router = Router();
  router.use(json({ limit: '10mb' }));

  router.post(
    '/credentials/issue',
    validateCredentialPayload(),
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ description: errors.array() });
      }
      
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const payload = mapCredentialPayload(
          req.body as IssueCredentialRequestPayload,
          configuration
        );
        const result = (await req.agent.execute(
          createCredential,
          payload
        )) as VerifiableCredential;
        res.status(201).json(mapCredentialResponse(result));
      } catch (e: any) {
        return res.status(400).json({ error: e.message });
      }
    }
  );

  router.post(
    '/credentials/status',
    validateUpdateStatusCredentialPayload(),
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ description: errors.array() });
      }

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
