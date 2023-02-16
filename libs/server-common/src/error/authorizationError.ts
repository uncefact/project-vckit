import { ApiErrors } from './api/apiErrors';
import { ApplicationError } from './applicationError';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code to indicate that a client request is unauthorized.
 *
 * As this inherits from the [[ApplicationError]] class, it can be converted into an
 * object compliant with Departmental RESTful API Error Handling standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class AuthorizationError extends ApplicationError {

    /**
     * The HTTP status code returned by the API when it encounters an internal
     * System Error.
     */
    private static readonly AUTHORIZATION_HTTP_ERROR = 500;

    /**
     * The resource that is attempting to be accessed.
     */
    private resource: string;

    /**
     * The user that is attempting to be access the resource.
     */
    private user: string | undefined;

    /**
     * The name of the attribute being used to determine access (i.e. role, abn,
     * etc...)
     */
    private attribute: string | undefined;

    /**
     * The value of the attribute being used to determine access (i.e. role,
     * abn, etc...)
     */
    private attributeValue: string | undefined;

    /**
     * Constructs an [[AuthorizationError]] for an attempt to access the given
     * _resource_.
     *
     * @param {string} resource The resource that was being attempted to be accessed.
     * @param {string | undefined} user The user that is attempting to accessed
     * the resource.
     * @param {string | undefined} attribute The name of the attribute
     * being used to determine access.
     * @param { string | undefined} attributeValue The value of the attribute
     * being used to determine access.
     */
    public constructor(
        resource: string,
        user?: string,
        attribute?: string,
        attributeValue?: string
    ) {
        super(
            ((user) ? ('User [' + user + '] ') : 'User ')
                + ((attribute) ? (' with [' + attribute + '] = [' + attributeValue + '] ') : '')
                + 'is not authorized to access [' + resource + ']',
            AuthorizationError.AUTHORIZATION_HTTP_ERROR
        );

        this.resource = resource;
        this.user = user;
        this.attribute = attribute;
        this.attributeValue = attributeValue;
    }

    /**
     * Convert the current [[AuthorizationError]] into an [[ApiErrors]] object suitable
     * return within an DVP REST API Call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public override toApiError = (): ApiErrors => {

        const apiErrors = new ApiErrors();

        const detail = ((this.user) ? ('User [' + this.user + '] ') : 'User ')
            + ((this.attribute) ? ('with [' + this.attribute + '] = [' + this.attributeValue + '] ') : '')
            + 'is not authorized to access [' + this.resource + ']';

        apiErrors.addErrorDetail(
            'DVPAPI-003',
            'SecurityError',
            detail,
            undefined,
            'https://www.abf.gov.au/help-and-support/contact-us',
            'The user associated with the HTTP request made to the API is not '
                + 'authorized to perform the desired operation.  '
                + 'Please check that the resource your user is attempting access '
                + 'is correct, and that you are allowed to perform the given API operation.'
        );

        return apiErrors;

    };
}

export { AuthorizationError };
