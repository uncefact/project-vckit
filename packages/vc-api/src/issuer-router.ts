import { IAgent } from '@vckit/core-types';
import { Request, Response, NextFunction, Router, json } from 'express';

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
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const validPayload = validateCredentialPayload(req.body);
        if (!validPayload) {
          return res.status(400).json({ error: 'Invalid credential payload' });
        }
        const result = await req.agent.execute(createCredential, req.body);
        res.status(201).json(result);
      } catch (e: any) {
        return res.status(400).json({ error: e.message });
      }
    }
  );

  router.post(
    '/credentials/status',
    async (req: RequestWithAgent, res: Response, next: NextFunction) => {
      if (!req.agent) {
        throw Error('Agent not available');
      }

      try {
        const result = await req.agent.execute(
          updateCredentialStatus,
          req.body
        );
        return res.status(200).json(result);
      } catch (e: any) {
        if (e.name === 'ValidationError') {
          return res.status(400).json({
            name: 'ValidationError',
            message: e.message,
            method: e.method,
            path: e.path,
            code: e.code,
            description: e.description,
          });
        }
        return res.status(500).json({ error: e.message });
      }
    }
  );

  return router;
};

const validateCredentialPayload = (requestBody: any): boolean => {
  const credential = requestBody['credential'];
  return (
    credential &&
    validateContext(credential) &&
    validIssuer(credential) &&
    validType(credential) &&
    validCredentialSubject(credential)
  );
};

const validateContext = (credential: Record<string, string>): boolean => {
  if (!credential['@context']) {
    return false;
  }

  if (
    !Array.isArray(credential['@context']) ||
    credential['@context'].length === 0
  ) {
    return false;
  }

  if (typeof credential['@context'] === 'string') {
    return false;
  }

  return true;
};

const validIssuer = (credential: Record<string, string>): boolean => {
  return (
    Boolean(credential['issuer']) &&
    (typeof credential['issuer'] === 'string' ||
      typeof credential['issuer'] === 'object')
  );
};

const validCredentialSubject = (
  credential: Record<string, string>
): boolean => {
  return (
    Boolean(credential['credentialSubject']) &&
    typeof credential['credentialSubject'] === 'object'
  );
};

const validType = (credential: Record<string, string>): boolean => {
  if (!credential['type']) {
    return false;
  }

  if (!Array.isArray(credential['type']) || credential['type'].length === 0) {
    return false;
  }

  if (typeof credential['type'] === 'string') {
    return false;
  }

  return true;
};
