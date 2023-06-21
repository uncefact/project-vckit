import {
  ICreateVerifiableCredentialArgs,
  VerifiableCredential,
} from '@vckit/core-types';
import { IssuerConfiguration } from '../config';
import {
  IssueCredentialRequestPayload,
  IssueCredentialResponsePayload,
} from '../types';

export const mapCredentialPayload = (
  payload: IssueCredentialRequestPayload,
  configuration: IssuerConfiguration
): ICreateVerifiableCredentialArgs => {
  const options = payload.options || {};

  return {
    credential: payload.credential,
    ...configuration,
    ...options
  };
};

export const mapCredentialResponse = (
  verifiableCredential: VerifiableCredential
): IssueCredentialResponsePayload => {
  return {
    verifiableCredential,
  };
};
