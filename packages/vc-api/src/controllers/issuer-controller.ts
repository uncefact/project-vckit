import { RequestWithAgent } from '../types/request-type.js';
import { Response } from 'express';
import { configuration as DEFAULT_CONFIG } from '../config/index.js';
import { errorHandler } from '../error-handler.js';

export const issueCredential = async (req: RequestWithAgent, res: Response) => {
  try {
    if (!req.agent) {
      throw Error('Agent not available');
    }

    if (!req.body.credential.type.includes('VerifiableCredential')) {
      throw new Error('"type" must include `VerifiableCredential`.');
    }

    const payload = {
      ...DEFAULT_CONFIG,
      credential: req.body.credential,
      proofFormat: req.body?.options?.proofFormat ?? DEFAULT_CONFIG.proofFormat,
    };

    const verifiableCredential = await req.agent.execute(
      'routeCreationVerifiableCredential',
      payload,
    );
    res.status(201).json({ verifiableCredential });
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

export const updateCredentialStatus = async (
  req: RequestWithAgent,
  res: Response,
) => {
  try {
    if (!req.agent) {
      throw Error('Agent not available');
    }

    res.status(501).json({ error: 'Not implemented' });
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};
