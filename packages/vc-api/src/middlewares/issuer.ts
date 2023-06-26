import { check, oneOf } from 'express-validator';

/**
 * Validate the input for issuing verifiable credential that use vc-kit.
 */

export const validateCredentialPayload = () => {
  return [
    check('credential').isObject().notEmpty(),
    ...validateContext(),
    ...validateIssuer(),
    ...validateCredentialSubject(),
    ...validateType(),
    ...validateOptions(),
  ];
};

export const validateUpdateStatusCredentialPayload = () => {
  return [
    check('credentialId', 'credentialId must be a string')
      .isString()
      .notEmpty(),
    check('credentialStatus', 'credentialStatus must be an array').isArray({
      min: 1,
    }),
    check('credentialStatus.*.type', 'credentialStatus.type must be a string')
      .isString()
      .notEmpty(),
    check(
      'credentialStatus.*.status',
      'credentialStatus.status must be a string'
    )
      .isString()
      .notEmpty(),
  ];
};

const validateContext = () => {
  return [
    oneOf(
      [
        check('credential.@context').isArray({ min: 1 }),
        check('credential.@context').isString().notEmpty(),
      ],
      { message: 'credential.@context must be an array or string' }
    ),
  ];
};

const validateIssuer = () => {
  return [
    oneOf(
      [
        check('credential.issuer').isObject().notEmpty(),
        check('credential.issuer').isString().notEmpty(),
      ],
      { message: 'credential.issuer must be string or an object' }
    ),
  ];
};

const validateCredentialSubject = () => {
  return [
    check(
      'credential.credentialSubject',
      'credential.credentialSubject must be an object'
    )
      .isObject()
      .notEmpty(),
  ];
};

const validateType = () => {
  return [
    oneOf(
      [
        check('credential.type').isArray({ min: 1 }),
        check('credential.type').isString().notEmpty(),
      ],
      { message: 'credential.type must be an array or string' }
    ),
  ];
};

const validateOptions = () => {
  return [
    check('options.created', 'options.created must be a string')
      .optional()
      .isString()
      .notEmpty(),
    check('options.challenge', 'options.created must be a string')
      .optional()
      .isString()
      .notEmpty(),
    check('options.credentialStatus', 'options.created must be an object')
      .optional()
      .isObject()
      .notEmpty(),
    check(
      'options.credentialStatus.type',
      'options.credentialStatus.type must be a string'
    )
      .optional()
      .isObject()
      .notEmpty(),
  ];
};
