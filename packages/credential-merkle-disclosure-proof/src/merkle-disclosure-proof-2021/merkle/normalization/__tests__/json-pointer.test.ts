import { credentials } from '../../../__fixtures__';
import { jsonPointer } from '..';

const credential = { ...credentials.credential0 };

const { objectToMessages, messagesToObject } = jsonPointer;

it('JSON Pointer', async () => {
  const messages = await objectToMessages(credential);
  expect(messages).toEqual([
    '{"/@context/0":"https://www.w3.org/2018/credentials/v1"}',
    '{"/@context/1/alsoKnownAs":"https://www.w3.org/ns/activitystreams#alsoKnownAs"}',
    '{"/id":"http://example.edu/credentials/3732"}',
    '{"/type/0":"VerifiableCredential"}',
    '{"/issuer":"https://example.edu/issuers/14"}',
    '{"/issuanceDate":"2010-01-01T19:23:24Z"}',
    '{"/credentialSubject/alsoKnownAs":"did:example:ebfeb1f712ebc6f1c276e12ec21"}',
  ]);

  const obj = await messagesToObject(messages);
  expect(obj).toEqual({
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      {
        alsoKnownAs: 'https://www.w3.org/ns/activitystreams#alsoKnownAs',
      },
    ],
    id: 'http://example.edu/credentials/3732',
    type: ['VerifiableCredential'],
    credentialSubject: {
      alsoKnownAs: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    },
    issuanceDate: '2010-01-01T19:23:24Z',
    issuer: 'https://example.edu/issuers/14',
  });

  // confirm obj is stable.
  const messages2 = await objectToMessages(obj);
  expect(messages2).toEqual([
    '{"/@context/0":"https://www.w3.org/2018/credentials/v1"}',
    '{"/@context/1/alsoKnownAs":"https://www.w3.org/ns/activitystreams#alsoKnownAs"}',
    '{"/id":"http://example.edu/credentials/3732"}',
    '{"/type/0":"VerifiableCredential"}',
    '{"/issuer":"https://example.edu/issuers/14"}',
    '{"/issuanceDate":"2010-01-01T19:23:24Z"}',
    '{"/credentialSubject/alsoKnownAs":"did:example:ebfeb1f712ebc6f1c276e12ec21"}',
  ]);
});
