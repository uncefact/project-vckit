import { ICredentialVerifierBase } from './ICredentialVerifierBase.js';
import { IPresentationVerifierBase } from './IPresentationVerifierBase.js';

/**
 * The interface definition for a plugin that can generate Verifiable Credentials and Presentations
 *
 * @see {@link @veramo/credential-w3c#CredentialPlugin} for an implementation.
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
export type ICredentialVerifier = ICredentialVerifierBase & IPresentationVerifierBase