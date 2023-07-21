import { IAgent } from '@vckit/core-types';
import { Request, Response, Router } from 'express';

export interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 *
 */
export function encryptedStoreRouter(): Router {
  const router = Router();

  router.get(
    '/encrypted-data/:id',
    async (req: RequestWithAgent, res: Response) => {
      const { id } = req.params;
      const { key } = req.query;
      const agent = req.agent;
      if (!agent) throw Error('Agent not available');

      try {
        const result = await agent.execute('fetchEncryptedData', { id, key });
        res.status(200).json({ document: JSON.parse(result) });
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    }
  );

  return router;
}
