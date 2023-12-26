import { getProofs, verifyProofs, deriveProofs } from '../merkle';

const messages = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

it('cannot verify without derivation', async () => {
  const proof = getProofs(messages);
  expect(verifyProofs(messages, proof)).toBe(true);
});

it('holder derives proofs for some messages', async () => {
  const proof = getProofs(messages);
  const derivedMessages = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
  ];
  const derivedProofs = deriveProofs(messages, derivedMessages, proof);
  expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
});

it('verifier checks root signature, then verifies derived proofs for some messages', async () => {
  const proof = getProofs(messages);
  const derivedMessages = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
  ];
  const derivedProofs = deriveProofs(messages, derivedMessages, proof);
  expect(verifyProofs(derivedMessages, derivedProofs)).toBe(true);
});
