import {
  IAgentContext,
  IAgentPlugin,
  ICreateVerifiableCredentialArgs,
  ICreateVerifiablePresentationArgs,
  ICredentialIssuer,
  ICredentialPlugin,
  IssuerAgentContext,
  IVerifyCredentialArgs,
  IVerifyPresentationArgs,
  IVerifyResult,
  ProofFormat,
  VerifiableCredential,
  VerifiablePresentation,
  VerifierAgentContext,
} from '@vckit/core-types';

import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

import Debug from 'debug';

interface ICredentialRoutingConfig {
  proofFormat: ProofFormat,

}

const enum DocumentFormat {
  JWT,
  JSONLD,
  EIP712,
}

const debug = Debug('vckit:router:action-handler');

/**
 * A Veramo plugin that implements the {@link @veramo/core-types#ICredentialPlugin | ICredentialPlugin} methods.
 *
 * @public
 */
export class CredentialPlugin implements IAgentPlugin {
  readonly methods: ICredentialPlugin;
  private credentialRouterConfig: any
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

  // @ts-ignore
  constructor(options: { routingConfig: any }) {
    console.log('options')
    console.log(options)
    this.credentialRouterConfig = options.routingConfig
    console.log('routerConfig')
    console.log(this.credentialRouterConfig)
    // @ts-ignore FIXME
    this.methods = {
      createVerifiablePresentation:
        this.createVerifiablePresentation.bind(this),
      credentialCreate: this.credentialCreate.bind(this),
      verifyCredential: this.verifyCredential.bind(this),
      verifyPresentation: this.verifyPresentation.bind(this),
    };
  }

  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiablePresentation} */
  async createVerifiablePresentation(
    args: ICreateVerifiablePresentationArgs,
    context: IssuerAgentContext
  ): Promise<VerifiablePresentation> {
    // const { proofFormat } = args;
    // console.log('proofFormat', proofFormat)
    // console.log(this.credentialRouterConfig[proofFormat])
    // console.log('createVerifiablePresentation')
    // @ts-ignore
    return ''
   }

  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiableCredential} */
  async credentialCreate(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential> {
    const { proofFormat } = args;
    console.log('proofFormat', proofFormat)
    const methodName = this.credentialRouterConfig[proofFormat].credentialCreate
    const agentMethod = context.agent[methodName]

    if (typeof agentMethod === 'function'){
      return await agentMethod(args) 
    } else {
      throw new Error(
        `invalid_setup: your agent does not seem to have ${proofFormat} plugin installed`
      );
    }
    
  }
  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyCredential} */
  async verifyCredential(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    console.log('verifyCredential')
    // @ts-ignore
    return verificationResult;
  }

  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyPresentation} */
  async verifyPresentation(
    args: IVerifyPresentationArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    console.log('verifyPresentation')
    // @ts-ignore
    return verificationResult;
  }
}
