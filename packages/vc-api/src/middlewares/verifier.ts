import { check, oneOf } from 'express-validator';

export type ValidatorArgs = {
  path: string;
  required?: boolean;
  msg?: string;
};

export const checkObject = ({
  path,
  required = true,
  msg = '',
}: ValidatorArgs) => {
  if (!path) throw new Error('path is required');
  const chain = check(path, msg || 'must be a string');
  return required ? chain.notEmpty() : chain;
};

export const checkString = ({
  path,
  required = true,
  msg = '',
}: ValidatorArgs) => {
  if (!path) throw new Error('path is required');
  const chain = check(path, msg || `${path} must be an object`).isString();
  return required ? chain.notEmpty() : chain;
};

export const checkArray = ({
  path,
  required = true,
  msg = '',
}: ValidatorArgs) => {
  if (!path) throw new Error('path is required');
  return required
    ? check(path, msg || `${path} must be a non-empty array`).isArray({
        min: 1,
      })
    : check(path, msg || `${path} must be an array`).isArray();
};

/**
 * Validate the input for verifying credential that use vc-kit.
 */

export const validateVerifyCredentialRequest = () => {
  return [
    checkObject({
      path: 'verifiableCredential',
    }),
    ...validateContext(),
    ...validateIssuer(),
    ...validateCredentialSubject(),
    ...validateType(),
    ...validateProof(),
    ...validateOptions(),
  ];
};

export const validateVerifyPresentationRequest = () => {
  return [
    checkObject({
      path: 'verifiablePresentation',
    }),
    ...validateOptions(),
    checkString({ path: 'options.verificationMethod' }),
    checkString({ path: 'options.proofPurpose' })
  ];
};

const validateProof = () => {
  return [
    checkObject({ path: 'verifiableCredential.proof' }),
    checkString({ path: 'verifiableCredential.proof.type' }),
    checkString({ path: 'verifiableCredential.proof.created' }),
    checkString({ path: 'verifiableCredential.proof.challenge' }).optional(),
    checkString({ path: 'verifiableCredential.proof.domain' }).optional(),
    checkString({ path: 'verifiableCredential.proof.nonce' }).optional(),
    checkString({ path: 'verifiableCredential.proof.verificationMethod' }),
    checkString({ path: 'verifiableCredential.proof.proofPurpose' }),
    checkString({ path: 'verifiableCredential.proof.jws' }).optional(),
    checkString({ path: 'verifiableCredential.proof.proofValue' }),
  ];
};

const validateContext = () => {
  return [
    checkArray({ path: 'verifiableCredential.@context' }),
    checkString({ path: 'verifiableCredential.@context.*' }),
  ];
};

const validateIssuer = () => {
  return [
    oneOf(
      [
        checkObject({ path: 'verifiableCredential.issuer' }),
        checkString({ path: 'verifiableCredential.issuer' }),
      ],
      { message: 'verifiableCredential.issuer must be string or an object' }
    ),
  ];
};

const validateCredentialSubject = () => {
  return [
    checkObject({
      path: 'verifiableCredential.credentialSubject',
    }),
  ];
};

const validateType = () => {
  return [
    checkArray({
      path: 'verifiableCredential.type',
    }),

    checkString({
      path: 'verifiableCredential.type.*',
    }),
  ];
};

const validateOptions = () => {
  return [
    checkString({
      path: 'options.domain',
    }).optional(),
    checkString({
      path: 'options.challenge',
    }).optional(),
  ];
};
