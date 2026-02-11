import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { WebvhDIDProvider } from '../webvh-did-provider.js';
import { WebvhDidLogStore } from '../store/webvh-did-log-store.js';

// Mock didwebvh-ts
jest.unstable_mockModule('didwebvh-ts', () => ({
  createDID: jest.fn(),
  updateDID: jest.fn(),
  deactivateDID: jest.fn(),
  resolveDID: jest.fn(),
  resolveDIDFromLog: jest.fn(),
  prepareDataForSigning: jest.fn(),
  multibaseEncode: jest.fn(),
}));

// Mock the log store
const mockSaveLog = jest.fn();
const mockUpdateLog = jest.fn();
const mockGetByScid = jest.fn();
const mockGetByDid = jest.fn();

jest.unstable_mockModule('../store/webvh-did-log-store.js', () => ({
  WebvhDidLogStore: jest.fn().mockImplementation(() => ({
    saveLog: mockSaveLog,
    updateLog: mockUpdateLog,
    getByScid: mockGetByScid,
    getByDid: mockGetByDid,
  })),
}));

describe('WebvhDIDProvider', () => {
  let provider: WebvhDIDProvider;
  let mockContext: any;
  const mockDbConnection = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();

    provider = new WebvhDIDProvider({
      defaultKms: 'local',
      defaultDomain: 'example.com',
      defaultPortable: true,
      dbConnection: mockDbConnection,
    });

    mockContext = {
      agent: {
        keyManagerCreate: jest.fn<any>().mockResolvedValue({
          kid: 'test-key-id',
          type: 'Ed25519',
          publicKeyHex: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          kms: 'local',
        }),
        keyManagerSign: jest.fn<any>().mockResolvedValue('mock-signature-base64url'),
        didManagerGet: jest.fn<any>(),
        didManagerImport: jest.fn<any>(),
        didManagerDelete: jest.fn<any>(),
      },
    };
  });

  describe('createIdentifier', () => {
    it('should require a domain', async () => {
      const providerNoDomain = new WebvhDIDProvider({
        defaultKms: 'local',
        dbConnection: mockDbConnection,
      });

      await expect(
        providerNoDomain.createIdentifier({}, mockContext),
      ).rejects.toThrow('did:webvh requires a domain');
    });

    it('should create a DID with default options', async () => {
      const { createDID } = await import('didwebvh-ts');
      const mockCreateDID = createDID as jest.MockedFunction<typeof createDID>;
      mockCreateDID.mockResolvedValue({
        did: 'did:webvh:z6Mktest123:example.com',
        log: [
          {
            versionId: '1-abc123',
            versionTime: '2024-01-01T00:00:00Z',
            parameters: {
              method: 'did:webvh:1.0',
              scid: 'z6Mktest123',
              updateKeys: ['z6Mktest...'],
              portable: true,
            },
            state: {
              id: 'did:webvh:z6Mktest123:example.com',
              verificationMethod: [],
            },
            proof: [],
          },
        ],
      });

      mockSaveLog.mockResolvedValue(undefined);

      const result = await provider.createIdentifier({}, mockContext);

      expect(result.did).toBe('did:webvh:z6Mktest123:example.com');
      expect(result.keys).toHaveLength(1);
      expect(result.keys[0].type).toBe('Ed25519');
      expect(result.controllerKeyId).toBe('test-key-id');
      expect(mockContext.agent.keyManagerCreate).toHaveBeenCalledWith({
        kms: 'local',
        type: 'Ed25519',
      });
      expect(mockSaveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          scid: 'z6Mktest123',
          currentDid: 'did:webvh:z6Mktest123:example.com',
          portable: true,
        }),
      );
    });

    it('should use custom domain and paths from options', async () => {
      const { createDID } = await import('didwebvh-ts');
      const mockCreateDID = createDID as jest.MockedFunction<typeof createDID>;
      mockCreateDID.mockResolvedValue({
        did: 'did:webvh:z6Mktest456:custom.org:dids:issuer',
        log: [{ versionId: '1-def456', parameters: { scid: 'z6Mktest456' }, state: {} }],
      });

      mockSaveLog.mockResolvedValue(undefined);

      const result = await provider.createIdentifier(
        {
          options: {
            domain: 'custom.org',
            paths: ['dids', 'issuer'],
            portable: false,
          },
        },
        mockContext,
      );

      expect(result.did).toBe('did:webvh:z6Mktest456:custom.org:dids:issuer');
      expect(mockSaveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          portable: false,
        }),
      );
    });
  });

  describe('deleteIdentifier (deactivate)', () => {
    it('should deactivate a DID', async () => {
      const mockIdentifier = {
        did: 'did:webvh:z6Mktest123:example.com',
        provider: 'did:webvh',
        controllerKeyId: 'test-key-id',
        keys: [
          {
            kid: 'test-key-id',
            type: 'Ed25519' as const,
            publicKeyHex: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            kms: 'local',
          },
        ],
        services: [],
      };

      mockGetByScid.mockResolvedValue({
        scid: 'z6Mktest123',
        currentDid: 'did:webvh:z6Mktest123:example.com',
        log: JSON.stringify([{ versionId: '1-abc', parameters: {}, state: {} }]),
        deactivated: false,
      });

      const { deactivateDID } = await import('didwebvh-ts');
      const mockDeactivateDID = deactivateDID as jest.MockedFunction<typeof deactivateDID>;
      mockDeactivateDID.mockResolvedValue({
        did: 'did:webvh:z6Mktest123:example.com',
        log: [
          { versionId: '1-abc', parameters: {}, state: {} },
          { versionId: '2-def', parameters: { deactivated: true }, state: {} },
        ],
      });

      mockUpdateLog.mockResolvedValue(undefined);

      const result = await provider.deleteIdentifier(mockIdentifier, mockContext);

      expect(result).toBe(true);
      expect(mockUpdateLog).toHaveBeenCalledWith(
        expect.objectContaining({
          scid: 'z6Mktest123',
          deactivated: true,
        }),
      );
    });

    it('should return true for already deactivated DIDs', async () => {
      const mockIdentifier = {
        did: 'did:webvh:z6Mktest123:example.com',
        provider: 'did:webvh',
        controllerKeyId: 'test-key-id',
        keys: [
          {
            kid: 'test-key-id',
            type: 'Ed25519' as const,
            publicKeyHex: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            kms: 'local',
          },
        ],
        services: [],
      };

      mockGetByScid.mockResolvedValue({
        scid: 'z6Mktest123',
        deactivated: true,
        log: '[]',
      });

      const result = await provider.deleteIdentifier(mockIdentifier, mockContext);
      expect(result).toBe(true);
    });
  });

  describe('portability', () => {
    it('should reject port for non-portable DID', async () => {
      mockGetByScid.mockResolvedValue({
        scid: 'z6Mktest123',
        currentDid: 'did:webvh:z6Mktest123:old-domain.com',
        log: JSON.stringify([{ versionId: '1-abc', parameters: {}, state: {} }]),
        portable: false,
        deactivated: false,
        previousDids: '[]',
      });

      mockContext.agent.didManagerGet.mockResolvedValue({
        did: 'did:webvh:z6Mktest123:old-domain.com',
        keys: [
          {
            kid: 'test-key-id',
            type: 'Ed25519',
            publicKeyHex: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          },
        ],
        services: [],
      });

      await expect(
        provider.updateIdentifier(
          {
            did: 'did:webvh:z6Mktest123:old-domain.com',
            document: {},
            options: { portToDomain: 'new-domain.com' },
          },
          mockContext,
        ),
      ).rejects.toThrow('Cannot port DID');
    });

    it('should port a DID to a new domain', async () => {
      mockGetByScid.mockResolvedValue({
        scid: 'z6Mktest123',
        currentDid: 'did:webvh:z6Mktest123:old-domain.com',
        log: JSON.stringify([
          { versionId: '1-abc', parameters: { portable: true }, state: {} },
        ]),
        portable: true,
        deactivated: false,
        previousDids: '[]',
      });

      mockContext.agent.didManagerGet
        .mockResolvedValueOnce({
          did: 'did:webvh:z6Mktest123:old-domain.com',
          keys: [
            {
              kid: 'test-key-id',
              type: 'Ed25519',
              publicKeyHex: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            },
          ],
          services: [],
        })
        .mockResolvedValueOnce({
          did: 'did:webvh:z6Mktest123:new-domain.com',
          provider: 'did:webvh',
          controllerKeyId: 'test-key-id',
          keys: [
            {
              kid: 'test-key-id',
              type: 'Ed25519',
              publicKeyHex: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            },
          ],
          services: [],
        });

      const { updateDID } = await import('didwebvh-ts');
      const mockUpdateDID = updateDID as jest.MockedFunction<typeof updateDID>;
      mockUpdateDID.mockResolvedValue({
        did: 'did:webvh:z6Mktest123:new-domain.com',
        log: [
          { versionId: '1-abc', parameters: { portable: true }, state: {} },
          {
            versionId: '2-def',
            parameters: {},
            state: { id: 'did:webvh:z6Mktest123:new-domain.com' },
          },
        ],
      });

      mockUpdateLog.mockResolvedValue(undefined);
      mockContext.agent.didManagerImport.mockResolvedValue(undefined);
      mockContext.agent.didManagerDelete.mockResolvedValue(true);

      const result = await provider.updateIdentifier(
        {
          did: 'did:webvh:z6Mktest123:old-domain.com',
          document: {},
          options: { portToDomain: 'new-domain.com' },
        },
        mockContext,
      );

      expect(result.did).toBe('did:webvh:z6Mktest123:new-domain.com');

      // Verify the log was updated with previous DID
      expect(mockUpdateLog).toHaveBeenCalledWith(
        expect.objectContaining({
          scid: 'z6Mktest123',
          currentDid: 'did:webvh:z6Mktest123:new-domain.com',
          previousDids: ['did:webvh:z6Mktest123:old-domain.com'],
        }),
      );

      // Verify Veramo DID store was updated
      expect(mockContext.agent.didManagerImport).toHaveBeenCalled();
      expect(mockContext.agent.didManagerDelete).toHaveBeenCalledWith({
        did: 'did:webvh:z6Mktest123:old-domain.com',
      });
    });
  });
});

describe('WebvhDidLogStore', () => {
  describe('extractScid', () => {
    it('should extract SCID from a valid did:webvh DID', () => {
      expect(
        WebvhDidLogStore.extractScid('did:webvh:z6Mktest123:example.com'),
      ).toBe('z6Mktest123');
    });

    it('should extract SCID from a DID with paths', () => {
      expect(
        WebvhDidLogStore.extractScid(
          'did:webvh:z6Mktest456:example.com:dids:issuer',
        ),
      ).toBe('z6Mktest456');
    });

    it('should throw for invalid DID format', () => {
      expect(() => WebvhDidLogStore.extractScid('did:web:example.com')).toThrow(
        'Invalid did:webvh DID',
      );
    });

    it('should throw for too-short DID', () => {
      expect(() => WebvhDidLogStore.extractScid('did:webvh')).toThrow(
        'Invalid did:webvh DID',
      );
    });
  });
});
