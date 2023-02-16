/**
 * This file is a [TypeScript](https://www.typescriptlang.org/) file developed
 * for the Department of Home Affairs **DVP** (Integrated Cargo System)
 * Capability Uplift Project.
 *
 * This script defines a TypeScript Type for the [[ApplicationError]] class.
 *
 * The [[ApplicationError]] class is a custom TypeScript [[Error]] that can be thrown by
 * the **DVP** code and converted into a RESTful [[ApiErrors]] object compliant
 * with Departmental REST standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 *
 * @module server-common.error
 * @author Brian Kavanagh
 * @since 2020-09-07
 */
import { ApiError } from './api/apiError';
import { ApiErrors } from './api/apiErrors';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code and converted into a RESTful [[ApiErrors]] object compliant with
 * Departmental standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class ApplicationError extends Error {

    /**
     * The default HTTP status code returned by the API if no explicit HTTP
     * status code is specified.
     */
    private static readonly DEFAULT_HTTP_ERROR = 500;

    /**
     * The HTTP Status Code to be returned by the RESTful API when this error is
     * encountered.
     */
    public httpStatusCode: number;

    /**
     * Constructs an [[ApplicationError]].
     *
     * @param {string} message A human readable description of the error.
     * @param {number} httpStatusCode The (optional) HTTP Status code to be
     * returned by the API when this error occurs.
     */
    public constructor(message: string, httpStatusCode?: number) {
        super(message);
        this.httpStatusCode = (httpStatusCode) ? httpStatusCode : ApplicationError.DEFAULT_HTTP_ERROR;
    }

    /**
     * Convert the current [[ApplicationError]] into an [[ApiErrors]] object suitable
     * return within a DVP REST API call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public toApiError = (): ApiErrors => {
        const apiErrors = new ApiErrors();
        apiErrors.addErrorById(ApiError.SYSTEM_ERROR_ID);
        return apiErrors;
    };
}

export { ApplicationError };

