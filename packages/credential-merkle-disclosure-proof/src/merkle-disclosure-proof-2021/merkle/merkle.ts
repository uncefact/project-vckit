import { v4 as uuidv4 } from 'uuid';
import {
  MemberProof,
  compressDisclosureProof,
  expandDisclosureProof,
  generateMembership,
  verifyMembershipProof,
} from '@transmute/merkle-proof';

const getProofs = (
  messages: string[],
  rootNonce: string = `urn:uuid:${uuidv4()}`
) => {
  const members = messages.map((m: string) => Buffer.from(m));

  const fullMembershipProof = generateMembership(
    members,
    Buffer.from(rootNonce)
  );

  const merkleRoot = fullMembershipProof.root;

  if (!merkleRoot) {
    throw new Error('could not get merkleRoot.');
  }

  return compressDisclosureProof(fullMembershipProof).toString('base64');
};

const deriveProofs = (
  originalMessages: string[],
  redactingMessages: string[],
  proofs: string
) => {
  const bufferProofs = Buffer.from(proofs, 'base64');

  const { root, nonce } = expandDisclosureProof(bufferProofs);

  const originalBufferMessages = originalMessages.map((m: string) =>
    Buffer.from(m)
  );
  const redactingBase64Messages = redactingMessages.map((m: string) =>
    Buffer.from(m).toString('base64')
  );

  const fullMembershipProof = generateMembership(
    originalBufferMessages,
    Buffer.from(nonce)
  );

  const selectiveDisclosureProof = {
    root: root,
    nonce: nonce,
    membership: fullMembershipProof.membership.filter((em) => {
      const base64Member = em.member.toString('base64');

      return redactingBase64Messages.includes(base64Member);
    }),
  };

  return compressDisclosureProof(selectiveDisclosureProof).toString('base64');
};

const verifyProofs = (messages: string[], proofs: string) => {
  const bufferProofs = Buffer.from(proofs, 'base64');

  const { membership, nonce, root } = expandDisclosureProof(bufferProofs);

  const members = messages.map((m: string) => Buffer.from(m));
  const fullMembershipProof = generateMembership(members, Buffer.from(nonce));

  return (membership as MemberProof[]).every((m: MemberProof, i: number) =>
    verifyMembershipProof(
      fullMembershipProof.membership[i].member,
      m.proof,
      root
    )
  );
};

export { getProofs, deriveProofs, verifyProofs };
