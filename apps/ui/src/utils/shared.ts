import { getData, utils, v2, v3, OpenAttestationDocument, WrappedDocument } from "@govtechsg/open-attestation";
import { ChainId } from "../constants/chain-info";
import { IS_DEVELOPMENT } from "../config";
import { MAIN_NETWORKS, TEST_NETWORKS } from "../config/chain-config";

export type WrappedOrSignedOpenAttestationDocument = WrappedDocument<OpenAttestationDocument>;
// note that the return type for getting attachments will normalise the structure into v2.Attachment
export type OpenAttestationAttachment = v2.Attachment;

export const getOpenAttestationData = (
  wrappedDocument: WrappedDocument<OpenAttestationDocument>
): OpenAttestationDocument => utils.getDocumentData(wrappedDocument);

export const getTemplateUrl = (rawDocument: WrappedOrSignedOpenAttestationDocument): string | undefined => {
  if (utils.isWrappedV2Document(rawDocument)) {
    const documentData = getData(rawDocument);
    return typeof documentData.$template === "object" ? documentData.$template.url : undefined;
  } else {
    return rawDocument.openAttestationMetadata.template?.url;
  }
};

export const getAttachments = (rawDocument: WrappedOrSignedOpenAttestationDocument): v2.Attachment[] | undefined => {
  if (utils.isWrappedV2Document(rawDocument)) {
    const documentData = getData(rawDocument);
    return documentData.attachments;
  } else {
    return rawDocument.attachments?.map((attachment: v3.Attachment) => {
      return {
        data: attachment.data,
        filename: attachment.fileName,
        type: attachment.mimeType,
      };
    });
  }
};

export const getTokenRegistryAddress = (document: WrappedOrSignedOpenAttestationDocument): string | undefined => {
  const issuerAddress = utils.getIssuerAddress(document);
  return issuerAddress instanceof Array ? issuerAddress[0] : issuerAddress;
};

export const getChainId = (rawDocument: WrappedOrSignedOpenAttestationDocument): ChainId | undefined => {
  const warn = () =>
    console.warn(
      "You are using an older version of Open-Attestation Document, to use the auto network feature, please use an updated version. Otherwise, please make sure that you select the correct network."
    );

  const throwError = () => {
    throw new Error("Invalid Document, please use a valid document.");
  };

  const networks = IS_DEVELOPMENT ? [...TEST_NETWORKS] : [...MAIN_NETWORKS];

  const processChainId = (document: OpenAttestationDocument): number | undefined => {
    if (document.network) {
      // Check for current bc, "ETH", and chainId, if need cater for other bc and network, update this accordingly. (V2)
      if (document.network.chain === "ETH" && document.network.chainId) {
        const chainIdNumber = parseInt(document.network.chainId);
        const isChainIdInListedNetwork = networks.includes(chainIdNumber);
        if (!chainIdNumber || !isChainIdInListedNetwork) throwError();
        return chainIdNumber;
      }
      throwError();
    }
    warn();
    return undefined;
  };

  if (utils.isWrappedV2Document(rawDocument)) {
    const documentData = getData(rawDocument);
    // Check for DID, ignore chainId when its DID
    const identityProofType = documentData.issuers[0].identityProof?.type;
    if (identityProofType === "DNS-DID" || identityProofType === "DID") return undefined;
    return processChainId(documentData);
  } else if (utils.isWrappedV3Document(rawDocument)) {
    // Check for DID, ignore chainId when its DID
    const identityProofType = rawDocument.openAttestationMetadata.identityProof.type;
    if (identityProofType === "DNS-DID" || identityProofType === "DID") return undefined;
    return processChainId(rawDocument);
  }
};
