import { ApiError } from './api/apiError';
import { ApiErrors } from './api/apiErrors';
import { ApplicationError } from './applicationError';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code to indicate that an internal System Error has occurred.
 *
 * As this inherits from the [[ApplicationError]] class, it can be converted into an
 * object compliant with Departmental RESTful API Error Handling standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class SystemError extends ApplicationError {
  /**
   * The HTTP status code returned by the API when it encounters an internal
   * System Error.
   */
  private static readonly SYSTEM_HTTP_ERROR = 500;

  /**
   * The underlying TypeScript [[Error]] which caused this [[SystemError]].
   */
  private cause: Error;

  /**
   * Constructs a [[SystemError]] for a given [[Error]].
   *
   * @param {Error} cause The underlying TypeScript [[Error]] which caused this
   * [[SystemError]].
   */
  public constructor(cause: Error) {
    super(
      cause?.message?.length !== 0 ? cause.message : 'System Error',
      SystemError.SYSTEM_HTTP_ERROR
    );

    this.cause = cause;
  }

  /**
   * Convert the current [[SystemError]] into an [[ApiErrors]] object suitable
   * return within an DVP REST API Call.
   *
   * @return {ApiErrors} An object describing the [[Error]] that has occurred
   * in a format compliant with the Departmental REST standards.
   */
  public override toApiError = (): ApiErrors => {
    const apiErrors = new ApiErrors();

    apiErrors.addErrorById(ApiError.SYSTEM_ERROR_ID);

    return apiErrors;
  };
}

export { SystemError };
