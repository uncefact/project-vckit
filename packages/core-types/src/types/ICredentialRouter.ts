import { VerifiableCredential } from './vc-data-model.js';
import { IPluginMethodMap } from './IAgent.js';
import {
  IssuerAgentContext,
  ICreateVerifiableCredentialArgs,
} from './ICredentialIssuer.js';
import {
  IVerifyCredentialArgs,
  VerifierAgentContext,
} from './ICredentialVerifier.js';
import { IVerifyResult } from './IVerifyResult.js';

/**
 * @public
 */
export interface ICredentialRouter extends IPluginMethodMap {
  /**
   * Creates a Verifiable Credential.
   * The payload, signer and format are chosen based on the `args` parameter.
   *
   * @param args - Arguments necessary to create the Credential.
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to the {@link @veramo/core-types#VerifiableCredential} that was requested or rejects
   *   with an error if there was a problem with the input or while getting the key to sign
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  routeCreationVerifiableCredential(
    args: ICreateVerifiableCredentialArgs,
    context: IssuerAgentContext
  ): Promise<VerifiableCredential>;

  /**
   * Verifies a Verifiable Credential JWT, LDS Format, EIP712 or OA.
   *
   * @param args - Arguments necessary to verify a VerifiableCredential
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @returns - a promise that resolves to an object containing a `verified` boolean property and an optional `error`
   *   for details
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#credentials | Verifiable Credential data model}
   */
  routeVerificationCredential(
    args: IVerifyCredentialArgs,
    context: VerifierAgentContext
  ): Promise<IVerifyResult>;
}
