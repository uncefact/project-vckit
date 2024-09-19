import { Router, json, urlencoded } from 'express';
import { logger } from './logger.js';

export function loggerMiddleware(): Router {
  const router = Router();
  router.use(urlencoded({ extended: false }));
  router.use(json());

  router.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    logger.info(`Headers: ${JSON.stringify(req.headers)}`);

    if (req.method === 'POST' || req.method === 'PUT') {
      logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    }

    next();
  });

  return router;
}
