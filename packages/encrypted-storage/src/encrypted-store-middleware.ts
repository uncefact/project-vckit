import { IAgent, IEncrypteAndStoreDataResult } from '@uncefact/vckit-core-types';
import { NextFunction, Request, Response, Router } from 'express';
import interceptor from 'express-interceptor';
import { RequestWithAgent } from './encrypted-store-router.js';
import Debug from 'debug';

const debug = Debug('vckit:encrypted-storage');

/**
 *
 * @public
 */
export function encryptedStoreMiddleware(args: {
  apiRoutes: string[];
}): Router {
  const router = Router();

  const intercept = interceptor(function (
    req: RequestWithAgent,
    res: Response,
  ) {
    return {
      isInterceptable: function () {
        return true;
      },
      intercept: async function (body: string, send: (body: string) => void) {
        try {
          if (!req.agent) throw Error('Agent not available');
          let updatedBody: string = body;

          if (
            res.statusCode === 200 &&
            body &&
            args.apiRoutes.includes(req.path)
          ) {
            updatedBody = await encryptAndStoreData(
              req.agent,
              JSON.parse(body),
            );
          }

          send(updatedBody);
        } catch (e: any) {
          throw Error(e.message);
        }
      },
    };
  });

  router.use(intercept);

  return router;
}

async function encryptAndStoreData(agent: IAgent, payload: object) {
  try {
    const { id, key }: IEncrypteAndStoreDataResult = await agent.execute(
      'encryptAndStoreData',
      {
        data: payload,
      },
    );

    return JSON.stringify({ id, key, credential: payload });
  } catch (error) {
    debug(error);
    return JSON.stringify({ credential: payload });
  }
}
