import { VerificationFragment, VerificationFragmentWithData, utils } from "@govtechsg/oa-verify";
import React, { FunctionComponent } from "react";
import { NETWORK_NAME } from "../../config";
import { StatusChecks } from "./StatusChecks";
import { useSelector } from "react-redux";
import { utils as oaUtils, WrappedDocument, v3 } from "@govtechsg/open-attestation";
import { RootState } from "../../reducers";
import { WrappedOrSignedOpenAttestationDocument } from "../../utils/shared";

interface VerificationFragmentData {
  did: string;
  location: string;
  status: string;
}

const getV2FormattedDomainNames = (verificationStatus: VerificationFragment[]) => {
  const joinIssuers = (issuers: string[] | undefined): string => {
    if (!issuers) return "Unknown";
    const issuerNames = issuers.join(", ");
    return issuerNames?.replace(/,(?=[^,]*$)/, " and"); // regex to find last comma, replace with and
  };

  const formatIdentifier = (fragment: VerificationFragmentWithData<VerificationFragmentData[]>): string | undefined => {
    switch (fragment.name) {
      case "OpenAttestationDnsTxtIdentityProof":
      // using fall through to get both cases
      case "OpenAttestationDnsDidIdentityProof":
        return joinIssuers(fragment.data?.map((issuer) => issuer.location.toUpperCase()));
      case "OpenAttestationDidIdentityProof":
        return joinIssuers(fragment.data?.map((issuer) => issuer.did.toUpperCase()));
      default:
        return "Unknown";
    }
  };
  const identityProofFragment = utils
    .getIssuerIdentityFragments(verificationStatus)
    .find((fragment) => utils.isValidFragment(fragment)) as VerificationFragmentWithData;

  const dataFragment = identityProofFragment?.data;
  const fragmentValidity =
    dataFragment?.length > 0 &&
    dataFragment?.every(
      (issuer: { status: string; verified: boolean }) => issuer.status === "VALID" || issuer.verified === true
    ); // every will return true even though dataFragment is empty, hence the additional check for length

  return fragmentValidity ? formatIdentifier(identityProofFragment) : "Unknown";
};

export const getV3IdentityVerificationText = (document: WrappedDocument<v3.OpenAttestationDocument>): string => {
  return document.openAttestationMetadata.identityProof.identifier.toUpperCase();
};

interface IssuedByProps {
  title?: string;
  verificationStatus: VerificationFragment[];
  document: WrappedOrSignedOpenAttestationDocument;
}

export const IssuedBy: FunctionComponent<IssuedByProps> = ({ title = "Issued by", verificationStatus, document }) => {
  const formattedDomainNames = oaUtils.isWrappedV2Document(document)
    ? getV2FormattedDomainNames(verificationStatus)
    : getV3IdentityVerificationText(document);
  return (
    <h2 id="issuedby" className="break-words leading-tight">
      <span className="mr-2 inline-block break-all">{title}</span>
      <span className="text-cerulean inline-block">{formattedDomainNames}</span>
    </h2>
  );
};

interface DocumentStatusProps {
  isMagicDemo?: boolean;
}

export const DocumentStatus: FunctionComponent<DocumentStatusProps> = ({ isMagicDemo }) => {
  const rootState = useSelector((state: RootState) => state);
  const document = isMagicDemo ? rootState.demoVerify.rawModifiedDocument : rootState.certificate.rawModified;
  const verificationStatus = isMagicDemo
    ? rootState.demoVerify.verificationStatus
    : rootState.certificate.verificationStatus;

  if (!document || !verificationStatus) return null;

  return (
    <div className="container">
      <div id="document-status" className="py-4">
        <div className="flex flex-col">
          <div className="flex-grow">
            {NETWORK_NAME !== "local" && (
              <IssuedBy
                title={isMagicDemo ? "Demo issued by" : "Issued by"}
                verificationStatus={verificationStatus}
                document={document}
              />
            )}
          </div>
          <StatusChecks verificationStatus={verificationStatus} />
        </div>
      </div>
    </div>
  );
};
