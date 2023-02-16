import { ApiError } from './api/apiError';
import { ApiErrors } from './api/apiErrors';
import { ApplicationError } from './applicationError';

/**
 * A custom TypeScript [[Error]] that can be thrown by the **DVP** TypeScript
 * code to indicate that an incoming RESTful API request contains a validation
 * error.
 *
 * As this inherits from the [[ApplicationError]] class, it can be converted into an
 * object compliant with Departmental RESTful API Error Handling standards.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class ValidationError extends ApplicationError {

    /**
     * The HTTP status code returned by the API when a validation error is
     * encountered.
     */
    private static readonly VALIDATION_HTTP_ERROR = 422;

    /**
     * A JSON pointer to the field (i.e. `/data/senderReference`) within an
     * incoming REST API call that is 'invalid'.
     */
    private fieldPointer: string;

    /**
     * The value of the field which is invalid.
     */
    private value: string;

    /**
     * Constructs a [[ValidationError]] for a given _fieldPointer_ / _value_.
     *
     * @param {string} fieldPointer A JSON pointer to the field
     * (i.e. `/data/senderReference`) with an incoming REST API call that is
     * 'invalid'.
     * @param {string} value The value of the field which is invalid.
     */
    public constructor(fieldPointer: string, value: string) {
        super(
            `The value [${value}] is not valid for the [${fieldPointer}] field.`,
            ValidationError.VALIDATION_HTTP_ERROR
        );

        this.fieldPointer = fieldPointer;
        this.value = value;
    }

    /**
     * Convert the current [[ValidationError]] into an [[ApiErrors]] object suitable
     * return within an **DVP** API Call.
     *
     * @return {ApiErrors} An object describing the [[Error]] that has occurred
     * in a format compliant with the Departmental REST standards.
     */
    public override toApiError = (): ApiErrors => {

        const apiErrors = new ApiErrors();

        apiErrors.addErrorById(
            ApiError.VALIDATION_ERROR_ID,
            this.value,
            this.fieldPointer
        );

        return apiErrors;

    };
}

export { ValidationError };

