import { OpenAttestationDocument, utils } from "@govtechsg/open-attestation";
import { Signer, Wallet } from "ethers";
import { getNetworkDetails } from "../../common/utils/utils";
import { ConnectedSigner, Network } from "../../types";
import { getConnectedDocumentStore, checkAddressIsSmartContract } from "../common";
import { checkCreationAddress } from "./utils";

export const checkVerifiableDocumentOwnership = async (
  contractAddress: string,
  account: Wallet | ConnectedSigner
): Promise<boolean> => {
  if (!(await checkAddressIsSmartContract(contractAddress, account))) {
    return false;
  }
  const documentStore = await getConnectedDocumentStore(account, contractAddress);
  return (await documentStore.owner()) === (await account.getAddress());
};

export const checkTransferableRecordOwnership = async (contractAddress: string, signer: Signer): Promise<boolean> => {
  const userWalletAddress = await signer.getAddress();
  const network = await signer.provider?.getNetwork();
  if (network === undefined) {
    throw new Error("Wallet owner's Network not found.");
  } else {
    const networkDetails = getNetworkDetails(network.name as Network);
    return await checkCreationAddress({
      contractAddress: contractAddress,
      network: networkDetails,
      userAddress: userWalletAddress,
      strict: false,
    });
  }
};

export const checkContractOwnership = async (
  type: string,
  contractAddress: string,
  wallet: Wallet | ConnectedSigner
): Promise<boolean> => {
  if (type === "VERIFIABLE_DOCUMENT") return checkVerifiableDocumentOwnership(contractAddress, wallet);
  if (type === "TRANSFERABLE_RECORD") return checkTransferableRecordOwnership(contractAddress, wallet);
  throw new Error("Job type is not supported");
};

export const checkDID = (rawDocument: OpenAttestationDocument): boolean => {
  if (utils.isRawV2Document(rawDocument)) {
    const { issuers } = rawDocument;
    const isDID = issuers[0].id?.includes("did:ethr:");
    return isDID === undefined ? false : isDID;
  } else if (utils.isRawV3Document(rawDocument)) {
    return rawDocument.openAttestationMetadata.proof.value.includes("did:ethr:");
  }
  throw new Error(
    "Unsupported document type: Only can retrieve issuer address from OpenAttestation v2 & v3 documents."
  );
};
