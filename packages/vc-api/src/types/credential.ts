import { CredentialSubject, DateType, IssuerType } from '@vckit/core-types';

export interface CredentialPayload {
  // The ID of the credential.
  id: string; 

  // The JSON-LD context of the credential.
  '@context': string[];

  //The JSON-LD type of the credential.
  type: string[];

   // A JSON-LD Verifiable Credential Issuer
  issuer: IssuerType;

  // A JSON-LD Verifiable Credential Issuer.
  credentialSubject?: CredentialSubject;

  issuanceDate?: DateType;
  expirationDate?: DateType;
}
