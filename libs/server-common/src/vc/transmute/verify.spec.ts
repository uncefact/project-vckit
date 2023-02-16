import invalidVC from '../../fixtures/genericvc/degree_invalid.json';
import signedValidVC from '../../fixtures/genericvc/degree_signed.json';
import { verifyCredential } from './verify';

describe('verify', () => {
  jest.setTimeout(20000);
  it('should verify a valid credential', async () => {
    const verificationResult = await verifyCredential(signedValidVC as never);
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toHaveLength(0);
  });
  it('should fail DOCUMENT_INTEGRITY when signature is invalid', async () => {
    const verificationResult = await verifyCredential(invalidVC as never);
    expect(verificationResult).toHaveProperty('errors');
    expect(verificationResult.errors).toContain('proof');
  });
});
