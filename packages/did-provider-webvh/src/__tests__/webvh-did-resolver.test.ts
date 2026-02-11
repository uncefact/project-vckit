import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock didwebvh-ts
jest.unstable_mockModule('didwebvh-ts', () => ({
  resolveDID: jest.fn(),
  resolveDIDFromLog: jest.fn(),
}));

// Mock veramo-signer
jest.unstable_mockModule('../veramo-signer.js', () => ({
  VeramoVerifier: jest.fn().mockImplementation(() => ({
    verify: jest.fn().mockResolvedValue(true),
  })),
}));

describe('getWebvhResolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a resolver map with webvh key', async () => {
    const { getWebvhResolver } = await import('../webvh-did-resolver.js');
    const resolverMap = getWebvhResolver();
    expect(resolverMap).toHaveProperty('webvh');
    expect(typeof resolverMap.webvh).toBe('function');
  });

  it('should resolve a DID successfully', async () => {
    const { resolveDID } = await import('didwebvh-ts');
    const mockResolveDID = resolveDID as jest.MockedFunction<typeof resolveDID>;
    mockResolveDID.mockResolvedValue({
      did: 'did:webvh:z6Mktest123:example.com',
      doc: {
        '@context': ['https://www.w3.org/ns/did/v1'],
        id: 'did:webvh:z6Mktest123:example.com',
        verificationMethod: [
          {
            id: 'did:webvh:z6Mktest123:example.com#key-1',
            type: 'Multikey',
            controller: 'did:webvh:z6Mktest123:example.com',
            publicKeyMultibase: 'z6Mktest...',
          },
        ],
      },
      meta: {
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-01T00:00:00Z',
        versionId: '1-abc123',
        deactivated: false,
        scid: 'z6Mktest123',
        portable: true,
        prerotation: false,
        updateKeys: ['z6Mktest...'],
        nextKeyHashes: [],
      },
      controlled: true,
    });

    const { getWebvhResolver } = await import('../webvh-did-resolver.js');
    const resolverMap = getWebvhResolver();

    const result = await resolverMap.webvh(
      'did:webvh:z6Mktest123:example.com',
      {
        did: 'did:webvh:z6Mktest123:example.com',
        method: 'webvh',
        id: 'z6Mktest123:example.com',
        didUrl: 'did:webvh:z6Mktest123:example.com',
      },
      { resolve: jest.fn<any>() } as any,
      {},
    );

    expect(result.didDocument).toBeDefined();
    expect(result.didDocument?.id).toBe('did:webvh:z6Mktest123:example.com');
    expect(result.didDocumentMetadata.versionId).toBe('1-abc123');
    expect(result.didDocumentMetadata.deactivated).toBe(false);
  });

  it('should handle resolution errors gracefully', async () => {
    const { resolveDID } = await import('didwebvh-ts');
    const mockResolveDID = resolveDID as jest.MockedFunction<typeof resolveDID>;
    mockResolveDID.mockRejectedValue(new Error('NOT_FOUND: DID not found'));

    const { getWebvhResolver } = await import('../webvh-did-resolver.js');
    const resolverMap = getWebvhResolver();

    const result = await resolverMap.webvh(
      'did:webvh:z6Mknotexist:example.com',
      {
        did: 'did:webvh:z6Mknotexist:example.com',
        method: 'webvh',
        id: 'z6Mknotexist:example.com',
        didUrl: 'did:webvh:z6Mknotexist:example.com',
      },
      { resolve: jest.fn<any>() } as any,
      {},
    );

    expect(result.didDocument).toBeNull();
    expect(result.didResolutionMetadata.error).toBe('notFound');
  });

  it('should pass version query parameters to didwebvh-ts', async () => {
    const { resolveDID } = await import('didwebvh-ts');
    const mockResolveDID = resolveDID as jest.MockedFunction<typeof resolveDID>;
    mockResolveDID.mockResolvedValue({
      did: 'did:webvh:z6Mktest123:example.com',
      doc: { id: 'did:webvh:z6Mktest123:example.com' },
      meta: { versionId: '1-abc', created: '', updated: '' },
      controlled: false,
    });

    const { getWebvhResolver } = await import('../webvh-did-resolver.js');
    const resolverMap = getWebvhResolver();

    await resolverMap.webvh(
      'did:webvh:z6Mktest123:example.com?versionNumber=2',
      {
        did: 'did:webvh:z6Mktest123:example.com',
        method: 'webvh',
        id: 'z6Mktest123:example.com',
        didUrl: 'did:webvh:z6Mktest123:example.com?versionNumber=2',
        query: 'versionNumber=2',
      },
      { resolve: jest.fn<any>() } as any,
      {},
    );

    expect(mockResolveDID).toHaveBeenCalledWith(
      'did:webvh:z6Mktest123:example.com',
      expect.objectContaining({
        versionNumber: 2,
      }),
    );
  });
});

