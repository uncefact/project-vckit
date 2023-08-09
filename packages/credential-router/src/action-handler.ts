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
    const { proofFormat, credential } = args;
    try {
      let verifiableCredential: VerifiableCredential;
      if (proofFormat === 'OpenAttestationMerkleProofSignature2018') {
        if (typeof context.agent.createVerifiableCredentialOA === 'function') {
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
      } else {
        if (typeof context.agent.createVerifiableCredential === 'function') {
          verifiableCredential = await context.agent.createVerifiableCredential(
            {
              ...args,
              credential,
            }
          );
        } else {
          throw new Error(
            'invalid_setup: your agent does not seem to have CredentialW3c plugin installed'
          );
        }
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
      if (type === DocumentFormat.OA) {
        if (typeof context.agent.verifyCredentialOA === 'function') {
          return await context.agent.verifyCredentialOA(args);
        } else {
          throw new Error(
            'invalid_setup: your agent does not seem to have CredentialOA plugin installed'
          );
        }
      } else {
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
  return DocumentFormat.JSONLD;
}
