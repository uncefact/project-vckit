import path from 'path';
import * as OpenApiValidator from 'express-openapi-validator';
import { Router } from 'express';

export const validatorMiddleware = (): Router => {
  const router = Router();
  router.use(
    OpenApiValidator.middleware({
      apiSpec: path.join(
        path.resolve(),
        'packages/vc-api/src/vc-api-schemas/vc-api.yaml',
      ),
      validateRequests: true,
      validateResponses: false,
    }),
  );
  return router;
};
