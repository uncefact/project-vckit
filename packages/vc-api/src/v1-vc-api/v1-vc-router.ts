import { Router, json } from 'express';
import { VCApiSchemaRouter } from './vc-api-schema-router.js';
import { VCRouter } from './vc-router.js';
import { VCApiDocsRouter } from './vc-api-docs-router.js';
import { apiKeyAuth } from '@vckit/remote-server';

export function V1VcRouter(options: any): Router {
  const router = Router();
  router.use(VCApiDocsRouter());
  router.use(VCApiSchemaRouter(options));
  router.use(apiKeyAuth(options.apiKey));
  router.use(VCRouter());

  return router;
}
