import { Router, json } from 'express';
import { VCApiDocsRouter } from './vc-api-docs-router.js';
import { VCApiSchemaRouter } from './vc-api-schema-router.js';
import { VCRouter } from './vc-router.js';

export function V2VcRouter(options: any): Router {
  const router = Router();
  router.use(VCRouter());
  router.use(VCApiDocsRouter());
  router.use(VCApiSchemaRouter(options));

  return router;
}
