import { jest } from '@jest/globals';
import {
  ICreateVerifiableCredentialArgs,
  IVerifyCredentialArgs,
  IssuerAgentContext,
} from '@vckit/core-types';

import { CredentialRouter } from '../src/action-handler';
import {
  ENVELOPING_PROOF_JOSE,
  RAW_CREDENTIAL,
  SIGNED_WRAPPED_DOCUMENT_JWT,
  SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE,
  SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION,
} from './mocks/constants';

describe('CredentialRouter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('routeCreationVerifiableCredential', () => {
    it('should call createVerifiableCredentialOA function when proofFormat is OpenAttestationMerkleProofSignature2018', async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredentialOA: jest
            .fn()
            .mockReturnValue(SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'OpenAttestationMerkleProofSignature2018',
      };

      const result = await credentialPlugin.routeCreationVerifiableCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual(SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION);
    });

    it('should call createVerifiableCredentialMDP function when proofFormat is MerkleDisclosureProof2021', async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredentialMDP: jest
            .fn()
            .mockReturnValue(SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'MerkleDisclosureProof2021',
      };

      const result = await credentialPlugin.routeCreationVerifiableCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual(SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE);
    });

    it('should call createVerifiableCredential function when proofFormat is JWT', async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredential: jest
            .fn()
            .mockReturnValue(SIGNED_WRAPPED_DOCUMENT_JWT),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'jwt',
      };

      const result = await credentialPlugin.routeCreationVerifiableCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual(SIGNED_WRAPPED_DOCUMENT_JWT);
    });

    it('should throw error when create a credential router with proofFormat is EnvelopingProofJose', async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredential: jest
            .fn()
            .mockReturnValue(ENVELOPING_PROOF_JOSE),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'EnvelopingProofJose',
      };

      const result = await credentialPlugin.routeCreationVerifiableCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual(ENVELOPING_PROOF_JOSE);
    });

    it(`should throw error when create a credential router with proofFormat is OpenAttestationMerkleProofSignature2018`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredentialOA: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'OpenAttestationMerkleProofSignature2018',
      };

      await expect(
        credentialPlugin.routeCreationVerifiableCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        'invalid_setup: your agent does not seem to have CredentialOA plugin installed',
      );
    });

    it(`should throw error when create a credential router with proofFormat is MerkleDisclosureProof2021`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredentialMDP: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'MerkleDisclosureProof2021',
      };

      await expect(
        credentialPlugin.routeCreationVerifiableCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        'invalid_setup: your agent does not seem to have CredentialMDP plugin installed',
      );
    });

    it(`should throw error when create a credential router with proofFormat is JWT`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredential: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'jwt',
      };

      await expect(
        credentialPlugin.routeCreationVerifiableCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        'invalid_setup: your agent does not seem to have CredentialW3c plugin installed',
      );
    });

    it(`should throw error when create a credential router with proofFormat is EnvelopingProofJose`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          createVerifiableCredential: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_CREDENTIAL,
        proofFormat: 'EnvelopingProofJose',
      };

      await expect(
        credentialPlugin.routeCreationVerifiableCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        'invalid_setup: your agent does not seem to have CredentialW3c plugin installed',
      );
    });
  });

  describe('routeVerifyCredential', () => {
    it('should call verifyCredentialOA function when credential proof type is OpenAttestationMerkleProofSignature2018', async () => {
      const mockIssuerAgentContext = {
        agent: {
          verifyCredentialOA: jest.fn().mockReturnValue({ verified: true }),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: IVerifyCredentialArgs = {
        credential: SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION,
        fetchRemoteContexts: true,
        policies: { credentialStatus: true },
      };

      const result = await credentialPlugin.routeVerificationCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual({ verified: true });
    });

    it('should call verifyCredentialMDP function when credential proof type is MerkleDisclosureProof2021', async () => {
      const mockIssuerAgentContext = {
        agent: {
          verifyCredentialMDP: jest.fn().mockReturnValue({ verified: true }),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: IVerifyCredentialArgs = {
        credential: SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE,
        fetchRemoteContexts: true,
        policies: { credentialStatus: true },
      };

      const result = await credentialPlugin.routeVerificationCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual({ verified: true });
    });

    it('should call verifyCredential function when credential proof is JWT', async () => {
      const mockIssuerAgentContext = {
        agent: {
          verifyCredential: jest.fn().mockReturnValue({ verified: true }),
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: IVerifyCredentialArgs = {
        credential: SIGNED_WRAPPED_DOCUMENT_JWT,
        fetchRemoteContexts: true,
        policies: { credentialStatus: true },
      };

      const result = await credentialPlugin.routeVerificationCredential(
        args,
        mockIssuerAgentContext,
      );

      expect(result).not.toBeNull();
      expect(result).toEqual({ verified: true });
    });

    it(`should throw error when verify a credential router with credential proof type is OpenAttestationMerkleProofSignature2018`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          verifyCredentialOA: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: IVerifyCredentialArgs = {
        credential: SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION,
      };

      await expect(
        credentialPlugin.routeVerificationCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        `invalid_setup: your agent does not seem to have CredentialOA plugin installed`,
      );
    });

    it(`should throw error when verify a credential router with credential proof type is MerkleDisclosureProof2021`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          verifyCredentialMDP: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: IVerifyCredentialArgs = {
        credential: SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE,
      };

      await expect(
        credentialPlugin.routeVerificationCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        `invalid_setup: your agent does not seem to have CredentialMerkleDisclosureProof plugin installed`,
      );
    });

    it(`should throw error when verify a credential router with credential proof is JWT`, async () => {
      const mockIssuerAgentContext = {
        agent: {
          verifyCredential: undefined,
        },
      } as unknown as IssuerAgentContext;

      const credentialPlugin = new CredentialRouter();
      const args: IVerifyCredentialArgs = {
        credential: SIGNED_WRAPPED_DOCUMENT_JWT,
      };

      await expect(
        credentialPlugin.routeVerificationCredential(
          args,
          mockIssuerAgentContext,
        ),
      ).rejects.toThrow(
        `invalid_setup: your agent does not seem to have CredentialW3c plugin installed`,
      );
    });
  });
});
