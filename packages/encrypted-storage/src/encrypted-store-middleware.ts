import { IAgent, IEncrypteAndStoreDataResult } from '@vckit/core-types';
import { NextFunction, Request, Response, Router } from 'express';
import interceptor from 'express-interceptor';
import { RequestWithAgent } from './encrypted-store-router.js';

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
    res: Response
  ) {
    return {
      isInterceptable: function () {
        return true;
      },
      intercept: async function (body: string, send: (body: string) => void) {
        if (!req.agent) throw Error('Agent not available');
        let updatedBody: string = body;

        if (
          res.statusCode === 200 &&
          body &&
          args.apiRoutes.includes(req.path)
        ) {
          try {
            switch (req.path) {
              case '/createVerifiableCredential':
                updatedBody = await processCreateVerifiableCredentialRequest(
                  req.agent,
                  JSON.parse(body)
                );

                break;
              default:
                break;
            }
          } catch (e: any) {
            throw Error(e.message);
          }
        }

        send(updatedBody);
      },
    };
  });

  router.use(intercept);

  return router;
}

async function processCreateVerifiableCredentialRequest(
  agent: IAgent,
  payload: object
) {
  const { id, key }: IEncrypteAndStoreDataResult = await agent.execute(
    'encryptAndStoreData',
    {
      data: payload,
    }
  );

  return JSON.stringify({ id, key, credential: payload });
}
