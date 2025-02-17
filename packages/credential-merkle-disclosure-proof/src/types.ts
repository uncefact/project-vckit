import {
  CredentialPayload,
  IAgentContext,
  IDIDManager,
  IKeyManager,
  IPluginMethodMap,
  IResolver,
  IVerifyResult,
  VerifiableCredential,
} from '@uncefact/vckit-core-types';

/**
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export interface ICredentialIssuerMDP extends IPluginMethodMap {
  /**
   * Creates a Verifiable Credential.
   * The payload, signer and format are chosen based on the `args` parameter.
   *
   * @param args - Arguments necessary to create the Presentation.
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the {@link @veramo/core-types#VerifiableCredential} that was requested or rejects with an error
   * if there was a problem with the input or while getting the key to sign
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   *
   * @beta This API may change without a BREAKING CHANGE notice.
   */
  createVerifiableCredentialMDP(
    args: ICreateVerifiableCredentialMDPArgs,
    context: IRequiredContext
  ): Promise<VerifiableCredential>;

  /**
   * Redacts a Verifiable Credential Merkle Disclosure Proof Format.
   * @param args
   * @param context
   * @returns - a promise that resolves to the redacted VerifiableCredential
   *
   * @beta This API may change without a BREAKING CHANGE notice.
   */
  redactVerifiableCredential(
    args: IRedactVerifiableCredentialArgs,
    context: IRequiredContext
  ): Promise<VerifiableCredential>;

  /**
   * Verifies a Verifiable Credential Merkle Disclosure Proof Format.
   *
   * @param args - Arguments necessary to verify a VerifiableCredential
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the boolean true on successful verification or rejects on error
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   *
   * @beta This API may change without a BREAKING CHANGE notice.
   */
  verifyCredentialMDP(
    args: IVerifyCredentialMDPArgs,
    context: IRequiredContext
  ): Promise<IVerifyResult>;
}

/**
 * Encapsulates the parameters required to create a
 * {@link https://www.w3.org/TR/vc-data-model/#credentials | W3C Verifiable Credential}
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export interface ICreateVerifiableCredentialMDPArgs {
  /**
   * The json payload of the Credential according to the
   * {@link https://www.w3.org/TR/vc-data-model/#credentials | canonical model}
   *
   * The signer of the Credential is chosen based on the `issuer.id` property
   * of the `credential`
   *
   * `@context`, `type` and `issuanceDate` will be added automatically if omitted
   */
  credential: CredentialPayload;

  /**
   * Optional. The key handle ({@link @veramo/core-types#IKey.kid | IKey.kid}) from the internal database.
   */
  keyRef?: string;

  /**
   * Set this to true if you want the `@context` URLs to be fetched in case they are not preloaded.
   *
   * Defaults to `false`
   */
  fetchRemoteContexts?: boolean;

  /**
   * Any other options that can be forwarded to the lower level libraries
   */
  [x: string]: any;
}

/**
 * Encapsulates the parameters required to verify a
 * {@link https://www.w3.org/TR/vc-data-model/#credentials | W3C Verifiable Credential}
 *
 * @beta This API may change without a BREAKING CHANGE notice
 */
export interface IVerifyCredentialMDPArgs {
  /**
   * The json payload of the Credential according to the
   * {@link https://www.w3.org/TR/vc-data-model/#credentials | canonical model}
   *
   * The signer of the Credential is chosen based on the `issuer.id` property
   * of the `credential`
   *
   */
  credential: VerifiableCredential;

  /**
   * Set this to true if you want the `@context` URLs to be fetched in case they are not preloaded.
   *
   * Defaults to `false`
   */
  fetchRemoteContexts?: boolean;

  /**
   * Any other options that can be forwarded to the lower level libraries
   */
  [x: string]: any;
}

/**
 *
 * @beta
 */
export interface IRedactVerifiableCredentialArgs {
  inputVerifiableCredential: VerifiableCredential;
  outputCredential: CredentialPayload;

  [x: string]: any;
}

/**
 * Represents the requirements that this plugin has.
 * The agent that is using this plugin is expected to provide these methods.
 *
 * This interface can be used for static type checks, to make sure your application is properly initialized.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export type IRequiredContext = IAgentContext<
  IResolver &
    Pick<IDIDManager, 'didManagerGet'> &
    Pick<IKeyManager, 'keyManagerGet' | 'keyManagerSign'>
>;

/**
 * Describes a document with a `@context` property.
 *
 * @beta This API may change without a BREAKING CHANGE notice.
 */
export type ContextDoc = {
  '@context': Record<string, any>;
};
