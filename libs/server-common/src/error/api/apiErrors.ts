import { ApiError } from './apiError';
import { ApiErrorSource } from './apiErrorSource';

/**
 * An object that encapsulates a set of RESTful API errors.
 *
 * This object is expected to be included within the body of non-20X responses
 * from an API so as to indicate to the cause of an error.
 *
 * It has been designed to comply with the Home Affairs Enterprise Integration
 * Service standards for API error messages.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class ApiErrors {

    /** An array of all [[ApiError]]s that have occurred. */
    public errors: ApiError[] = [];

    /**
     * Returns true if this object contains any errors.
     */
    public isEmpty(): boolean {
        return this.errors.length === 0;
    }

    /**
     * Adds an [[ApiError]] error to the [[errors]] array.
     *
     * @param error the ApiError to add.
     */
    public addError(error: ApiError): ApiErrors {
        this.errors.push(error);
        return this;
    }

    /**
     * Add a 'pre-defined' error to the [[errors]] array.
     *
     * @param {string} id The identifier of the 'pre-defined' ApiError.  This
     * will be 'looked-up' in the [[ApiError.STANDARD_API_ERRORS_LIST]] array.
     * @param {string[]} args The parameters passed to the
     * [[ApiError.STANDARD_API_ERRORS_LIST]] `ApiError.detail` format string.
     * These will replace the '{n}' position holders within the
     * `ApiError.detail` string.
     */
    public addErrorById(id: string, ...args: string[]): ApiErrors {
        this.errors.push(ApiError.fromId(id, ...args));
        return this;
    }

    /**
     * Add a (minimal) 'custom' error to the [[errors]] array.
     *
     * @param code An application specific error code.
     * @param detail A human-readable explanation specific to this occurrence of
     * the problem.
     */
    public addErrorCode(code: string, detail: string): ApiErrors {
        this.errors.push(ApiError.fromCode(code, detail));
        return this;
    }

    /**
     * Add a fully defined 'custom' error, with an 'id', 'code', 'detail',
     * 'source', 'helpUrl', and 'helpText'.
     *
     * @param {string} id Identifier of the specific error.
     * @param {string} code An application specific error code.
     * @param {string} detail A human-readable explanation specific to this occurrence of the problem.
     * @param {ApiErrorSource} source An object containing references to the source of the error.
     * @param {string} helpUrl A URL which leads to further details about the error (e.g. help page).
     * @param {string} helpText Help text which can provide further assistance on the error.
     */
    public addErrorDetail(
        id: string,
        code: string,
        detail: string,
        source?: ApiErrorSource,
        helpUrl?: string,
        helpText?: string
    ): ApiErrors {
        this.errors.push(ApiError.fromDetail(id, code, detail, source, helpUrl, helpText));
        return this;
    }
}

export { ApiErrors };

