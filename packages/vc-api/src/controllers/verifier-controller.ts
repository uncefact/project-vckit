import { RequestWithAgent } from '../types/request-type.js';
import { Response } from 'express';
import { errorHandler } from '../error-handler.js';

export const verifyCredential = async (
  req: RequestWithAgent,
  res: Response
) => {
  try {
    if (!req.agent) {
      throw Error('Agent not available');
    }
    const payload = {
      credential: req.body.verifiableCredential,
    };

    const result = await req.agent.execute(
      'routeVerificationCredential',
      payload
    );
    res.status(200).json(result);
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

export const verifyPresentation = async (
  req: RequestWithAgent,
  res: Response
) => {
  try {
    if (!req.agent) {
      throw Error('Agent not available');
    }
    const payload = {
      credential: req.body.verifiablePresentation,
    };

    const result = await req.agent.execute('verifyPresentation', payload);
    res.status(200).json(result);
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};
