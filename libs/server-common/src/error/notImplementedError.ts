import { ApiError } from './api/apiError';
import { ApiErrors } from './api/apiErrors';
import { ApplicationError } from './applicationError';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code to indicate that a given RESTful API method is not (yet) implemented.
 *
 * As this inherits from the [[ApplicationError]] class, it can be converted into an
 * object compliant with Departmental RESTful API Error Handling standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class NotImplementedError extends ApplicationError {

    /**
     * The HTTP status code returned by the API when a given API method has not
     * (yet) been implemented for a given API resource.
     */
    private static readonly NOT_IMPLEMENTED_HTTP_ERROR = 501;

    /**
     * The resource (i.e. `/flights/arrivals`) that has yet to be implemented.
     */
    private resource: string;

    /**
     * The HTTP method (i.e. `GET`, `POST`, `OPTIONS`, etc...) of the REST call
     * that is yet to be implemented.
     */
    private method: string;

    /**
     * Constructs a [[NotImplementedError]] for a given _resource_ / _method_.
     *
     * @param {string} resource The resource (i.e. `/flights/arrivals`) that has
     * yet to be implemented.
     * @param {string} method The HTTP method (`GET`, `POST`, `OPTIONS`, etc...)
     * of the REST call that is yet to be implemented.
     */
    public constructor(resource: string, method: string) {
        super(
            `The [${method}] method has not yet been implemented for the [${resource}].`,
            NotImplementedError.NOT_IMPLEMENTED_HTTP_ERROR
        );

        this.resource = resource;
        this.method = method;
    }

    /**
     * Convert the current [[NotImplementedError]] into an [[ApiErrors]] object
     * suitable return within an **DVP** API Call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public override toApiError= (): ApiErrors => {

        const apiErrors = new ApiErrors();

        apiErrors.addErrorById(
            ApiError.NOT_IMPLEMENTED_ID,
            this.method,
            this.resource
        );

        return apiErrors;

    };
}

export { NotImplementedError };

