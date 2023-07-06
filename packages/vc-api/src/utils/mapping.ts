import {
  ICreateVerifiableCredentialArgs,
  IVerifyCredentialArgs,
  IVerifyPresentationArgs,
} from '@vckit/core-types';
import { IssuerConfiguration } from '../config';
import {
  IssueCredentialRequestPayload
} from '../types';
import {
  VerifierCredentialRequestPayload,
  VerifierPresentationRequestPayload,
} from '../types/verifier';

export const mapCredentialPayload = (
  payload: IssueCredentialRequestPayload,
  configuration: IssuerConfiguration
): ICreateVerifiableCredentialArgs => {
  const options = payload.options || {};

  return {
    credential: payload.credential,
    ...configuration,
    ...options,
  };
};

export const mapVerifiableCredentialPayload = (
  payload: VerifierCredentialRequestPayload
): IVerifyCredentialArgs => {
  const options = payload.options || {};

  return {
    credential: payload.verifiableCredential,
    ...options,
  };
};

export const mapVerifiablePresentationPayload = (
  payload: VerifierPresentationRequestPayload
): IVerifyPresentationArgs => {
  const options = payload.options || {};

  return {
    presentation: payload.verifiablePresentation,
    ...options,
  };
};
