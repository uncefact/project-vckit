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
class BadRequestError extends ApplicationError {
  /**
   * The HTTP status code returned by the API when it encounters an internal
   * System Error.
   */
  private static readonly BAD_REQUEST_HTTP_ERROR = 400;

  /**
   * The underlying TypeScript [[Error]] which caused this [[BadRequestError]].
   */
  private cause: Error;

  /**
   * Constructs a [[BadRequestError]] for a given [[Error]].
   *
   * @param {Error} cause The underlying TypeScript [[Error]] which caused this
   * [[BadRequestError]].
   */
  public constructor(cause: Error) {
    super(
      cause?.message?.length !== 0 ? cause.message : 'Bad Request Error',
      BadRequestError.BAD_REQUEST_HTTP_ERROR
    );

    this.cause = cause;
  }

  /**
   * Convert the current [[BadRequestError]] into an [[ApiErrors]] object suitable
   * return within an DVP REST API Call.
   *
   * @return {ApiErrors} An object describing the [[Error]] that has occurred
   * in a format compliant with the Departmental REST standards.
   */
  public override toApiError = (): ApiErrors => {
    const apiErrors = new ApiErrors();

    apiErrors.addErrorDetail(
      'DVPAPI-002',
      'BadRequestError',
      this.message,
      undefined,
      'https://www.abf.gov.au/help-and-support/contact-us',
      "The HTTP request payload doesn't comply with the expected format. Please check the API specification, and re-submit the HTTP request."
    );

    return apiErrors;
  };
}

export { BadRequestError };
