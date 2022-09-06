import { RevokingJob } from "../../../../types";
import { utils } from "@govtechsg/open-attestation";

export const getRevokingJobs = async (documents: any[]): Promise<RevokingJob[]> => {
  return Promise.all(
    documents.map(async (document) => ({
      contractAddress: getRevokeAddress(document),
      targetHash: utils.getTargetHash(document),
      documents,
    }))
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getRevokeAddress = (document: any) => {
  // for dns-did document with revocation store
  let revokeAddress = "";
  if (utils.isWrappedV2Document(document)) {
    const unwrappedDocument = utils.getData(document);
    const issuer = unwrappedDocument.issuers[0];
    revokeAddress = issuer.revocation?.location || "";
  } else if (utils.isWrappedV3Document(document)) {
    revokeAddress = document.openAttestationMetadata.proof.revocation?.location || "";
  }
  // for dns-txt document with document store
  if (!revokeAddress) {
    revokeAddress = utils.getIssuerAddress(document)[0];
  }

  return revokeAddress;
};
