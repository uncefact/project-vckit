import { issueCredential } from './issue';

describe('issueCredential', () => {
  jest.setTimeout(20000);

  it('should issue a verifiable credential', async () => {
    const mnemonic =
      'coast lesson mountain spy inform deposit two trophy album endless party crumble base grape artefact';
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/vc-revocation-list-2020/v1',
      ],
      id: 'urn:uuid:77d1699d-c031-4659-b00a-735e661b53ec',
      type: ['VerifiableCredential'],
      issuer: 'did:key:z6MktiSzqF9kqwdU8VkdBKx56EYzXfpgnNPUAGznpicNiWfn',
      issuanceDate: '2010-01-01T19:23:24Z',
      credentialStatus: {
        id: 'https://api.did.actor/revocation-lists/1.json#0',
        type: 'RevocationList2020Status',
        revocationListIndex: 0,
        revocationListCredential:
          'https://api.did.actor/revocation-lists/1.json',
      },
      credentialSubject: {
        id: 'did:example:123',
      },
    };
    const issuedCredential = await issueCredential({
      credential,
      mnemonic,
    });
    expect(issuedCredential.proof).toEqual(
      expect.objectContaining({
        type: 'Ed25519Signature2018',
        proofPurpose: 'assertionMethod',
      })
    );

    expect(issuedCredential['credentialSubject']).toEqual(
      expect.objectContaining(credential.credentialSubject)
    );
    expect(issuedCredential.proof).toHaveProperty('verificationMethod');
    expect(issuedCredential.proof).toHaveProperty('created');
    expect(issuedCredential.proof).toHaveProperty('jws');
  });

  it('should throw an error for missing fields', async () => {
    const mnemonic =
      'coast lesson mountain spy inform deposit two trophy album endless party crumble base grape artefact';
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/vc-revocation-list-2020/v1',
      ],
      id: 'urn:uuid:77d1699d-c031-4659-b00a-735e661b53ec',
      type: ['test'],
      credentialStatus: {
        id: 'https://api.did.actor/revocation-lists/1.json#0',
        type: 'RevocationList2020Status',
        revocationListIndex: 0,
        revocationListCredential:
          'https://api.did.actor/revocation-lists/1.json',
      },
      credentialSubject: {
        id: 'did:example:123',
      },
    };

    await expect(() =>
      issueCredential({
        credential: credential as never,
        mnemonic,
      })
    ).rejects.toThrow('credential is not valid JSON-LD');
  });
});
