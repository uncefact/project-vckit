import { getMockReq } from '@jest-mock/express';
import { RequestInvocationContext } from './request.invocation.context';

describe('Request invocation context implementation', (): void => {
  it('should extract the correlation ID from the request', (): void => {
    const mockRequest = getMockReq({
      method: 'GET',
      headers: {
        'Correlation-ID': 'NUMPTYHEAD1',
      },
    });

    mockRequest.route = { path: '/log' };
    const invocationContext = new RequestInvocationContext(mockRequest);
    expect(invocationContext.correlationId).toBeDefined();
    expect(invocationContext.correlationId).toBe('NUMPTYHEAD1');
  });

  it('should create one if the correlation ID cannot be extracted from the request', (): void => {
    const mockRequest = getMockReq({
      method: 'GET',
      headers: {},
    });

    mockRequest.route = { path: '/log' };
    const invocationContext = new RequestInvocationContext(mockRequest);
    expect(invocationContext.correlationId).not.toBeUndefined();
  });

  it('should extract the remote IP address correctly', (): void => {
    const mockRequest = getMockReq({
      method: 'POST',
      headers: {
        'X-Forwarded-For': '10.10.10.1,20.20.20.1,30.30.30.1',
      },
      body: {
        key1: 'value1',
        key2: 'value2',
      },
      socket: {
        remoteAddress: '5.5.5.109',
      },
    });

    mockRequest.route = { path: '/log' };
    const invocationContext1 = new RequestInvocationContext(mockRequest);
    expect(invocationContext1.ipAddress).toBe('10.10.10.1');

    mockRequest.headers['X-Forwarded-For'] = '8.8.8.23';

    const invocationContext2 = new RequestInvocationContext(mockRequest);
    expect(invocationContext2.ipAddress).toBe('8.8.8.23');

    mockRequest.headers['X-Forwarded-For'] = undefined;

    const invocationContext3 = new RequestInvocationContext(mockRequest);
    expect(invocationContext3.ipAddress).toBe('5.5.5.109');
  });

  it('should extract the correlation ID correctly', (): void => {
    const mockRequest = getMockReq({
      method: 'PUT',
      headers: {
        'Correlation-ID': 'abc123',
      },
      body: {
        key1: 'value1',
        key2: 55,
      },
    });
    mockRequest.route = { path: '/log' };
    const invocationContext1 = new RequestInvocationContext(mockRequest);
    expect(invocationContext1.correlationId).toBe('abc123');

    mockRequest.headers['Correlation-ID'] = undefined;
    const invocationContext2 = new RequestInvocationContext(mockRequest);
    expect(invocationContext2.correlationId).toBeDefined();
  });

  it('should extract the userId from the access token and add the userId and default userAbn to the invocation context', (): void => {
    const mockRequest = getMockReq({
      method: 'GET',
      header: (() =>
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U') as any,
    });

    const invocationContext = new RequestInvocationContext(mockRequest);

    expect(invocationContext.userId).toBe('1234567890');
    expect(invocationContext.userAbn).toBe('41161080146');
  });

  it('should extract the userId and userAbn from the access token and add them to the invocation context', (): void => {
    const mockRequest = getMockReq({
      method: 'GET',
      header: (() =>
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYWJuIjoiMDAwMDAwMDAwIn0.TyNWetCHZ35Vy6Y-ERQNLo1_Wx1LBNeDDqYbz2bYvZU') as any,
    });

    const invocationContext = new RequestInvocationContext(mockRequest);

    expect(invocationContext.userId).toBe('1234567890');
    expect(invocationContext.userAbn).toBe('000000000');
  });

  it('should assign null to the userId and userAbn if it was unable to extract the sub and abn properties from the access token', (): void => {
    const mockRequest = getMockReq({
      method: 'GET',
      header: (() =>
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U') as any,
    });

    const invocationContext = new RequestInvocationContext(mockRequest);

    expect(invocationContext.userId).toBe(null);
    expect(invocationContext.userAbn).toBe(null);
  });
});
