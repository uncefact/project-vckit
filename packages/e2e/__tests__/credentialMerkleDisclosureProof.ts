import {
  IAgentOptions,
  ICredentialIssuer,
  IDIDManager,
  IKeyManager,
  IResolver,
  TAgent,
} from '@uncefact/vckit-core-types';

type ConfiguredAgent = TAgent<
  IDIDManager & IKeyManager & IResolver & ICredentialIssuer
>;

// eslint-disable-next-line import/no-anonymous-default-export
export default (testContext: {
  getAgent: () => ConfiguredAgent;
  setup: (options?: IAgentOptions) => Promise<boolean>;
  tearDown: () => Promise<boolean>;
}) => {
  describe('Issue credential', () => {
    let agent: ConfiguredAgent;

    beforeAll(async () => {
      await testContext.setup();
      agent = testContext.getAgent();
    });

    afterAll(async () => {
      await testContext.tearDown();
    });

    it('should issue credential', async () => {
      const issuer = await agent.didManagerCreate({
        provider: 'did:web',
        alias: 'example.com',
      });

      const credential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: issuer.did },
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://veramo.io/contexts/profile/v1',
          ],
          type: ['VerifiableCredential', 'Profile'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            name: 'Alice',
          },
        },
        save: false,
        proofFormat: 'MerkleDisclosureProof2021',
      });

      expect(credential.proof.jwt).toBeDefined();
      expect(credential.proof.proofs).toBeDefined();
      expect(credential.proof.type).toEqual('MerkleDisclosureProof2021');
      expect(credential.proof.normalization).toEqual('jsonPointer');
    });
  });
};
