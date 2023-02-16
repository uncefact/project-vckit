import { VerifiableCredential, VerificationResult } from '@dvp/api-interfaces';
import { Ed25519Signature2018 } from '@transmute/ed25519-signature-2018';
import { ApplicationError } from '../../error';

import { JsonWebSignature } from '@transmute/json-web-signature';

import { checkStatus } from '@transmute/vc-status-rl-2020';
import { verifiable } from '@transmute/vc.js';

import { documentLoader } from './documentLoader';

export const verifyCredential = async (
  verifiableCredential: VerifiableCredential
): Promise<VerificationResult> => {
  const checks = verifiableCredential.credentialStatus
    ? ['proof', 'status', 'identity']
    : ['proof', 'identity'];

  try {
    const result = await verifiable.credential.verify({
      credential: verifiableCredential,
      suite: [new Ed25519Signature2018(), new JsonWebSignature()],
      checkStatus,
      documentLoader,
    });

    if (result.verified) {
      return {
        checks,
        errors: [],
        warnings: [],
      };
    }
    const proofCheckFailed = !!(
      result['error'] &&
      result['error'].find(
        (e: any) =>
          e?.proofResult?.verified === false || e?.proofResult === false
      )
    );
    const statusCheckFailed = !!(
      result['error'] &&
      result['error'].find(
        (e: any) =>
          e?.statusResult?.verified === false || e?.statusResult === false
      )
    );

    // Credential not active
    const inactive = !!(
      result['verifications'] &&
      result['verifications'].find(
        (verification: any) =>
          verification.status === 'bad' && verification.title === 'Activation'
      )
    );

    // Credential Expired
    const expired =
      result['verifications'] &&
      result['verifications'].find(
        (verification: any) =>
          verification.status === 'bad' && verification.title === 'Expired'
      );

    let errors = ['identity'];
    if (statusCheckFailed) {
      // Revocation
      errors = ['status'];
    } else if (proofCheckFailed) {
      // Signature
      errors = ['proof'];
    }

    if (inactive) {
      errors.push('inactive');
    }

    if (expired) {
      errors.push('expired');
    }

    return {
      checks,
      errors,
      warnings: [],
    };
  } catch (err) {
    throw new ApplicationError((err as Error).message);
  }
};
