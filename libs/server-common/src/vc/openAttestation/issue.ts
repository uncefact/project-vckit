import {
  IssuerFunction,
  OAVerifiableCredential,
  VerifiableCredential,
} from '@dvp/api-interfaces';
import {
  signDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  __unsafe__use__it__at__your__own__risks__wrapDocument as wrapDocumentV3,
} from '@govtechsg/open-attestation';

export const issueCredential: IssuerFunction = async (
  credential,
  verificationMethod,
  signingKey
): Promise<VerifiableCredential> => {
  const wrappedDocument = await wrapDocumentV3(
    credential as OAVerifiableCredential
  );

  const signedDocument = await signDocument(
    wrappedDocument,
    SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
    {
      public: verificationMethod, // this will become the verificationMethod in the signed document.
      private: signingKey,
    }
  );

  return signedDocument as VerifiableCredential;
};
