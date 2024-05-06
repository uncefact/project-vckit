import { IAgent } from '@vckit/core-types';
import { Request, Response, Router } from 'express';

export interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 *
 */
export function bitstringStatusListRouter(): Router {
  const router = Router();

  // credentials/status/bitstring-status-list
  router.get('/:id', async (req: RequestWithAgent, res: Response) => {
    const { id } = req.params;
    const agent = req.agent;
    if (!agent) throw Error('Agent not available');

    try {
      const result = await agent.execute('getBitstringStatusListVC', id);

      res.status(200).json({ ...result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
