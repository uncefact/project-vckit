import { DocumentsToVerify } from '@govtechsg/oa-verify';
import invalid_OA_V3 from '../../fixtures/oav3/did-invalid-signed.json';
import signed_OA_V3 from '../../fixtures/oav3/did-signed.json';
import unsigned_OA_V3 from '../../fixtures/oav3/did.json';
import { verifyCredential } from './verify';

describe('Test OA verify', () => {
  jest.setTimeout(25000);
  it('should verify a valid OA credential', async () => {
    const verificationResult = await verifyCredential(
      signed_OA_V3 as DocumentsToVerify
    );
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toHaveLength(0);
  });
  it('should fail DOCUMENT_INTEGRITY when signature is invalid', async () => {
    const verificationResult = await verifyCredential(
      invalid_OA_V3 as DocumentsToVerify
    );
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('proof');
  });
  it("should fail DOCUMENT_STATUS when it's unsigned and unwrapped", async () => {
    const verificationResult = await verifyCredential(unsigned_OA_V3 as never);
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('status');
    expect(verificationResult.errors).toContain('proof');
  });
});
