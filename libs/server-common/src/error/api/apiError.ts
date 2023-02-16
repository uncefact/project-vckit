import { ApiErrorSource } from './apiErrorSource';

/**
 * An interface describing an API error.
 *
 * This interface has been designed to comply with the Home Affairs Enterprise
 * Integration Service standards for API error messages.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
interface ApiErrorBase {
  /** Identifier of the specific error. */
  id?: string;

  /** An application-specific error code. */
  code: string;

  /** A human-readable explanation specific to this occurrence of the problem. */
  detail: string;

  /** An object containing references to the source of the error. */
  source?: ApiErrorSource;

  /** A URL which leads to further details about the error (e.g. help page). */
  helpUrl?: string;

  /** Help text which can provide further assistance on the error. */
  helpText?: string;
}

/**
 * A standard set of [[ApiErrorBase]] objects.
 */
const STANDARD_API_ERRORS_LIST: ApiErrorBase[] = [
  {
    id: 'DVPAPI-001',
    code: 'SystemError',
    detail: 'An internal system error has occurred.',
    helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
    helpText: 'An internal system error has occurred. Please contact Support.',
  },
  {
    id: 'DVPAPI-002',
    code: 'ValidationError',
    detail: 'The value [{0}] of the [{1}] field is invalid.',
    helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
    helpText: 'Please check the value of the field and re-submit.',
  },
  {
    id: 'DVPAPI-003',
    code: 'SecurityError',
    detail: 'You are not allowed to access [{0}].',
    helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
    helpText:
      'The permissions given to your API client id do not allow you to access the resource. ' +
      'please check that your security credentials are correct, ' +
      'and that you are attempting to access the correct resource.',
  },
  {
    id: 'DVPAPI-004',
    code: 'NotFound',
    detail: 'Could not find [{0}].',
    helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
    helpText:
      'The specified resource could not be found.  ' +
      'Please check that your security credentials are correct, ' +
      'and that you are attempting to access the correct resource.',
  },
  {
    id: 'DVPAPI-005',
    code: 'NotImplemented',
    detail:
      'The [{0}] method has not yet been implemented for the [{1}] resource.',
    helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
    helpText:
      'The specified method for the given resource has yet to be implemented.  ' +
      'Please check that you are calling the correct resource with the correct method, ' +
      'or check with the support to determine when the given resource will be implemented.',
  },
  {
    id: 'DVPAPI-006',
    code: 'WebServiceTimeout',
    detail: 'A timeout occurred in the [{0}] web service after [{1}] seconds.',
    helpUrl: 'https://www.abf.gov.au/help-and-support/contact-us',
    helpText:
      'A timeout occurred while attempting to invoke a web service. This may be a temporary ' +
      'condition caused by underlying network conditions.',
  },
];

/**
 * An object used to encapsulate an API error.
 *
 * This object has been designed to comply with the Home Affairs Enterprise
 * Integration Service standards for API error messages.
 *
 * @see [Error Handling](https://confluence.bcz.gov.au/display/EI/Error+Handling)
 */
class ApiError implements ApiErrorBase {
  /**
   * The ApiError Id which represents 'System Errors'.
   */
  public static readonly SYSTEM_ERROR_ID = 'DVPAPI-001';

  /**
   * The ApiError Id which represents 'Validation Errors'.
   */
  public static readonly VALIDATION_ERROR_ID = 'DVPAPI-002';

  /**
   * The ApiError Id which represents 'Security Errors'.
   */
  public static readonly SECURITY_ERROR_ID = 'DVPAPI-003';

  /**
   * The ApiError Id which represents 'Not Found'.
   */
  public static readonly NOT_FOUND_ERROR_ID = 'DVPAPI-004';

  /**
   * The ApiError Id which represents 'Not Implemented'.
   */
  public static readonly NOT_IMPLEMENTED_ID = 'DVPAPI-005';

  /**
   * The ApiError Id which represents 'Web Service Timeout'.
   */
  public static readonly WEB_SERVICE_TIMEOUT_ID = 'DVPAPI-006';

  /**
   * The ApiError Id which represents 'Bad Request Error'.
   */
  public static readonly BAD_REQUEST_ID = 'DVPAPI-007';

  /** Identifier of the specific error. */
  public id?: string;

  /** An application-specific error code. */
  public code: string;

  /** A human-readable explanation specific to this occurrence of the problem. */
  public detail: string;