describe('getWebvhLocalResolver', () => {
  it('should resolve from local log store', async () => {
    const { resolveDIDFromLog } = await import('didwebvh-ts');
    const mockResolveDIDFromLog = resolveDIDFromLog as jest.MockedFunction<
      typeof resolveDIDFromLog
    >;
    mockResolveDIDFromLog.mockResolvedValue({
      did: 'did:webvh:z6Mktest123:example.com',
      doc: {
        id: 'did:webvh:z6Mktest123:example.com',
        verificationMethod: [],
      },
      meta: {
        versionId: '1-abc',
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-01T00:00:00Z',
      },
    });

    const mockLogStore = {
      getLogForDid: jest.fn<any>().mockResolvedValue([
        { versionId: '1-abc', parameters: {}, state: {} },
      ]),
    };

    const { getWebvhLocalResolver } = await import(
      '../webvh-did-resolver.js'
    );
    const resolverMap = getWebvhLocalResolver(mockLogStore);

    const result = await resolverMap.webvh(
      'did:webvh:z6Mktest123:example.com',
      {
        did: 'did:webvh:z6Mktest123:example.com',
        method: 'webvh',
        id: 'z6Mktest123:example.com',
        didUrl: 'did:webvh:z6Mktest123:example.com',
      },
      { resolve: jest.fn<any>() } as any,
      {},
    );

    expect(result.didDocument).toBeDefined();
    expect(mockLogStore.getLogForDid).toHaveBeenCalledWith(
      'did:webvh:z6Mktest123:example.com',
    );
    expect(mockResolveDIDFromLog).toHaveBeenCalled();
  });

  it('should fall back to network resolver when DID not in local store', async () => {
    const { resolveDID } = await import('didwebvh-ts');
    const mockResolveDID = resolveDID as jest.MockedFunction<typeof resolveDID>;
    mockResolveDID.mockResolvedValue({
      did: 'did:webvh:z6Mkremote:other.com',
      doc: { id: 'did:webvh:z6Mkremote:other.com' },
      meta: { versionId: '1-xyz', created: '', updated: '' },
      controlled: false,
    });

    const mockLogStore = {
      getLogForDid: jest.fn<any>().mockResolvedValue(null),
    };

    const { getWebvhLocalResolver } = await import(
      '../webvh-did-resolver.js'
    );
    const resolverMap = getWebvhLocalResolver(mockLogStore);

    const result = await resolverMap.webvh(
      'did:webvh:z6Mkremote:other.com',
      {
        did: 'did:webvh:z6Mkremote:other.com',
        method: 'webvh',
        id: 'z6Mkremote:other.com',
        didUrl: 'did:webvh:z6Mkremote:other.com',
      },
      { resolve: jest.fn<any>() } as any,
      {},
    );

    expect(result.didDocument).toBeDefined();
    expect(mockResolveDID).toHaveBeenCalledWith(
      'did:webvh:z6Mkremote:other.com',
      expect.any(Object),
    );
  });
});
