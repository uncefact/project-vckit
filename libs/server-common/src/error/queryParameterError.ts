import { ApiErrors } from './api/apiErrors';
import { ApiErrorLocation, ApiErrorSource } from './api/apiErrorSource';
import { ApplicationError } from './applicationError';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code to indicate that a client request containers invalid HTTP Query
 * Parameters.
 *
 * As this inherits from the [[ApplicationError]] class, it can be converted into an
 * object compliant with Departmental RESTful API Error Handling standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class QueryParameterError extends ApplicationError {

    /**
     * The HTTP status code returned by the API when a validation error is
     * encountered.
     */
    private static readonly VALIDATION_HTTP_ERROR = 422;

    /**
     * The name of the query parameter which is invalid.
     */
    private parameterName: string;

    /**
     * The value of the query parameter which is invalid.
     */
    private value: string;

    /**
     * An (optional) detailed description of why the query parameter is invalid.
     */
    private detail: string | undefined;

    /**
     * Constructs an [[QueryParameterError]] for a given _parameterName_ /
     * _value_ / _detail_.
     *
     * @param {string} parameterName The name of the query parameter which is invalid.
     * @param {string} value The value of the query parameter which is invalid.
     * @param {string?} detail An (optional) detailed description of why the
     * query parameter is invalid.
     */
    public constructor(
        parameterName: string,
        value: string,
        detail?: string
    ) {
        super(
            `The value [${value}] is not valid for the [${parameterName}] query parameter`
                + ((detail) ? ('. Reason: ' + detail) : ''),
            QueryParameterError.VALIDATION_HTTP_ERROR
        );

        this.parameterName = parameterName;
        this.value = value;
        this.detail = detail;
    }

    /**
     * Convert the current [[QueryParameterError]] into an [[ApiErrors]] object suitable
     * return within an DVP REST API Call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public override toApiError = (): ApiErrors => {

        const apiErrors = new ApiErrors();

        const detail = 'The value [' + this.value + '] '
            + 'of the [' + this.parameterName + '] query parameter is invalid'
            + ((this.detail) ? ('.  Reason: ' + this.detail) : '.');

        apiErrors.addErrorDetail(
            'DVPAPI-002',
            'ValidationError',
            detail,
            new ApiErrorSource(ApiErrorLocation.QUERY, undefined, this.parameterName),
            'https://www.abf.gov.au/help-and-support/contact-us',
            'The HTTP request made to the API included a HTTP Query Parameter which did '
                + 'not comply with the expected format.  Please check the API specification, '
                + 'and re-submit the HTTP request.'
        );

        return apiErrors;

    };
}

export { QueryParameterError };
