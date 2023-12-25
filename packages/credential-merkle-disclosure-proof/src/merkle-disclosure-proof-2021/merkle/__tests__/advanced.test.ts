import { getProofs, verifyProofs, deriveProofs } from '../merkle';

const messages = ['zero', 'one', 'two'];

// cannot verify without derivation
it('can generate proofs for messages', async () => {
  const proof = getProofs(messages);
  expect(verifyProofs(messages, proof)).toBe(true);
});

it('holder derives proofs for some messages', async () => {
  const proof = getProofs(messages);
  const derivedMessages = ['zero'];
  const derivedProofs = deriveProofs(messages, derivedMessages, proof);
  expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
});

it('verifier checks root signature, then verifies derived proofs for some messages', async () => {
  const proof = getProofs(messages);
  const derivedMessages = ['zero'];
  const derivedProofs = deriveProofs(messages, derivedMessages, proof);
  expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
});
