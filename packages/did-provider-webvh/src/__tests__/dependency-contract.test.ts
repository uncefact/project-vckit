import { describe, expect, it } from '@jest/globals';
import { createHash, generateKeyPairSync, sign, verify } from 'node:crypto';
import {
  createDID, updateDID, resolveDIDFromLog, prepareDataForSigning,
  multibaseEncode, MultibaseEncoding,
} from 'didwebvh-ts';

// Exercise the published dependency with actual signatures, not mocked lifecycle results.
describe('didwebvh-ts dependency contract', () => {
  it('preserves authorization and links an ordinary update to its predecessor', async () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const publicBytes = publicKey.export({ format: 'der', type: 'spki' }).subarray(-32);
    const multikey = multibaseEncode(new Uint8Array([0xed, 0x01, ...publicBytes]), MultibaseEncoding.BASE58_BTC);
    const signer = {
      getVerificationMethodId: () => `did:key:${multikey}#${multikey}`,
      async sign({ document, proof }: { document: any; proof: any }) {
        const data = await prepareDataForSigning(document, proof);
        return { proofValue: multibaseEncode(sign(null, data, privateKey), MultibaseEncoding.BASE58_BTC) };
      },
    };
    const verifier = { verify: async (signature: Uint8Array, message: Uint8Array) => verify(null, message, publicKey, signature) };
    const initial = await createDID({
      domain: 'example.com', signer, verifier, updateKeys: [multikey],
      verificationMethods: [{ type: 'Multikey', publicKeyMultibase: multikey }],
    });
    const updated = await updateDID({
      log: initial.log, signer, verifier,
      services: [{ id: '#profile', type: 'Profile', serviceEndpoint: 'https://example.com/profile' }],
    });
    const resolved = await resolveDIDFromLog(updated.log, { verifier });
    expect(resolved.meta.updateKeys).toEqual([multikey]);
    expect(resolved.doc.verificationMethod).toEqual(initial.doc.verificationMethod);
    const { proof: _proof, ...entry } = updated.log[1];
    entry.versionId = initial.log[0].versionId;
    const canonicalize = (value: any): string => {
      if (value === null || typeof value !== 'object') return JSON.stringify(value);
      if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
      return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(',')}}`;
    };
    const digest = createHash('sha256').update(canonicalize(entry)).digest();
    const hash = multibaseEncode(new Uint8Array([0x12, 0x20, ...digest]), MultibaseEncoding.BASE58_BTC).slice(1);
    expect(updated.log[1].versionId).toBe(`2-${hash}`);
  });
});
