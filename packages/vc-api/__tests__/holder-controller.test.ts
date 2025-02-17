import {
  deleteCredential,
  deletePresentation,
  deriveCredential,
  getCredential,
  getCredentials,
  getExchanges,
  getPresentation,
  getPresentations,
  initiateExchange,
  provePresentation,
  receiveExchange,
} from '../src/controllers/holder-controller';
import { Request, Response } from 'express';
import { RequestWithAgent } from '../src/types/request-type';
import { IAgent } from '@uncefact/vckit-core-types';
import { jest } from '@jest/globals';

describe('getCredential', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {
      execute: jest.fn(async (method: string, args: any) => {
        return Promise.resolve([
          { verifiableCredential: 'test credential' },
        ] as any);
      }),
    } as unknown as IAgent;
    mockRequest = {
      agent,
      params: {
        id: 'test-id',
      },
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return the verifiable credential when it exists', async () => {
    await getCredential(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith('test credential');
  });

  it('should return a 404 error when the credential is not found', async () => {
    (mockRequest.agent!.execute as jest.Mock<any>).mockResolvedValue([]);

    await getCredential(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Credential not found',
    });
  });

  it('should return an error when the agent is not available', async () => {
    mockRequest.agent = undefined;
    try {
      await getCredential(mockRequest as Request, mockResponse as Response);
    } catch (e) {
      expect(e.message).toEqual('Agent not available');
    }
  });

  it('should return an error when an exception occurs', async () => {
    const error = new Error('Some error');
    (mockRequest.agent!.execute as jest.Mock<any>).mockRejectedValue(error);

    await getCredential(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // or another appropriate error code
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some error' });
  });
});

describe('getCredentials', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {
      execute: jest.fn(async (method: string, args: any) => {
        return Promise.resolve([
          { verifiableCredential: 'test credential' },
        ] as any);
      }),
    } as unknown as IAgent;
    mockRequest = {
      agent,
      params: {},
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return the verifiable credentials when they exist', async () => {
    await getCredentials(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(['test credential']);
  });

  it('should return a 410 error when there are no credentials', async () => {
    (mockRequest.agent!.execute as jest.Mock<any>).mockResolvedValue([]);

    await getCredentials(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(410);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Gone! There is no data here',
    });
  });

  it('should return an error when the agent is not available', async () => {
    mockRequest.agent = undefined;
    try {
      await getCredentials(mockRequest as Request, mockResponse as Response);
    } catch (e) {
      expect(e.message).toEqual('Agent not available');
    }
  });

  it('should return an error when an exception occurs', async () => {
    const error = new Error('Some error');
    (mockRequest.agent!.execute as jest.Mock<any>).mockRejectedValue(error);

    await getCredentials(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // or another appropriate error code
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some error' });
  });
});

describe('deleteCredential', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {
      execute: jest.fn(async (method: string, args: any) => {
        if (method === 'dataStoreDeleteVerifiableCredential') {
          return Promise.resolve(true as any);
        }
        return Promise.resolve([
          { verifiableCredential: 'test credential' },
        ] as any);
      }),
    } as unknown as IAgent;
    mockRequest = {
      agent,
      params: {},
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return a 202 when the credential is deleted', async () => {
    await deleteCredential(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(202);
  });

  it('should return a 404 error when the credential is not found', async () => {
    (mockRequest.agent!.execute as jest.Mock<any>) = jest.fn(
      async (method: string, args: any) => {
        if (method === 'dataStoreDeleteVerifiableCredential') {
          return Promise.resolve(false as any);
        }
        return Promise.resolve([
          { verifiableCredential: 'test credential' },
        ] as any);
      }
    );

    await deleteCredential(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Credential not found',
    });
  });

  it('should return an error when the agent is not available', async () => {
    mockRequest.agent = undefined;
    try {
      await deleteCredential(mockRequest as Request, mockResponse as Response);
    } catch (e) {
      expect(e.message).toEqual('Agent not available');
    }
  });

  it('should return an error when an exception occurs', async () => {
    const error = new Error('Some error');
    (mockRequest.agent!.execute as jest.Mock<any>).mockRejectedValue(error);

    await deleteCredential(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // or another appropriate error code
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some error' });
  });
});

