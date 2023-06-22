import { VerifiableCredential, VerifiablePresentation } from '@vckit/core-types';
import { IssueCredentialOptions } from './issuer';

export type VerifierCredentialRequestPayload = {
  verifiableCredential: VerifiableCredential;
  options?: VerifierCredentialOptions; // Options for specifying how the LinkedDataProof is created.
};

export type VerifierCredentialOptions = Omit<
  IssueCredentialOptions,
  'credentialStatus' | 'created'
>;

export type VerificationResult = {
  checks: string[];
  warnings: string[];
  errors: string[];
}

export type VerifierPresentationRequestPayload = {
  verifiablePresentation: VerifiablePresentation;
  options?: VerifierPresentationOptions;
}

export type VerifierPresentationOptions = {
  verificationMethod?: string;
  proofPurpose?: string;
  domain?: string;
  created?: string;
  challenge?: string;
}