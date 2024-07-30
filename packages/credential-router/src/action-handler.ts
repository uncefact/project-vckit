import {
  IAgentPlugin,
  ICreateVerifiableCredentialArgs,
  ICredentialRouter,
  IVerifyCredentialArgs,
  IVerifyResult,
  IssuerAgentContext,
  VerifiableCredential,
  VerifierAgentContext,
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@vckit/core-types';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

const enum DocumentFormat {
  JWT,
  JSONLD,
  EIP712,
  OA,
  MerkleDisclosureProof2021,
}

/**
 * @public
 */
export class CredentialRouter implements IAgentPlugin {
  readonly methods: ICredentialRouter;
  readonly schema = schema.ICredentialRouter;

  constructor() {
    this.methods = {
      routeCreationVerifiableCredential:
        this.routeCreationVerifiableCredential.bind(this),
      routeVerificationCredential: this.routeVerificationCredential.bind(this),
    };
  }

  async routeCreationVerifiableCredential(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential> {
    const {  credential } = args;
    let customProofFormat = args.proofFormat
    try {
      let verifiableCredential: VerifiableCredential;
      switch (customProofFormat) {
        case 'OpenAttestationMerkleProofSignature2018':
          if (
            typeof context.agent.createVerifiableCredentialOA === 'function'
          ) {
            verifiableCredential =
              await context.agent.createVerifiableCredentialOA({
                ...args,
                credential,
              });
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialOA plugin installed'
            );
          }
          break;
        case 'MerkleDisclosureProof2021':
          if (
            typeof context.agent.createVerifiableCredentialMDP === 'function'
          ) {
            verifiableCredential =
              await context.agent.createVerifiableCredentialMDP({
                ...args,
                credential,
              });
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialMDP plugin installed'
            );
          }
          break;

        case 'EnvelopingProof':
          if (typeof context.agent.createVerifiableCredential === 'function') {
            verifiableCredential =
              await context.agent.createVerifiableCredential({
                ...args,
                credential,
              });
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialW3c plugin installed',
            );
          }
           break;
        default:
          if (typeof context.agent.createVerifiableCredential === 'function') {
            verifiableCredential =
              await context.agent.createVerifiableCredential({
                ...args,
                credential,
              });
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialW3c plugin installed'
            );
          }
          break;
      }
      return verifiableCredential;
    } catch (error) {
      throw new Error(error);
    }
  }

  async routeVerificationCredential(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    const { credential } = args;

    const type: DocumentFormat = detectDocumentType(credential);
    try {
      switch (type) {
        case DocumentFormat.OA:
          if (typeof context.agent.verifyCredentialOA === 'function') {
            return await context.agent.verifyCredentialOA(args);
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialOA plugin installed'
            );
          }
        case DocumentFormat.MerkleDisclosureProof2021:
          if (typeof context.agent.verifyCredentialMDP === 'function') {
            return await context.agent.verifyCredentialMDP(args);
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialMerkleDisclosureProof plugin installed'
            );
          }
        default:
          if (typeof context.agent.verifyCredential === 'function') {
            return await context.agent.verifyCredential(args);
          } else {
            throw new Error(
              'invalid_setup: your agent does not seem to have CredentialW3c plugin installed'
            );
          }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

function detectDocumentType(
  document: W3CVerifiableCredential | W3CVerifiablePresentation
): DocumentFormat {
  if (
    typeof document === 'string' ||
    (<VerifiableCredential>document)?.proof?.jwt
  )
    return DocumentFormat.JWT;
  if (
    (<VerifiableCredential>document)?.proof?.type ===
    'EthereumEip712Signature2021'
  )
    return DocumentFormat.EIP712;
  if (
    (<VerifiableCredential>document)?.proof?.type ===
    'OpenAttestationMerkleProofSignature2018'
  )
    return DocumentFormat.OA;
  if (
    (<VerifiableCredential>document)?.proof?.type ===
    'MerkleDisclosureProof2021'
  )
    return DocumentFormat.MerkleDisclosureProof2021;
  return DocumentFormat.JSONLD;
}
