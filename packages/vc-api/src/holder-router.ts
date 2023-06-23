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

/**
 *
 * Creates a router for handling holder-related routes.
 * @public
 * @returns {Router} The Express router configured for holder routes.
 */
export const HolderRouter = (): Router => {
  const router = Router();
  router.use(json({ limit: '10mb' }));

  router.get('/credentials/:id', getCredential);

  router.get('/credentials', getCredentials);

  router.delete('/credentials/:id', deleteCredential);

  router.post('/credentials/derive', deriveCredential);

  router.get('/presentations/:id', getPresentation);

  router.get('/presentations', getPresentations);

  router.post('/presentations/prove', provePresentation);

  router.delete('/presentations/:id', deletePresentation);

  router.get('/exchanges', getExchanges);

  router.post('/exchanges/:exchangeId', initiateExchange);

  router.post('/exchanges/:exchangeId/:transactionId', receiveExchange);

  return router;
};
