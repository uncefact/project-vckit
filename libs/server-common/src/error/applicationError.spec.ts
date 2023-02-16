import { ApiErrors } from './api/apiErrors';
import { ApplicationError } from './applicationError';
import { AuthorizationError } from './authorizationError';
import { NotFoundError } from './notFoundError';
import { NotImplementedError } from './notImplementedError';
import { QueryParameterError } from './queryParameterError';
import { SystemError } from './systemError';
import { ValidationError } from './validationError';

/**
 * Check that the `toApiError()` method on an [[ApplicationError]] generates the expected
 * RESTful API object.
 *
 * @param error The [[ApplicationError]] to be checked.
 * @param httpsStatusCode The expected HTTP Status Code to be associated with
 * the given _error_.
 * @param id The expected id to be returned in the RESTful API error.
 * @param code The expected error code to be returned in the RESTful API error.
 * @param detail The expected detail string to be returned in the RESTful API
 * error.
 */
const expectError = (
    error: ApplicationError,
    httpStatusCode: number,
    id: string,
    code: string,
    detail: string
): void => {
    const apiErrors: ApiErrors = error.toApiError();

    expect(error.httpStatusCode).toEqual(httpStatusCode);
    expect(apiErrors).toBeDefined();
    expect(apiErrors.errors).toBeDefined();
    expect(apiErrors.errors.length).toEqual(1);
    expect(apiErrors.errors[0].id).toEqual(id);
    expect(apiErrors.errors[0].code).toEqual(code);
    expect(apiErrors.errors[0].detail).toEqual(detail);
    expect(apiErrors.errors[0].helpUrl).toBeDefined();
    expect(apiErrors.errors[0].helpText).toBeDefined();
};

describe('ApplicationError', () => {

    it('should correctly format an "ApplicationError".', () => {
        const error: ApplicationError = new ApplicationError('Error');
        expect(error).toBeDefined();
        expectError(error, 500, 'DVPAPI-001', 'SystemError', 'An internal system error has occurred.');
    });

    it('should correctly format an empty "SystemError".', () => {
        const error: ApplicationError = new SystemError(new Error());
        expect(error).toBeDefined();
        expectError(error, 500, 'DVPAPI-001', 'SystemError', 'An internal system error has occurred.');
    });

    it('should correctly format a "SystemError".', () => {
        const error: ApplicationError = new SystemError(new Error('Unexpected Error'));
        expect(error).toBeDefined();
        expectError(error, 500, 'DVPAPI-001', 'SystemError', 'An internal system error has occurred.');
    });

    it('should correctly format a "ValidationError".', () => {
        const error: ApplicationError = new ValidationError('/data/senderReference', 'missing');
        expect(error).toBeDefined();
        expectError(
            error,
            422,
            'DVPAPI-002',
            'ValidationError',
            'The value [missing] of the [/data/senderReference] field is invalid.'
        );
    });

    it('should correctly format a "NotFoundError".', () => {
        const error: ApplicationError = new NotFoundError('/flights/arrivals/c0c191b3-be3e-42f6-968c-625ed7223627');
        expect(error).toBeDefined();
        expectError(
            error,
            404,
            'DVPAPI-004',
            'NotFound',
            'Could not find [/flights/arrivals/c0c191b3-be3e-42f6-968c-625ed7223627].'
        );
    });

    it('should correctly format a "NotImplementedError".', () => {
        const error: ApplicationError = new NotImplementedError('/flights/arrivals', 'DELETE');
        expect(error).toBeDefined();
        expectError(
            error,
            501,
            'DVPAPI-005',
            'NotImplemented',
            'The [DELETE] method has not yet been implemented for the [/flights/arrivals] resource.'
        );
    });

    it('should correctly format a "QueryParameterError".', () => {
        const error1: ApplicationError = new QueryParameterError('sort', 'UNKNOWN');
        expect(error1).toBeDefined();
        expectError(
            error1,
            422,
            'DVPAPI-002',
            'ValidationError',
            'The value [UNKNOWN] of the [sort] query parameter is invalid.'
        );

        const error2: ApplicationError = new QueryParameterError(
            'sort',
            'UNKNOWN',
            'Sort must be either ASC or DSC.'
        );
        expect(error2).toBeDefined();
        expectError(
            error2,
            422,
            'DVPAPI-002',
            'ValidationError',
            'The value [UNKNOWN] of the [sort] query parameter is invalid.  Reason: Sort must be either ASC or DSC.'
        );
    });

    it('should correctly format a "AuthorizationError".', () => {

        const error1: ApplicationError = new AuthorizationError('/flights/arrivals/1');
        expect(error1).toBeDefined();
        expectError(
            error1,
            500,
            'DVPAPI-003',
            'SecurityError',
            'User is not authorized to access [/flights/arrivals/1]'
        );

        const error2: ApplicationError = new AuthorizationError('/flights/arrivals/1', 'user1');
        expect(error2).toBeDefined();
        expectError(
            error2,
            500,
            'DVPAPI-003',
            'SecurityError',
            'User [user1] is not authorized to access [/flights/arrivals/1]'
        );

        const error3: ApplicationError = new AuthorizationError(
            '/flights/arrivals/1',
            undefined,
            'abn',
            '33380054835'
        );
        expect(error3).toBeDefined();
        expectError(
            error3,
            500,
            'DVPAPI-003',
            'SecurityError',
            'User with [abn] = [33380054835] is not authorized to access [/flights/arrivals/1]'
        );

        const error4: ApplicationError = new AuthorizationError(
            '/flights/arrivals/1',
            'user1',
            'abn',
            '33380054835'
        );
        expect(error4).toBeDefined();
        expectError(
            error4,
            500,
            'DVPAPI-003',
            'SecurityError',
            'User [user1] with [abn] = [33380054835] is not authorized to access [/flights/arrivals/1]'
        );
    });
});
