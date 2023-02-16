import { ApiErrors } from './apiErrors';
import { ErrorObject } from 'ajv';
import { ApiError } from './apiError';

class AjvSchemaValidationError extends ApiErrors {
  /** HTTP Status code for error that occured */
  public httpStatusCode = 422;

  constructor(errors?: ErrorObject<string, Record<string, any>, unknown>[]) {
    super();
    if (errors) {
      this.addAJVErrors(errors);
    }
  }

  /**
   *
   * @param errors ajv validation errors array
   */
  public addAJVErrors(
    errors: ErrorObject<string, Record<string, any>, unknown>[]
  ) {
    errors.forEach((error) => {
      const params: { missingProperty?: string; additionalProperty?: string } =
        error.params;

      const required =
        params?.missingProperty &&
        `${error.instancePath}/${params.missingProperty}`;

      const additionalProperty =
        params?.additionalProperty &&
        `${error.instancePath}/${params?.additionalProperty}`;

      const path =
        required ??
        additionalProperty ??
        error.instancePath ??
        error.schemaPath;

      this.addErrorDetail(
        ApiError.VALIDATION_ERROR_ID,
        `ValidationError`,
        `${path}: ${error.message}`
      );
    });
  }
}

export { AjvSchemaValidationError };
