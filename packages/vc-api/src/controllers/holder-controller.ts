import {
  IAgent,
  UniqueVerifiableCredential,
  UniqueVerifiablePresentation,
  UnsignedPresentation,
  VerifiableCredential,
  VerifiablePresentation,
} from '@uncefact/vckit-core-types';
import { Response } from 'express';
import { errorHandler } from '../error-handler.js';
import { RequestWithAgent } from '../types/request-type.js';
import { configuration } from '../config/index.js';

/**
 * Retrieves a specific verifiable credential based on its ID.
 * @public
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const getCredential = async (req: RequestWithAgent, res: Response) => {
  try {
    if (!req.agent) throw Error('Agent not available');
    const result = await getUniqueVerifiableCredential(
      req.agent,
      req.params.id
    );
    if (!result) {
      res.status(404).json({ error: 'Credential not found' });
    } else {
      res.status(200).json(result.verifiableCredential);
    }
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

/**
 * Retrieves all verifiable credentials.
 * @public
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const getCredentials = async (req: RequestWithAgent, res: Response) => {
  try {
    if (!req.agent) throw Error('Agent not available');
    const result: Array<VerifiableCredential> = await getVerifiableCredentials(
      req.agent
    );
    if (result.length === 0) {
      res.status(410).json({ error: 'Gone! There is no data here' });
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

/**
 * Deletes a specific verifiable credential based on its ID.
 * @public
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const deleteCredential = async (
  req: RequestWithAgent,
  res: Response
) => {
  try {
    if (!req.agent) throw Error('Agent not available');
    const result = await deleteVerifiableCredential(req.agent, req.params.id);
    if (!result) {
      res.status(404).json({ error: 'Credential not found' });
    } else {
      res.status(202).json({ message: 'Credential deleted' });
    }
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};
/**
 * Derives a verifiable credential is not implemented.
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const deriveCredential = async (
  req: RequestWithAgent,
  res: Response
) => {
  if (!req.agent) throw Error('Agent not available');
  res.status(501).json({ error: 'Not implemented' });
};

/**
 * Retrieves a specific verifiable presentation based on its ID.
 * @public
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const getPresentation = async (req: RequestWithAgent, res: Response) => {
  try {
    if (!req.agent) throw Error('Agent not available');
    const result = await getUniqueVerifiablePresentation(
      req.agent,
      req.params.id
    );
    if (!result) {
      res.status(404).json({ error: 'Presentation not found' });
    } else {
      res.status(200).json(result.verifiablePresentation);
    }
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

/**
 * Retrieves all verifiable presentations.
 * @public
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const getPresentations = async (
  req: RequestWithAgent,
  res: Response
) => {
  try {
    if (!req.agent) throw Error('Agent not available');
    const result = await getVerifiablePresentations(req.agent);
    if (result.length === 0) {
      res.status(410).json({ error: 'Gone! There is no data here' });
    } else {
      res.status(200).json(result);
    }
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

/**
 * Proves a verifiable presentation.
 * @public
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const provePresentation = async (
  req: RequestWithAgent,
  res: Response
) => {
  try {
    if (!req.agent) throw Error('Agent not available');
    const result = await proveVerifiablefPresentation(req.agent, req.body);
    res.status(201).json(result);
  } catch (e) {
    const error = errorHandler(e);
    res.status(error.code).json({ error: error.message });
  }
};

/**
 * delete a verifiable presentation is not implemented.
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const deletePresentation = async (
  req: RequestWithAgent,
  res: Response
) => {
  if (!req.agent) throw Error('Agent not available');
  res.status(501).json({ error: 'Not implemented' });
};

/**
 * get exchanges is not implemented.
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const getExchanges = async (req: RequestWithAgent, res: Response) => {
  if (!req.agent) throw Error('Agent not available');
  res.status(501).json({ error: 'Not implemented' });
};

/**
 * initiate an exchange is not implemented.
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const initiateExchange = async (
  req: RequestWithAgent,
  res: Response
) => {
  if (!req.agent) throw Error('Agent not available');
  res.status(501).json({ error: 'Not implemented' });
};

/**
 * receive the exchange is not implemented.
 * @param {RequestWithAgent} req - The request object.
 * @param {Response} res - The response object.
 * @throws {Error} If the agent is not available.
 */
export const receiveExchange = async (req: RequestWithAgent, res: Response) => {
  if (!req.agent) throw Error('Agent not available');
  res.status(501).json({ error: 'Not implemented' });
};

const getUniqueVerifiableCredential = async (
  agent: IAgent,
  id: string
): Promise<UniqueVerifiableCredential | null> => {
  const params = {
    where: [{ column: 'id', value: [id], not: false, op: 'Equal' }],
  };
  const result: Array<UniqueVerifiableCredential> = await agent.execute(
    'dataStoreORMGetVerifiableCredentials',
    params
  );
  return result[0] ? result[0] : null;
};

const deleteVerifiableCredential = async (
  agent: IAgent,
  id: string
): Promise<boolean> => {
  const credential = await getUniqueVerifiableCredential(agent, id);
  if (!credential) throw Error('not_found: Credential not found');

  const params = {
    hash: credential.hash,
  };
  return agent.execute('dataStoreDeleteVerifiableCredential', params);
};

const getVerifiableCredentials = async (
  agent: IAgent
): Promise<VerifiableCredential[]> => {
  const params = {};
  const result = await agent.execute(
    'dataStoreORMGetVerifiableCredentials',
    params
  );
  return result.map(
    (credential: UniqueVerifiableCredential) => credential.verifiableCredential
  );
};

const getUniqueVerifiablePresentation = async (
  agent: IAgent,
  id: string
): Promise<UniqueVerifiablePresentation | null> => {
  const params = {
    where: [{ column: 'id', value: [id], not: false, op: 'Equal' }],
  };
  const result: Array<UniqueVerifiablePresentation> = await agent.execute(
    'dataStoreORMGetVerifiablePresentations',
    params
  );
  return result[0] ? result[0] : null;
};

const getVerifiablePresentations = async (agent: IAgent) => {
  const params = {};
  const result = await agent.execute(
    'dataStoreORMGetVerifiablePresentations',
    params
  );
  return result.map(
    (presentation: UniqueVerifiablePresentation) =>
      presentation.verifiablePresentation
  );
};

const proveVerifiablefPresentation = async (
  agent: IAgent,
  data: { presentation: UnsignedPresentation; options: any }
): Promise<VerifiablePresentation> => {
  const params = {
    presentation: data.presentation,
    ...configuration,
    ...data.options,
  };

  const result: VerifiablePresentation = await agent.execute(
    'createVerifiablePresentation',
    params
  );
  return result;
};
