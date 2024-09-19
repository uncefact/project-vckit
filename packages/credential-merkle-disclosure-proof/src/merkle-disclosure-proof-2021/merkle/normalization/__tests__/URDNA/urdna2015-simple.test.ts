import { documentLoader } from '../../../../__fixtures__';

import { objectToMessages, messagesToObject } from '../../urdna2015';

it('simple', async () => {
  const context = {
    '@vocab': 'https://example.com/terms#',
  };
  const obj1 = {
    '@context': context,
    type: 'CredentialType',
    property1: 'property1',
    node2: {
      property2: 'property2',
    },
    proof: {
      type: 'ProofType',
      property3: 'property3',
    },
  };
  const messages1 = await objectToMessages(obj1, { documentLoader });
  expect(messages1).toEqual([
    '<urn:bnid:_:c14n0> <https://example.com/terms#property2> "property2" .',
    '<urn:bnid:_:c14n1> <https://example.com/terms#node2> <urn:bnid:_:c14n0> .',
    '<urn:bnid:_:c14n1> <https://example.com/terms#property1> "property1" .',
    '<urn:bnid:_:c14n1> <https://example.com/terms#type> "CredentialType" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://example.com/terms#property3> "property3" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://example.com/terms#type> "ProofType" .',
  ]);
  const obj2 = await messagesToObject(messages1, { context, documentLoader });
  expect(obj2).toEqual({
    '@context': { '@vocab': 'https://example.com/terms#' },
    type: 'CredentialType',
    '@id': 'urn:bnid:_:c14n1',
    node2: {
      '@id': 'urn:bnid:_:c14n0',
      property2: 'property2',
    },
    proof: {
      type: 'ProofType',
      property3: 'property3',
    },
    property1: 'property1',
  });
  const messages2 = await objectToMessages(obj2, { documentLoader });
  expect(messages1).toEqual(messages2);
  const obj3 = {
    '@context': { '@vocab': 'https://example.com/terms#' },
    '@id': 'urn:bnid:_:c14n1',
    type: 'CredentialType',
    // node2: {
    //   '@id': 'urn:bnid:_:c14n0',
    //   property2: 'property2',
    // },
    proof: {
      type: 'ProofType',
      property3: 'property3',
    },
    property1: 'property1',
  };
  const messages3 = await objectToMessages(obj3, { documentLoader });
  expect(messages3).toEqual([
    // '<urn:bnid:_:c14n0> <https://example.com/terms#property2> "property2" .',
    // '<urn:bnid:_:c14n1> <https://example.com/terms#node2> <urn:bnid:_:c14n0> .',
    '<urn:bnid:_:c14n1> <https://example.com/terms#property1> "property1" .',
    '<urn:bnid:_:c14n1> <https://example.com/terms#type> "CredentialType" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://example.com/terms#property3> "property3" .',
    '<urn:merkle-dislosure-proof:ephemeral-blank-node-id> <https://example.com/terms#type> "ProofType" .',
  ]);
});
