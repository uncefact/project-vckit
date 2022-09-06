import { getDocumentStoreRecords, getDnsDidRecords } from "@govtechsg/dnsprove";
import { IdentityProofType } from "../../constants";
import { FormTemplate } from "../../types";
import { getIdentityProofType, getIssuerAddress, getIssuerLocation } from "../../utils";

interface ValidateDnsTxtRecords {
  identityProofType: string;
  issuerLocation: string;
  issuerAddress: string;
}

export const validateDnsTxtRecords = async ({
  identityProofType,
  issuerLocation,
  issuerAddress,
}: ValidateDnsTxtRecords): Promise<boolean> => {
  if (identityProofType === IdentityProofType.DNSDid) {
    const txtRecords = await getDnsDidRecords(issuerLocation);
    return txtRecords.some((record) => record.publicKey.toLowerCase().includes(issuerAddress.toLowerCase()));
  } else if (identityProofType === IdentityProofType.DNSTxt) {
    const txtRecords = await getDocumentStoreRecords(issuerLocation);
    return txtRecords.some((record) => record.addr.toLowerCase() === issuerAddress.toLowerCase());
  }
  return false;
};

export const validateDns = async (form: FormTemplate): Promise<boolean> => {
  const formData = form.defaults;
  const issuerLocation = getIssuerLocation(formData);
  const identityProofType = getIdentityProofType(formData);
  const issuerAddress = getIssuerAddress(formData);
  if (identityProofType === undefined || issuerLocation === undefined || issuerAddress === undefined) {
    console.error("identityProofType, issuerLocation or issuerAddress is missing");
    return false;
  }
  return await validateDnsTxtRecords({ identityProofType, issuerLocation, issuerAddress });
};
