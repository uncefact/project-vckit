import { IPluginMethodMap } from './IAgent';
import { VerifiableCredential } from './vc-data-model';
import {
  ICreateVerifiableCredentialArgs,
  IssuerAgentContext,
} from './ICredentialIssuer';
import {
  IVerifyCredentialArgs,
  VerifierAgentContext,
} from './ICredentialVerifier';
import { IVerifyResult } from './IVerifyResult';

/**
 * @public
 */
export interface IOACredentialPlugin extends IPluginMethodMap {
  /**
   * Creates a Verifiable Credential.
   * The payload, signer and format are chosen based on the `args` parameter.
   *
   * @param args - Arguments necessary to create the Presentation.
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the {@link @veramo/core-types#VerifiableCredential} that was requested or rejects
   *   with an error if there was a problem with the input or while getting the key to sign
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  createVerifiableCredentialOA(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential>;

  /**
   * Verifies a Verifiable Credential Open Attestation Format.
   *
   * @param args - Arguments necessary to verify a VerifiableCredential
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to an object containing a `verified` boolean property and an optional `error`
   *   for details
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  verifyCredentialOA(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult>;
}
