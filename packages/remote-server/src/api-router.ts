import { IAgent } from '@vckit/core-types';
import swaggerUi from 'swagger-ui-express';
import { Request, Response, NextFunction, Router } from 'express';
import Debug from 'debug';
import swaggerDocument from './swagger/swagger.json' assert { type: 'json' };
import { updateSwagger } from './swagger/helpers.js';
import fs from 'fs';

interface RequestWithAgent extends Request {
  agent?: IAgent;
}

const VERSION_FILE = 'version.json';

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

    const apiVersion = getApiVersion();

    router.post(
      `/${apiVersion}/${exposedMethod}`,
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

export const SwaggerApiDocsRouter = (): Router => {
  const router = Router();
  const apiVersion = getApiVersion();

  let swaggerJson: any = { ...swaggerDocument };

  router.use(
    '/',
    (req: any, res: any, next: any) => {
      const url = `${req.protocol}://${req.hostname}:${req.socket.localPort}/api/${apiVersion}`;
      swaggerJson = updateSwagger(swaggerJson, { version: apiVersion, url });
      req.swaggerDoc = swaggerJson;
      next();
    },
    swaggerUi.serveFiles(swaggerJson, {}),
    swaggerUi.setup(),
  );

  return router;
};

export const SwaggerApiSchemaRouter = (): Router => {
  const router = Router();
  const apiVersion = getApiVersion();

  router.get('/', (req: RequestWithAgent, res) => {
    if (req.agent) {
      const url = `${req.protocol}://${req.hostname}:${req.socket.localPort}/api/${apiVersion}`;
      swaggerDocument.servers = [{ url }] as any;
      (swaggerDocument.info as any).version = apiVersion as string;

      res.json(swaggerDocument);
    } else {
      res.status(500).json({ error: 'Agent not available' });
    }
  });

  return router;
};

const getApiVersion = () => {
  const version = fs.readFileSync(VERSION_FILE, 'utf8');
  const { apiVersion } = JSON.parse(version);

  if (!apiVersion) throw Error('API version not found');
  return apiVersion;
};
