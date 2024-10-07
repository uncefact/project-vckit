import { Router, json } from 'express';
import { VCApiDocsRouter } from './vc-api-docs-router.js';
import { VCApiSchemaRouter } from './vc-api-schema-router.js';
import { VCRouter } from './vc-router.js';
import { apiKeyAuth } from '@vckit/remote-server';

export function V2VcRouter(options: any): Router {
  const router = Router();
  router.use(VCApiDocsRouter());
  router.use(VCApiSchemaRouter(options));
  if (options.apiKey) {
    console.log('Using API key auth');
    router.use(apiKeyAuth(options.apiKey));
  }
  router.use(VCRouter());

  return router;
}
