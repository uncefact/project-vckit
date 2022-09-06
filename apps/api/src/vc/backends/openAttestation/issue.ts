import {
  verifySignature,
  signDocument,
  SUPPORTED_SIGNING_ALGORITHM,
  __unsafe__use__it__at__your__own__risks__wrapDocument as wrapDocumentV3,
} from "@govtechsg/open-attestation";
import { ApiLogNamespace, logger } from "../../../common/utils/logger";

const LOG_NAME = ApiLogNamespace.VCApi;
const OASign = async (
  wrappedDocument: any,
  issuerKeyId: string,
  signingKey: string
) => {
  try {
    const signedDocument = await signDocument(
      wrappedDocument,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      {
        public: issuerKeyId, // this will become the verificationMethod in the singed document. Could also be a standard ether id (a PKH)
        private: signingKey,
      }
    );
    if (!verifySignature(signedDocument)) {
      throw new Error("Signing failed: not validated immediately after.");
    }
    if (signedDocument == null || signedDocument == {}) {
      throw new Error("Issuing not completed successfully for unkown reasons");
    }

    return signedDocument;
  } catch (e: any) {
    logger.error(LOG_NAME, `signDocument failed!: ${e.message}`);
    throw e;
  }
};

export const issue = async (
  credential: any,
  signingKeyId: string,
  signingKey: string
) => {
  const wrappedDocument = await wrapDocumentV3(credential);
  return OASign(wrappedDocument, signingKeyId, signingKey);
};
