import { IAgent } from '@vckit/core-types';
import { Request, Response, NextFunction, Router, json } from 'express';
import Debug from 'debug';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

const exposedMethods = [
  'didManagerGet',
  'didManagerFind',
  'didManagerGetProviders',
  'didManagerCreate',
  'didManagerDelete',
  'dataStoreORMGetIdentifiersCount',
  'dataStoreORMGetVerifiableCredentials',
  'dataStoreORMGetVerifiableCredentialsCount',
  'dataStoreGetVerifiableCredential',
  'renderCredential',
  'fetchEncryptedDataByCredentialHash',
  'issueRevocationStatusList',
  'checkRevocationStatus',
  'activateCredential',
  'revokeCredential',
  'routeCreationVerifiableCredential',
  'routeVerificationCredential',
  'issueBitstringStatusList',
  'checkBitstringStatus',
  'setBitstringStatus',
  'computeHash',
];

export const ApiRouter = (): Router => {
  const router = Router();

  for (const exposedMethod of exposedMethods) {
    Debug('veramo:remote-server:initializing')(exposedMethod);

    router.post(
      '/' + exposedMethod,
      async (req: RequestWithAgent, res: Response, next: NextFunction) => {
        if (!req.agent) throw Error('Agent not available');
        try {
          const result = await req.agent.execute(exposedMethod, req.body);
          res.status(200).json(result);
        } catch (e: any) {
          if (e.name === 'ValidationError') {
            res.status(400).json({
              name: 'ValidationError',
              message: e.message,
              method: e.method,
              path: e.path,
              code: e.code,
              description: e.description,
            });
          } else {
            res.status(500).json({ error: e.message });
          }
        }
      },
    );
  }
  return router;
};
