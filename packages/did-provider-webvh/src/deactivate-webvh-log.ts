import { sha256 } from '@noble/hashes/sha256';
import canonicalize from 'canonicalize';
import { multibaseEncode, MultibaseEncoding, type DIDLog, type Signer, type DataIntegrityProofTemplate } from 'didwebvh-ts';

/**
 * The pinned dependency's deactivation helper cannot consume witness proofs.
 * Build the signed entry here, then subject it to the same complete history and
 * witness validation as every other publication before it reaches the store.
 */
export async function deactivateWebvhLog(log: DIDLog, updateKeys: string[], signer: Signer): Promise<DIDLog> {
  const previous = log[log.length - 1];
  const timestamp = new Date(Math.max(Math.floor(Date.now() / 1000) * 1000, Date.parse(previous.versionTime) + 1000));
  const versionTime = timestamp.toISOString().replace('.000Z', 'Z');
  const unsigned = {
    versionId: previous.versionId,
    versionTime,
    parameters: { updateKeys, deactivated: true },
    state: previous.state,
  };
  const digest = sha256(new TextEncoder().encode(canonicalize(unsigned)!));
  const hash = multibaseEncode(new Uint8Array([0x12, 0x20, ...digest]), MultibaseEncoding.BASE58_BTC).slice(1);
  const entry = { ...unsigned, versionId: `${log.length + 1}-${hash}` };
  const proof: DataIntegrityProofTemplate = {
    type: 'DataIntegrityProof', cryptosuite: 'eddsa-jcs-2022',
    verificationMethod: signer.getVerificationMethodId(), created: versionTime, proofPurpose: 'assertionMethod',
  };
  const signed = await signer.sign({ document: entry, proof });
  return [...log, { ...entry, proof: [{ ...proof, proofValue: signed.proofValue }] }];
}
