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
} from '@vckit/core-types';

import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

import Debug from 'debug';

interface ICredentialRoutingConfig {
  proofFormat: ProofFormat,

}

const debug = Debug('vckit:router:action-handler');

/**
 * A Veramo plugin that implements the {@link @veramo/core-types#ICredentialPlugin | ICredentialPlugin} methods.
 *
 * @public
 */
export class CredentialRouterPlugin implements IAgentPlugin {
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

  constructor(options: { routingConfig: any }) {
    this.credentialRouterConfig = options.routingConfig
    // @ts-ignore FIXME
    this.methods = {
      routerCreateVerifiablePresentation:
        this.routerCreateVerifiablePresentation.bind(this),
      routerCreateVerifiableCredential: this.routerCreateVerifiableCredential.bind(this),
      verifyCredential: this.routerVerifyCredential.bind(this),
      verifyPresentation: this.routerVerifyPresentation.bind(this),
    };
  }

  getAgentMethod(
    args: ICreateVerifiableCredentialArgs | ICreateVerifiablePresentationArgs | IVerifyCredentialArgs | IVerifyPresentationArgs,
    context: IssuerAgentContext | VerifierAgentContext,
    operation: string
    ){

      try {
        const { proofFormat } = args;
        const methodName = this.credentialRouterConfig[proofFormat][operation]
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

  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiablePresentation} */
  async routerCreateVerifiablePresentation(
    args: ICreateVerifiablePresentationArgs,
    context: IssuerAgentContext
  ): Promise<VerifiablePresentation> {
    
    const agentMethod = this.getAgentMethod(args, context, 'createPresentation')
    return await agentMethod(args);

   }

  /** {@inheritdoc @veramo/core-types#ICredentialIssuer.createVerifiableCredential} */
  async routerCreateVerifiableCredential(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential> {

    const agentMethod = this.getAgentMethod(args, context, 'createCredential')
    return await agentMethod(args);
  }

  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyCredential} */
  async routerVerifyCredential(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    
    const agentMethod = this.getAgentMethod(args, context, 'verifyCredential')
    return await agentMethod(args);

  }

  /** {@inheritdoc @veramo/core-types#ICredentialVerifier.verifyPresentation} */
  async routerVerifyPresentation(
    args: IVerifyPresentationArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult> {
    
    const agentMethod = this.getAgentMethod(args, context, 'verifyPresentation')
    return await agentMethod(args);

  }
}