describe('getPresentation', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {
      execute: jest.fn(async (method: string, args: any) => {
        return Promise.resolve([
          { verifiablePresentation: 'test presentation' },
        ] as any);
      }),
    } as unknown as IAgent;
    mockRequest = {
      agent,
      params: {},
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return the verifiable presentation when it exists', async () => {
    await getPresentation(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith('test presentation');
  });

  it('should return a 404 error when there are no presentations', async () => {
    (mockRequest.agent!.execute as jest.Mock<any>).mockResolvedValue([]);

    await getPresentation(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Presentation not found',
    });
  });

  it('should return an error when the agent is not available', async () => {
    mockRequest.agent = undefined;
    try {
      await getPresentation(mockRequest as Request, mockResponse as Response);
    } catch (e) {
      expect(e.message).toEqual('Agent not available');
    }
  });

  it('should return an error when an exception occurs', async () => {
    const error = new Error('Some error');
    (mockRequest.agent!.execute as jest.Mock<any>).mockRejectedValue(error);

    await getPresentation(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // or another appropriate error code
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some error' });
  });
});

describe('getPresentations', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {
      execute: jest.fn(async (method: string, args: any) => {
        return Promise.resolve([
          { verifiablePresentation: 'test presentation' },
        ] as any);
      }),
    } as unknown as IAgent;
    mockRequest = {
      agent,
      params: {},
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return the verifiable presentations when they exist', async () => {
    await getPresentations(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(['test presentation']);
  });

  it('should return a 410 error when there are no presentations', async () => {
    (mockRequest.agent!.execute as jest.Mock<any>).mockResolvedValue([]);

    await getPresentations(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(410);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Gone! There is no data here',
    });
  });

  it('should return an error when the agent is not available', async () => {
    mockRequest.agent = undefined;
    try {
      await getPresentations(mockRequest as Request, mockResponse as Response);
    } catch (e) {
      expect(e.message).toEqual('Agent not available');
    }
  });

  it('should return an error when an exception occurs', async () => {
    const error = new Error('Some error');
    (mockRequest.agent!.execute as jest.Mock<any>).mockRejectedValue(error);

    await getPresentations(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // or another appropriate error code
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some error' });
  });
});

describe('provePresentation', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {
      execute: jest.fn(async (method: string, args: any) => {
        return Promise.resolve('test presentation' as any);
      }),
    } as unknown as IAgent;
    mockRequest = {
      agent,
      body: { presentation: {}, options: {} },
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return the verifiable presentation when proving an presentation', async () => {
    await provePresentation(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith('test presentation');
  });

  it('should return an error when the agent is not available', async () => {
    mockRequest.agent = undefined;
    try {
      await provePresentation(mockRequest as Request, mockResponse as Response);
    } catch (e) {
      expect(e.message).toEqual('Agent not available');
    }
  });

  it('should return an error when an exception occurs', async () => {
    const error = new Error('Some error');
    (mockRequest.agent!.execute as jest.Mock<any>).mockRejectedValue(error);

    await provePresentation(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500); // or another appropriate error code
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Some error' });
  });
});

describe('deletePresentation', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {} as unknown as IAgent;
    mockRequest = {
      agent,
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return a 501 when deleting an presentation is not implemented', async () => {
    await deletePresentation(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(501);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not implemented',
    });
  });
});

describe('deriveCredential', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {} as unknown as IAgent;
    mockRequest = {
      agent,
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return a 501 when deriving a credential is not implemented', async () => {
    await deriveCredential(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(501);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not implemented',
    });
  });
});

describe('getExchanges', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {} as unknown as IAgent;
    mockRequest = {
      agent,
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return a 501 when getting exchanges is not implemented', async () => {
    await getExchanges(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(501);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not implemented',
    });
  });
});

describe('initiateExchange', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {} as unknown as IAgent;
    mockRequest = {
      agent,
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return a 501 when initiating an exchange is not implemented', async () => {
    await initiateExchange(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(501);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not implemented',
    });
  });
});

describe('receiveExchange', () => {
  let mockRequest: Partial<RequestWithAgent>;
  let mockResponse: Response;

  beforeEach(() => {
    const agent = {} as unknown as IAgent;
    mockRequest = {
      agent,
    };
    mockResponse = {
      status: jest.fn((code: number) => mockResponse),
      json: jest.fn((data: any) => mockResponse),
    } as unknown as Response;
  });

  it('should return a 501 when receiving an exchange is not implemented', async () => {
    await receiveExchange(
      mockRequest as RequestWithAgent,
      mockResponse as Response
    );

    expect(mockResponse.status).toHaveBeenCalledWith(501);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not implemented',
    });
  });
});
