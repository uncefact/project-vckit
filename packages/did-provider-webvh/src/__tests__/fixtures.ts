import { generateKeyPairSync, sign } from 'node:crypto';
import { bytesToMultibase } from '@veramo/utils';
import { createDID, updateDID } from 'didwebvh-ts';
import { VeramoSigner, VeramoVerifier } from '../veramo-signer.js';

export async function signedHistory() {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const publicBytes = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32);
  const multikey = bytesToMultibase(publicBytes, 'Ed25519');
  const signer = new VeramoSigner('test-key', `did:key:${multikey}#${multikey}`, {
    agent: { keyManagerSign: async ({ data, encoding }: any) => sign(null, Buffer.from(data, encoding), privateKey).toString('base64url') },
  } as any);
  const verifier = new VeramoVerifier();
  const genesis = await createDID({
    domain: 'example.com', signer, verifier, updateKeys: [multikey],
    verificationMethods: [{ type: 'Multikey', publicKeyMultibase: multikey }],
    created: '2026-01-01T00:00:00Z',
  });
  const updated = await updateDID({ log: genesis.log, signer, verifier, updated: '2026-01-01T00:00:01Z', services: [{ id: '#profile', type: 'Profile', serviceEndpoint: 'https://example.com/profile' }] });
  return { ...updated, genesis, signer, verifier };
}
