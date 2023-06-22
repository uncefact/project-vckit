import { Router, json } from 'express';
import {
  deleteCredential,
  getCredential,
  getCredentials,
  getPresentation,
  getPresentations,
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

  router.get('/presentations/:id', getPresentation);

  router.get('/presentations', getPresentations);

  return router;
};
