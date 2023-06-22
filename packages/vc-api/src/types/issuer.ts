import { VerifiableCredential } from '@vckit/core-types';
import { CredentialPayload } from './credential';

export type IssueCredentialRequestPayload = {
  credential: CredentialPayload; // A JSON-LD Verifiable Credential without a proof.
  options?: IssueCredentialOptions; // Options for specifying how the LinkedDataProof is created.
};

export type IssueCredentialOptions = {
  created?: string; // The date and time of the proof. Default current system time.
  credentialStatus?: { type: string }; // The method of credential status to issue the credential including. If omitted credential status will be included.
  challenge?: string; // A challenge provided by the requesting party of the proof. For example 6e62f66e-67de-11eb-b490-ef3eeefa55f2
  domain?: string; // The intended domain of validity for the proof. For example website.example
};

export type IssueCredentialResponsePayload = {
  verifiableCredential: VerifiableCredential;
};

export type UpdateCredentialStatusRequestPayload = {
  credentialId: string;
  credentialStatus: [
    {
      type: string;
      status: string;
    }
  ];
};
