import { ProofFormat } from '@uncefact/vckit-core-types';

export type IssuerConfiguration = {
  proofFormat: ProofFormat;
  removeOriginalFields: boolean;
  save: boolean;

  [x: string]: any;
};

export const configuration: IssuerConfiguration = {
  proofFormat: 'lds', // The proof format only supports 'lds' at the moment.

  removeOriginalFields: false, // Remove payload members during JWT-JSON transformation. Defaults to `true`.

  save: true, // If this parameter is true, the resulting VerifiableCredential is sent to the storage plugin to be saved.

  fetchRemoteContexts: true,
};
