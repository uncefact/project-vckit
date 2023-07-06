import { Router, json } from 'express';
import {
  deleteCredential,
  deletePresentation,
  deriveCredential,
  getCredential,
  getCredentials,
  getExchanges,
  getPresentation,
  getPresentations,
  initiateExchange,
  provePresentation,
  receiveExchange,
} from './controllers/holder-controller.js';
import { validatorMiddleware } from './validator-middleware.js';

/**
 *
 * Creates a router for handling holder-related routes.
 * @public
 * @returns {Router} The Express router configured for holder routes.
 */
export const HolderRouter = (): Router => {
  const router = Router();
  router.use(json({ limit: '10mb' }));

  router.get('/credentials/:id', validatorMiddleware(), getCredential);

  router.get('/credentials', validatorMiddleware(), getCredentials);

  router.delete('/credentials/:id', validatorMiddleware(), deleteCredential);

  router.post('/credentials/derive', validatorMiddleware(), deriveCredential);

  router.get('/presentations/:id', validatorMiddleware(), getPresentation);

  router.get('/presentations', validatorMiddleware(), getPresentations);

  router.post('/presentations/prove', validatorMiddleware(), provePresentation);

  router.delete(
    '/presentations/:id',
    validatorMiddleware(),
    deletePresentation
  );

  router.get('/exchanges', validatorMiddleware(), getExchanges);

  router.post(
    '/exchanges/:exchangeId',
    validatorMiddleware(),
    initiateExchange
  );

  router.post(
    '/exchanges/:exchangeId/:transactionId',
    validatorMiddleware(),
    receiveExchange
  );

  return router;
};
