import { Router } from 'express';
import YAML from 'yaml';
import fs from 'fs';
import { RequestWithAgent } from './types/request-type.js';

/**
 * @public
 */
export interface ApiSchemaRouterOptions {
  /**
   * Base path
   */
  basePath: string;
}

/**
 * Creates a router that exposes vc-api OpenAPI schema
 *
 * @param options - Initialization option
 * @returns Expressjs router
 *
 * @public
 */
export const VCApiSchemaRouter = (options: ApiSchemaRouterOptions): Router => {
  const router = Router();

  router.get('/', (req: RequestWithAgent, res) => {
    const file = fs.readFileSync(
      'packages/vc-api/src/vc-api-schemas/vc-api.yaml',
      'utf8'
    );
    const schema = YAML.parse(file);
    const url =
      (req.headers['x-forwarded-proto'] || req.protocol) +
      '://' +
      req.hostname +
      options.basePath;
    schema.servers = [{ url }];
    res.json(schema);
  });

  return router;
};
