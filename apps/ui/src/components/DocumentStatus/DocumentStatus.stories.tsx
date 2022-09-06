import React from "react";
import {
  whenDocumentValidAndIssuedByDns,
  whenDocumentHashInvalid,
  whenDocumentNotIssued,
  whenDocumentRevoked,
  whenDocumentIssuerIdentityInvalidDnsTxt,
  whenDocumentHashInvalidAndNotIssued,
  whenTransferableDocumentVerified,
} from "../../test/fixture/verifier-responses";
import { DocumentStatus } from "./DocumentStatus";
import { Provider } from "react-redux";
import { configureStore } from "../../store";
import { v2, wrapDocument } from "@govtechsg/open-attestation";

const document = wrapDocument({
  issuers: [
    {
      name: "John",
      documentStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
      identityProof: {
        type: v2.IdentityProofType.DNSTxt,
        location: "example.com",
      },
    },
  ],
  name: "bah bah black sheep",
  links: {
    self: {
      href: "https://openattestation.com",
    },
  },
});

const DocumentStatusWithStore = ({ verificationStatus }: any) => {
  const store = configureStore({ certificate: { rawModified: document, verificationStatus: verificationStatus } });
  return (
    <Provider store={store}>
      <DocumentStatus />
    </Provider>
  );
};

export default {
  title: "Viewer/DocumentStatus",
  component: DocumentStatusWithStore,
  parameters: {
    componentSubtitle: "All various statuses after document verification.",
  },
};

export const DocumentValid = () => {
  return <DocumentStatusWithStore verificationStatus={whenDocumentValidAndIssuedByDns} />;
};

export const DocumentValidTransferable = () => {
  return <DocumentStatusWithStore verificationStatus={whenTransferableDocumentVerified} />;
};

export const DocumentTampered = () => {
  return <DocumentStatusWithStore verificationStatus={whenDocumentHashInvalid} />;
};

export const DocumentNotIssued = () => {
  return <DocumentStatusWithStore verificationStatus={whenDocumentNotIssued} />;
};

export const DocumentRevoked = () => {
  return <DocumentStatusWithStore verificationStatus={whenDocumentRevoked} />;
};

export const DocumentIssuerIdentityInvalid = () => {
  return <DocumentStatusWithStore verificationStatus={whenDocumentIssuerIdentityInvalidDnsTxt} />;
};

export const DocumentAllVerificationFail = () => {
  return <DocumentStatusWithStore verificationStatus={whenDocumentHashInvalidAndNotIssued} />;
};
