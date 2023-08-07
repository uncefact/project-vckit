import { IAgent } from '@vckit/core-types';
import { Request, Response, Router } from 'express';

export interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 *
 */
export function revocationList2020Router(): Router {
  const router = Router();

  // credentials/status/revocation-list-2020
  router.get('/:issuer/:id', async (req: RequestWithAgent, res: Response) => {
    const { id, issuer } = req.params;
    const agent = req.agent;
    if (!agent) throw Error('Agent not available');

    try {
      const result = await agent.execute(
        'getRevocationListVC',
        req.originalUrl
      );

      res.status(200).json({ ...result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
