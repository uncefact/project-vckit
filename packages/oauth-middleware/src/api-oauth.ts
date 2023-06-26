import { Router } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

interface OAuthOptions {
  issuerBaseURL: string;
  audience: string;
}

/**
 * Creates an Express router with OAuth2 JWT bearer token authentication middleware.
 *
 * @public
 * @param {object} options - The options for configuring OAuth2 authentication.
 * @param {string} options.issuerBaseURL - The base URL of the token issuer.
 * @param {string} options.audience - The audience for the token.
 * @returns {Router} The Express router with OAuth2 authentication middleware.
 * @throws {Error} If either the issuerBaseURL or audience is missing or not a string.
 */
export function apiOAuth({ issuerBaseURL, audience }: OAuthOptions): Router {
  const router = Router();
  if (!issuerBaseURL || typeof issuerBaseURL !== 'string') {
    throw new Error('issuerBaseURL is required');
  }
  if (!audience || typeof audience !== 'string') {
    throw new Error('audience is required');
  }
  const requiresAuth = auth({ issuerBaseURL, audience });
  router.use(requiresAuth);
  return router;
}
