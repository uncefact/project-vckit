import { describe, it, expect, jest } from '@jest/globals';
import { createHash, generateKeyPairSync, sign, verify } from 'node:crypto';
import { base58ToBytes } from '@veramo/utils';
import { VeramoSigner, VeramoVerifier } from '../veramo-signer.js';

const document = { id: 'test' };
const proof = {
  created: '2026-01-01T00:00:00Z', cryptosuite: 'eddsa-jcs-2022',
  proofPurpose: 'assertionMethod', type: 'DataIntegrityProof', verificationMethod: 'did:key:test#test',
};
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest();
const message = Buffer.concat([hash(proof), hash(document)]);

describe('Veramo Ed25519 bridge', () => {
  it('produces a base58btc proof that an independent Ed25519 verifier accepts', async () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const keyManagerSign = jest.fn(async ({ data, encoding }: { data: string; encoding: BufferEncoding }) =>
      sign(null, Buffer.from(data, encoding), privateKey).toString('base64url'));
    const signer = new VeramoSigner('kms-key', proof.verificationMethod, { agent: { keyManagerSign } } as any);
    const result = await signer.sign({ document, proof } as any);
    expect(result.proofValue).toMatch(/^z[1-9A-HJ-NP-Za-km-z]+$/);
    expect(verify(null, message, publicKey, base58ToBytes(result.proofValue.slice(1)))).toBe(true);
    expect(keyManagerSign).toHaveBeenCalledWith({ keyRef: 'kms-key', algorithm: 'EdDSA', encoding: 'hex', data: message.toString('hex') });
  });

  it('accepts authentic signatures and rejects changed data and malformed signatures', async () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const publicBytes = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32);
    const signature = sign(null, message, privateKey);
    const verifier = new VeramoVerifier();
    expect(await verifier.verify(signature, message, publicBytes)).toBe(true);
    expect(await verifier.verify(signature, new Uint8Array([1]), publicBytes)).toBe(false);
    expect(await verifier.verify(new Uint8Array([1]), message, publicBytes)).toBe(false);
  });
});
