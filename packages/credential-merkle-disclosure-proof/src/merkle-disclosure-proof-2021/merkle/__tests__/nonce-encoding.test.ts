import { getProofs, verifyProofs, deriveProofs } from '../merkle';

const messages = ['zero', 'one', 'two'];

// a proof must disclose some nonces to verifier..
it('can verify proofs', async () => {
  const proof = getProofs(messages);
  expect(verifyProofs(messages, proof)).toBe(true);
});

describe('can verify derived proofs', () => {
  it('one', async () => {
    const proof = getProofs(messages);
    const derivedMessages = ['one'];
    const derivedProofs = deriveProofs(messages, derivedMessages, proof);
    expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
  });

  it('one and two', async () => {
    const proof = getProofs(messages);
    const derivedMessages = ['one', 'two'];
    const derivedProofs = deriveProofs(messages, derivedMessages, proof);
    expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
  });

  it('zero and two', async () => {
    const proof = getProofs(messages);
    const derivedMessages = ['zero', 'two'];
    const derivedProofs = deriveProofs(messages, derivedMessages, proof);
    expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
  });
});
