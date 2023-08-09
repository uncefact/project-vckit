import { jest } from '@jest/globals';

import {
  ICreateVerifiableCredentialArgs,
  IssuerAgentContext,
} from '@vckit/core-types';

import { CredentialOA } from '../src/action-handler';
import {
  INVALID_RAW_OA_CREDENTIAL,
  RAW_OA_CREDENTIAL,
} from './mocks/constants';

describe('CredentialOA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('createVerifiableCredentialOA', () => {
    it('should create a verifiable credential with valid inputs', async () => {
      const credentialPlugin = new CredentialOA();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_OA_CREDENTIAL,
        proofFormat: 'OpenAttestationMerkleProofSignature2018',
      };
      const signature = '0x0987';
      const did = 'did:ethr:0xabc123';
      const issuerAgentContext = {
        agent: {
          didManagerGet: jest.fn().mockReturnValue({
            did,
            keys: [
              {
                kid: 'kid',
                type: 'Secp256k1',
                kms: 'local',
                publicKeyHex: 'test',
              },
            ],
          }),
          keyManagerSign: jest.fn().mockReturnValue(signature),
        },
      } as unknown as IssuerAgentContext;
      const result = await credentialPlugin.createVerifiableCredentialOA(
        args,
        issuerAgentContext
      );
      expect(result).toBeDefined();
      expect(result['@context']).toContain(
        'https://www.w3.org/2018/credentials/v1'
      );
      expect(result.type).toContain('VerifiableCredential');
      expect(result.type).toContain('OpenAttestationCredential');
      expect(result.proof.signature).toEqual(signature);
      expect(result.proof.key).toEqual(`${did}#controller`);
    });
    it('should throw an error if DID not managed by KMS', async () => {
      const credentialPlugin = new CredentialOA();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_OA_CREDENTIAL,
        proofFormat: 'OpenAttestationMerkleProofSignature2018',
      };
      const did = 'did:ethr:0xabc123';
      const issuerAgentContext = {
        agent: {
          didManagerGet: jest.fn().mockReturnValue({
            did,
            keys: [
              {
                kid: 'kid',
                type: 'Ed25519',
                kms: 'local',
                publicKeyHex: 'test',
              },
            ],
          }),
        },
      } as unknown as IssuerAgentContext;
      await expect(
        credentialPlugin.createVerifiableCredentialOA(args, issuerAgentContext)
      ).rejects.toThrow('No signing key for ' + did);
    });
    it('should throw an error if payload is not in OpenAttestation format', async () => {
      const credentialPlugin = new CredentialOA();
      const args: ICreateVerifiableCredentialArgs = {
        credential: INVALID_RAW_OA_CREDENTIAL,
        proofFormat: 'OpenAttestationMerkleProofSignature2018',
      };
      await expect(
        credentialPlugin.createVerifiableCredentialOA(
          args,
          {} as IssuerAgentContext
        )
      ).rejects.toThrow(
        'invalid_argument: credential is not a valid OpenAttestation document'
      );
    });
    it('should throw an error if key type is not Secp256k1', async () => {
      const credentialPlugin = new CredentialOA();
      const args: ICreateVerifiableCredentialArgs = {
        credential: RAW_OA_CREDENTIAL,
        proofFormat: 'OpenAttestationMerkleProofSignature2018',
      };
      const issuerAgentContext = {
        agent: {
          didManagerGet: jest.fn().mockImplementation(() => {
            throw new Error();
          }),
        },
      } as unknown as IssuerAgentContext;
      await expect(
        credentialPlugin.createVerifiableCredentialOA(args, issuerAgentContext)
      ).rejects.toThrow('invalid_argument: did not found in the DID manager');
    });
  });
});