  /** An object containing references to the source of the error. */
  public source?: ApiErrorSource;

  /** A URL which leads to further details about the error (e.g. help page). */
  public helpUrl?: string;

  /** Help text which can provide further assistance on the error. */
  public helpText?: string;

  /**
   * Creates an error, with an 'id', 'code', 'detail', 'source', 'helpUrl' and 'helpText'.
   *
   * @param {string} id Identifier of the specific error.
   * @param {string} code An application specific error code.
   * @param {string} detail A human-readable explanation specific to this occurrence of the problem.
   * @param {ApiErrorSource} source An object containing references to the source of the error.
   * @param {string} helpUrl A URL which leads to further details about the error (e.g. help page).
   * @param {string} helpText Help text which can provide further assistance on the error.
   */
  public constructor(
    id: string | undefined,
    code: string,
    detail: string,
    source?: ApiErrorSource,
    helpUrl?: string,
    helpText?: string
  ) {
    this.id = id;
    this.code = code;
    this.detail = detail;
    this.source = source;
    this.helpUrl = helpUrl;
    this.helpText = helpText;
  }

  /**
   * Replace the placeholders ('{n}') within a _format_ string with
   * parameters.
   *
   * i.e.
   * ```
   * ApiError.format('{0} {1}!', ['Hello', 'World'])
   * ```
   * would return:
   * ```
   * 'Hello World!'
   * ```
   *
   * @param format The format string (containing position placeholders of the
   * form '{n}' that are to be replaced with the values from the _args_
   * parameter.)
   * @param args An array of strings that will be used to replace the '{n}'
   * position placeholders within the _format_ string.
   *
   * @return The input _format_ string with the '{n}' position placeholders
   * replaced by the values within the _args_ array.
   */
  public static format(format: string, ...args: string[]): string {
    let formatted: string = format;

    for (let i = 0; i < args.length; i++) {
      formatted = formatted.replace(new RegExp(`\\{${i}\\}`, 'g'), args[i]);
    }

    return formatted;
  }

  /**
   * Create a 'pre-defined' error from the [[STANDARD_API_ERRORS_LIST]] array.
   *
   * @param {string} id The identifier of the 'pre-defined' [[ApiError]].  The
   * other properties within the returned [[ApiError]] will be 'looked-up' in
   * the [[STANDARD_API_ERRORS_LIST]] array.
   * @param {string[]} args The parameters passed to the
   * [[ApiError.STANDARD_API_ERRORS_LIST]] `ApiError.detail` format string.
   * These will replace the '{n}' position holders within the `detail` string.
   */
  public static fromId(id: string, ...args: string[]): ApiError {
    // Attempt to 'lookup' the error with the given 'id' in the 'api.errors.json' file.
    const standardError = STANDARD_API_ERRORS_LIST.filter((error) => {
      return error.id === id;
    });

    let apiError: ApiError;

    if (standardError.length) {
      apiError = new ApiError(
        id,
        standardError[0].code,
        ApiError.format(standardError[0].detail, ...args),
        undefined,
        standardError[0].helpUrl,
        standardError[0].helpText
      );
    } else {
      apiError = new ApiError(id, 'Error', 'An error has occurred.');
    }

    return apiError;
  }

  /**
   * Creates a 'minimal' error, with just a 'code' and 'detail'.
   *
   * @param {string} code An application specific error code.
   * @param {string} detail A human-readable explanation specific to this occurrence of the problem.
   */
  public static fromCode(code: string, detail: string): ApiError {
    return new ApiError(undefined, code, detail);
  }

  /**
   * Creates an error, with an 'id', 'code', 'detail', 'source', 'helpUrl' and 'helpText'.
   *
   * @param {string} id Identifier of the specific error.
   * @param {string} code An application specific error code.
   * @param {string} detail A human-readable explanation specific to this occurrence of the problem.
   * @param {ApiErrorSource} source An object containing references to the source of the error.
   * @param {string} helpUrl A URL which leads to further details about the error (e.g. help page).
   * @param {string} helpText Help text which can provide further assistance on the error.
   */
  public static fromDetail(
    id: string,
    code: string,
    detail: string,
    source?: ApiErrorSource,
    helpUrl?: string,
    helpText?: string
  ): ApiError {
    return new ApiError(id, code, detail, source, helpUrl, helpText);
  }
}

export { ApiError };
