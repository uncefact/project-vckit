import {
  IAgentPlugin,
  ICreateVerifiableCredentialArgs,
  ICreateVerifiablePresentationArgs,
  ICredentialPlugin,
  IssuerAgentContext,
  IVerifyCredentialArgs,
  IVerifyPresentationArgs,
  IVerifyResult,
  ProofFormat,
  VerifiableCredential,
  VerifiablePresentation,
  VerifierAgentContext,
  W3CVerifiableCredential,
  W3CVerifiablePresentation,
} from '@vckit/core-types';

import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

import Debug from 'debug';

type Operation = 'createCredential' | 'createPresentation' | 'verifyCredential' | 'verifyPresentation'
type OperationMap = {
  [key in Operation]?: string
}

// TODO: improve ProofFormat type definition
// 
// this same concept is handled slightly differently in a few places
// around the veramo code base - as a type with string options in credential
// issuer interface, as an enum in credentialW3c. 
// 
// I think it would be better to have the proof formats represent explicitly 
// the name of the signature specification. Leaving this here for now, but we should
// move it to core-types and think about making them more precise - this will 
// result in having to map values when calling veramo methods which expect the 
// shorter version. 
export type ProofFormat = 'jwt' | 'lds' | 'EthereumEip712Signature2021' | 'OpenAttestationMerkleProofSignature2018'

type CredentialRoutingConfig = {
  [key in ProofFormat]: OperationMap
}

const debug = Debug('vckit:router:action-handler');

/**
 * A Veramo plugin that implements the {@link @veramo/core-types#ICredentialPlugin | ICredentialPlugin} methods.
 *
 * @public
 */
export class CredentialRouterPlugin implements IAgentPlugin {
  readonly methods: ICredentialPlugin;
  private credentialRouterConfig: CredentialRoutingConfig
  readonly schema = {
    components: {
      schemas: {
        ...schema.ICredentialIssuer.components.schemas,
        ...schema.ICredentialVerifier.components.schemas,
      },
      methods: {
        ...schema.ICredentialIssuer.components.methods,
        ...schema.ICredentialVerifier.components.methods,
      },
    },
  };

  constructor(options: { routingConfig: CredentialRoutingConfig }) {
    this.credentialRouterConfig = options.routingConfig
    this.methods = {
      routerCreateVerifiablePresentation:
        this.routerCreateVerifiablePresentation.bind(this),
      routerCreateVerifiableCredential: this.routerCreateVerifiableCredential.bind(this),
      verifyCredential: this.routerVerifyCredential.bind(this),
      verifyPresentation: this.routerVerifyPresentation.bind(this),
    };
  }

  // TODO: move detectDocumentType to core function
  // 
  // the function below is here now for convenience, but it's likely 
  // to be useful elsewhere. we should set up a utility functions package, 
  // and include this there once done. 

  detectDocumentType(
    document: W3CVerifiableCredential | W3CVerifiablePresentation
  ): ProofFormat {
    if (
      typeof document === 'string' ||
      (<VerifiableCredential>document)?.proof?.jwt
    )
      return 'jwt'
    if (
      (<VerifiableCredential>document)?.proof?.type ===
      'EthereumEip712Signature2021'
    )
      return 'EthereumEip712Signature2021'
    if (
      (<VerifiableCredential>document)?.proof?.type ===
      'OpenAttestationMerkleProofSignature2018'
    )
      return 'OpenAttestationMerkleProofSignature2018'
    return 'lds'
  }

  // TODO: tests for getAgentMethod
  getAgentMethod(
    context: IssuerAgentContext | VerifierAgentContext,
    operation: string,
    proofFormat: ProofFormat
    ){
      try {
        const proofFormatKey = proofFormat as keyof typeof this.credentialRouterConfig
        const operationMap = this.credentialRouterConfig[proofFormatKey]
        const operationKey = operation as keyof typeof operationMap
        const methodName = operationMap[operationKey] || 'unknown'
        const agentMethod = context.agent[methodName]
        if (typeof agentMethod === 'function'){
          return agentMethod
        } else {
          throw new Error(
            `invalid_setup: your agent does not seem to have ${proofFormat} plugin installed`
          );
        }
      } catch (error) {
        throw new Error(
          `invalid_setup: missing or incorrect router configuration`
        )
      }
    }

  // TODO: tests for routerCreateVerifiablePresentation
  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiablePresentation} */
  async routerCreateVerifiablePresentation(
    args: ICreateVerifiablePresentationArgs,
    context: IssuerAgentContext
  ): Promise<VerifiablePresentation> {
    const { proofFormat } = args
    const agentMethod = this.getAgentMethod(context, 'createPresentation', proofFormat)
    return await agentMethod(args)
   }

  // TODO: tests for routerCreateVerifiableCredential
  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiableCredential} */
  async routerCreateVerifiableCredential(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential> {
    const { proofFormat } = args;
    const agentMethod = this.getAgentMethod(context, 'createCredential', proofFormat)
    return await agentMethod(args);
  }

  // TODO: tests for routerVerifyCredential
  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyCredential} */
  async routerVerifyCredential(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    const proofFormat = this.detectDocumentType(args?.credential)
    const agentMethod = this.getAgentMethod(context, 'verifyCredential', proofFormat)
    return await agentMethod(args);

  }

  // TODO: tests for routerVerifyPresentation
  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyPresentation} */
  async routerVerifyPresentation(
    args: IVerifyPresentationArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    const proofFormat = this.detectDocumentType(args?.presentation)
    const agentMethod = this.getAgentMethod(args, context, 'verifyPresentation')
    return await agentMethod(args);

  }
}
