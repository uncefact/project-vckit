import { IAgent, IVerifyResult } from '@vckit/core-types';
import { Request, Response, NextFunction, Router, json } from 'express';
import {
  mapVerifiableCredentialPayload,
  mapVerifiablePresentationPayload,
} from './utils/index.js';
import {
  VerifierCredentialRequestPayload,
  VerifierPresentationRequestPayload,
} from './types/verifier.js';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 */
export interface VerifierRouterOptions {
  /**
   * Agent method to verify credential
   */
  verifyCredential: string;

  /**
   * Agent method to verify presentation
   */
  verifyPresentation: string;

  apiSpec: string;
}

/**
 * Creates a router that conform to vc-api interfaces for verifier.
 *
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const VerifierRouter = ({
  verifyCredential,
  verifyPresentation,
}: VerifierRouterOptions): Router => {
  const router = Router();
  router.use(json({ limit: '10mb' }));

  router.post(
    '/credentials/verify',
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const payload = mapVerifiableCredentialPayload(
          req.body as VerifierCredentialRequestPayload
        );

        const result = (await req.agent.execute(
          verifyCredential,
          payload
        )) as IVerifyResult;
        res.status(200).json(result);
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
    }
  );

  router.post(
    '/presentations/verify',
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const payload = mapVerifiablePresentationPayload(
          req.body as VerifierPresentationRequestPayload
        );

        const result = (await req.agent.execute(
          verifyPresentation,
          payload
        )) as IVerifyResult;
        res.status(200).json(result);
      } catch (e: any) {
        return res.status(500).json({ error: e.message });
      }
    }
  );

  return router;
};
