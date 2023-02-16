import { ApiError } from './api/apiError';
import { ApiErrors } from './api/apiErrors';
import { ApplicationError } from './applicationError';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code to indicate that a given RESTful API resource cannot be found.
 *
 * As this inherits from the [[ApplicationError]] class, it can be converted into an
 * object compliant with Departmental RESTful API Error Handling standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class NotFoundError extends ApplicationError {

    /**
     * The HTTP status code returned by the API when a given API method has not
     * (yet) been implemented for a given API resource.
     */
    private static readonly NOT_FOUND_HTTP_ERROR = 404;

    /**
     * The resource
     * (i.e. `/flights/arrivals/c0c191b3-be3e-42f6-968c-625ed7223627`) that was not
     * found.
     */
    private resource: string;

    /**
     * Constructs a [[NotFoundError]] for a given _resource_ / _method_.
     *
     * @param {string} resource The resource (i.e. `/flights/arrivals`) of the
     * REST call that has yet to be implemented.
     */
    public constructor(resource: string) {
        super(`Could not find resource [${resource}].`, NotFoundError.NOT_FOUND_HTTP_ERROR);
        this.resource = resource;
    }

    /**
     * Convert the current [[NotFoundError]] into an [[ApiErrors]] object
     * suitable return within an DVP REST API Call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public override toApiError = (): ApiErrors => {

        const apiErrors = new ApiErrors();

        apiErrors.addErrorById(
            ApiError.NOT_FOUND_ERROR_ID,
            this.resource
        );

        return apiErrors;

    };
}

export { NotFoundError };

