import { VerifiableCredential } from './vc';

export interface VerificationResult {
  checks: string[];
  warnings?: string[];
  errors: string[];
}

export type VerifierFunction = (
  vc: VerifiableCredential
) => Promise<VerificationResult>;
