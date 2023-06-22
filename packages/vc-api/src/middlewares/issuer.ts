import { check, oneOf } from 'express-validator';
import { checkArray, checkObject, checkString } from './verifier';

/**
 * Validate the input for issuing verifiable credential that use vc-kit.
 */

export const validateCredentialPayload = () => {
  return [
    checkObject({ path: 'credential' }),
    ...validateContext(),
    ...validateIssuer(),
    ...validateCredentialSubject(),
    ...validateType(),
    ...validateOptions(),
  ];
};

export const validateUpdateStatusCredentialPayload = () => {
  return [
    checkString({ path: 'credentialId' }),
    checkArray({ path: 'credentialStatus' }),
    checkString({ path: 'credentialStatus.*.type' }),
    checkString({ path: 'credentialStatus.*.id' }),
  ];
};

const validateContext = () => {
  return [
    oneOf(
      [
        checkArray({ path: 'credential.@context' }),
        checkString({ path: 'credential.@context' }),
      ],
      { message: 'credential.@context must be an array or string' }
    ),
  ];
};

const validateIssuer = () => {
  return [
    oneOf(
      [
        checkString({ path: 'credential.issuer' }),
        checkObject({ path: 'credential.issuer' }),
      ],
      { message: 'credential.issuer must be string or an object' }
    ),
  ];
};

const validateCredentialSubject = () => {
  return [
    checkObject({
      path: 'credential.credentialSubject',
    }),
  ];
};

const validateType = () => {
  return [
    oneOf(
      [
        checkArray({ path: 'credential.type' }),
        checkString({ path: 'credential.type' }),
      ],
      { message: 'credential.type must be an array or string' }
    ),
  ];
};

const validateOptions = () => {
  return [
    checkString({ path: 'options.created' }).optional(),
    checkString({ path: 'options.challenge' }).optional(),
    checkObject({ path: 'options.credentialStatus' }).optional(),
    checkString({ path: 'options.credentialStatus.type' }).optional(),
  ];
};
