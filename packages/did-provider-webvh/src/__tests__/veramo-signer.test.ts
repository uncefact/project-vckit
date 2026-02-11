import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { VeramoSigner, VeramoVerifier } from '../veramo-signer.js';

// Mock didwebvh-ts
jest.unstable_mockModule('didwebvh-ts', () => ({
  prepareDataForSigning: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
  multibaseEncode: jest.fn().mockReturnValue('zmockencodedvalue'),
}));

describe('VeramoSigner', () => {
  let signer: VeramoSigner;
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      agent: {
        keyManagerSign: jest
          .fn<any>()
          .mockResolvedValue('bW9jay1zaWduYXR1cmU'), // base64url of "mock-signature"
      },
    };

    signer = new VeramoSigner(
      'test-key-id',
      'did:key:z6Mktest#z6Mktest',
      mockContext,
    );
  });

  it('should return the verification method ID', () => {
    expect(signer.getVerificationMethodId()).toBe('did:key:z6Mktest#z6Mktest');
  });

  it('should sign using Veramo keyManagerSign', async () => {
    const result = await signer.sign({
      document: { id: 'test-doc' },
      proof: { type: 'DataIntegrityProof' },
    });

    expect(result).toHaveProperty('proofValue');
    expect(typeof result.proofValue).toBe('string');

    // Verify keyManagerSign was called with the right key
    expect(mockContext.agent.keyManagerSign).toHaveBeenCalledWith(
      expect.objectContaining({
        keyRef: 'test-key-id',
        algorithm: 'EdDSA',
        encoding: 'hex',
      }),
    );
  });
});

describe('VeramoVerifier', () => {
  it('should expose a verify method', () => {
    const verifier = new VeramoVerifier();
    expect(typeof verifier.verify).toBe('function');
  });
});
