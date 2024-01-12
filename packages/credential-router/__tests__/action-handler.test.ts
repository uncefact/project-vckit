import { jest } from '@jest/globals';
import {
  ICreateVerifiableCredentialArgs,
  IVerifyCredentialArgs,
  IssuerAgentContext,
  ProofFormat,
  VerifiableCredential,
  W3CVerifiableCredential,
} from '@vckit/core-types';

import { CredentialRouter } from '../src/action-handler';
import {
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
    const routerCreateCredentialTestSuccessfully = (
      proofFormat: ProofFormat,
      signedDocument: VerifiableCredential,
    ) =>
      it(`should create a credential router with proofFormat is ${proofFormat}`, async () => {
        const mockIssuerAgentContext = {
          agent: {
            createVerifiableCredentialOA: jest
              .fn()
              .mockReturnValue(signedDocument),
            createVerifiableCredentialMDP: jest
              .fn()
              .mockReturnValue(signedDocument),
            createVerifiableCredential: jest
              .fn()
              .mockReturnValue(signedDocument),
          },
        } as unknown as IssuerAgentContext;

        const credentialPlugin = new CredentialRouter();
        const args: ICreateVerifiableCredentialArgs = {
          credential: RAW_CREDENTIAL,
          proofFormat,
        };

        const result = await credentialPlugin.routeCreationVerifiableCredential(
          args,
          mockIssuerAgentContext,
        );

        expect(result).not.toBeNull();
        expect(result).toEqual(signedDocument);
      });

    routerCreateCredentialTestSuccessfully(
      'OpenAttestationMerkleProofSignature2018',
      SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION,
    );
    routerCreateCredentialTestSuccessfully(
      'MerkleDisclosureProof2021',
      SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE,
    );
    routerCreateCredentialTestSuccessfully('jwt', SIGNED_WRAPPED_DOCUMENT_JWT);

    const routerCreateCredentialTestFailed = (
      proofFormat: ProofFormat,
      pluginName: string,
    ) =>
      it(`should throw error when create a credential router with proofFormat is ${proofFormat}`, async () => {
        const mockIssuerAgentContext = {
          agent: {
            createVerifiableCredentialOA: undefined,
            createVerifiableCredentialMDP: undefined,
            createVerifiableCredential: undefined,
          },
        } as unknown as IssuerAgentContext;

        const credentialPlugin = new CredentialRouter();
        const args: ICreateVerifiableCredentialArgs = {
          credential: RAW_CREDENTIAL,
          proofFormat,
        };

        await expect(
          credentialPlugin.routeCreationVerifiableCredential(
            args,
            mockIssuerAgentContext,
          ),
        ).rejects.toThrow(
          `invalid_setup: your agent does not seem to have ${pluginName} plugin installed`,
        );
      });

    routerCreateCredentialTestFailed(
      'OpenAttestationMerkleProofSignature2018',
      'CredentialOA',
    );
    routerCreateCredentialTestFailed(
      'MerkleDisclosureProof2021',
      'CredentialMDP',
    );
    routerCreateCredentialTestFailed('jwt', 'CredentialW3c');
  });

  describe('routeVerifyCredential', () => {
    const enum DocumentFormat {
      JWT,
      JSONLD,
      EIP712,
      OA,
      MerkleDisclosureProof2021,
    }

    const routerVerifyCredentialTestSuccessFully = (
      type: DocumentFormat,
      credential: W3CVerifiableCredential,
    ) =>
      it(`should return value when verify a credential router with credential is ${type}`, async () => {
        const mockIssuerAgentContext = {
          agent: {
            verifyCredentialOA: jest.fn().mockReturnValue({ verified: true }),
            verifyCredentialMDP: jest.fn().mockReturnValue({ verified: true }),
            verifyCredential: jest.fn().mockReturnValue({ verified: true }),
          },
        } as unknown as IssuerAgentContext;

        const credentialPlugin = new CredentialRouter();
        const args: IVerifyCredentialArgs = {
          credential,
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

    routerVerifyCredentialTestSuccessFully(
      DocumentFormat.OA,
      SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION,
    );
    routerVerifyCredentialTestSuccessFully(
      DocumentFormat.MerkleDisclosureProof2021,
      SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE,
    );
    routerVerifyCredentialTestSuccessFully(
      DocumentFormat.JWT,
      SIGNED_WRAPPED_DOCUMENT_JWT,
    );

    const routerVerifyCredentialTestFailed = (
      type: DocumentFormat,
      pluginName: string,
      credential: W3CVerifiableCredential,
    ) =>
      it(`should throw error when verify a credential router with credential is ${type}`, async () => {
        const mockIssuerAgentContext = {
          agent: {
            verifyCredentialOA: undefined,
            verifyCredentialMDP: undefined,
            verifyCredential: undefined,
          },
        } as unknown as IssuerAgentContext;

        const credentialPlugin = new CredentialRouter();
        const args: IVerifyCredentialArgs = {
          credential,
        };

        await expect(
          credentialPlugin.routeVerificationCredential(
            args,
            mockIssuerAgentContext,
          ),
        ).rejects.toThrow(
          `invalid_setup: your agent does not seem to have ${pluginName} plugin installed`,
        );
      });

    routerVerifyCredentialTestFailed(
      DocumentFormat.OA,
      'CredentialOA',
      SIGNED_WRAPPED_DOCUMENT_OPEN_ATTESTATION,
    );
    routerVerifyCredentialTestFailed(
      DocumentFormat.MerkleDisclosureProof2021,
      'CredentialMerkleDisclosureProof',
      SIGNED_WRAPPED_DOCUMENT_MERKLE_DISCLOSURE,
    );
    routerVerifyCredentialTestFailed(
      DocumentFormat.JWT,
      'CredentialW3c',
      SIGNED_WRAPPED_DOCUMENT_JWT,
    );
  });
});
