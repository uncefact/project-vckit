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
class SecurityError extends ApplicationError {

    /**
     * The HTTP status code returned by the API when it encounters an internal
     * Security Error.
     */
    private static readonly SECURITY_HTTP_ERROR = 403;

    /**
     * The underlying TypeScript [[Error]] which caused this [[SecurityError]].
     */
    private cause: Error;

    /**
     * Constructs a [[SecurityError]] for a given [[Error]].
     *
     * @param {Error} cause The underlying TypeScript [[Error]] which caused this
     * [[SecurityError]].
     * @param message The message for the error.
     */
    public constructor(cause: Error, message?: string) {
        super(
            (message ? message + ': ' : '') +
                (cause.message ? ((message ? message + ': ' : '') + cause.message) : 'Security Error'),
            SecurityError.SECURITY_HTTP_ERROR
        );

        this.cause = cause;
    }

    /**
     * Convert the current [[SecurityError]] into an [[ApiErrors]] object suitable
     * return within an DVP REST API Call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public override toApiError = (): ApiErrors => {

        const apiErrors = new ApiErrors();

        apiErrors.addErrorById(ApiError.SECURITY_ERROR_ID);

        return apiErrors;

    };
}

export { SecurityError };
