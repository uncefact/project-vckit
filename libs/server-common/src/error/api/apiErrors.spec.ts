
import { ApiError } from './apiError';
import { ApiErrors } from './apiErrors';
import { ApiErrorLocation, ApiErrorSource } from './apiErrorSource';

describe('ApiErrors', () => {

    it('should contain a "SystemError" code when creating a DVPAPI-001 error.', () => {
        const apiErrors: ApiErrors = new ApiErrors();
        apiErrors.addErrorById('DVPAPI-001');
        expect(apiErrors.errors[0].code).toMatch(/SystemError/);
    });

    it('should have a helpURL', () => {
        const apiErrors: ApiErrors = new ApiErrors();
        apiErrors.addErrorById('DVPAPI-001');
        expect(apiErrors.errors[0].helpUrl).toBeDefined();
    });

    it('should have helpText', () => {
        const apiErrors: ApiErrors = new ApiErrors();
        apiErrors.addErrorById('DVPAPI-001');
        expect(apiErrors.errors[0].helpText).toBeDefined();
    });

    it('should contain details describing the system error', () => {
        const apiErrors: ApiErrors = new ApiErrors();
        apiErrors.addErrorById('DVPAPI-001');
        const error: string = JSON.stringify(apiErrors);
        expect(error).toMatch(/An internal system error has occurred./);
    });

    it('should have the code "Error" when creating an "Unknown" standard error', () => {
        const apiErrors: ApiErrors = new ApiErrors();
        apiErrors.addErrorById('Unknown');
        expect(apiErrors.errors[0].code).toBe('Error');
    });

    it('should not contain an "id" when creating an "code" / "description" error', () => {
        const apiErrors: ApiErrors = new ApiErrors();
        apiErrors.addErrorCode('UnknownError', 'An unknown error occurred');
        expect(apiErrors.errors[0].id).toBeUndefined();
    });

    it('should have a formatted details string when generating a standard error', () => {
        const apiErrors: ApiErrors = new ApiErrors();

        apiErrors.addErrorById(
            ApiError.VALIDATION_ERROR_ID,
            'value1',
            'field1'
        );

        expect(apiErrors.errors[0].detail).toEqual(
            'The value [value1] of the [field1] field is invalid.'
        );
    });

    it('should contain all specified fields when created using the addErrorDetail method', () => {
        const apiErrors: ApiErrors = new ApiErrors();

        apiErrors.addErrorDetail(
            'DVPAPI-000',
            'DefaultError',
            'This is the default error',
            new ApiErrorSource(ApiErrorLocation.REQUEST),
            'http://example.com',
            'No help available'
        );

        expect(apiErrors.errors[0].id).toBe('DVPAPI-000');
        expect(apiErrors.errors[0].code).toBe('DefaultError');
        expect(apiErrors.errors[0].detail).toBe('This is the default error');
        expect(apiErrors.errors[0].helpUrl).toBe('http://example.com');
        expect(apiErrors.errors[0].helpText).toBe('No help available');
    });

    it('should return a "true" isEmpty() function if there are no errors', () => {
        const apiErrors: ApiErrors = new ApiErrors();

        expect(apiErrors.isEmpty()).toBe(true);

        apiErrors.addErrorById('Unknown');

        expect(apiErrors.isEmpty()).toBe(false);
    });

    it('should be able to return multiple errors', () => {
        const apiErrors: ApiErrors = new ApiErrors();

        apiErrors.addError(ApiError.fromId('DVPAPI-001'));
        apiErrors.addError(ApiError.fromId('DVPAPI-002'));
        apiErrors.addError(ApiError.fromId('DVPAPI-003'));

        expect(apiErrors.errors).toBeDefined();
        expect(apiErrors.errors.length).toEqual(3);
        expect(apiErrors.errors[0].id).toEqual('DVPAPI-001');
        expect(apiErrors.errors[1].id).toEqual('DVPAPI-002');
        expect(apiErrors.errors[2].id).toEqual('DVPAPI-003');
    });
});
