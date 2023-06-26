import { ProofFormat } from '@vckit/core-types';

export type IssuerConfiguration = {
  proofFormat: ProofFormat;
  removeOriginalFields: boolean;
  save: boolean
};

export const configuration: IssuerConfiguration = {
  proofFormat: 'OpenAttestationMerkleProofSignature2018', // The proof format required by the schema. Default to OpenAttestationMerkleProofSignature2018.

  removeOriginalFields: false, // Remove payload members during JWT-JSON transformation. Defaults to `true`.

  save: true, // If this parameter is true, the resulting VerifiableCredential is sent to the storage plugin to be saved.
};
