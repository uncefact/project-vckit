import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { CertificateDropZone } from "./CertificateDropZone";
import { Provider } from "react-redux";
import { configureStore } from "../../store";
import { states } from "../../reducers/certificate";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";
import {
  whenDocumentHashInvalidAndNotIssued,
  whenDocumentHashInvalid,
  whenDocumentNotIssued,
  whenDocumentIssuerIdentityInvalidDnsTxt,
  whenDocumentRevoked,
  whenServerError,
  whenDocumentInvalid,
  whenDocumentAddressInvalid,
  whenDocumentNotFound,
  whenInvalidCallArgument,
  whenUnhandledError,
  whenDocumentValidAndIssuedByDns,
} from "../../test/fixture/verifier-responses";

const RenderWithStore = ({ children, ...props }: any) => {
  const {
    raw,
    rawModified,
    verificationStatus,
    verificationPending,
    verificationError,
    retrieveCertificateByActionState,
    retrieveCertificateByActionError,
  } = props;

  const store = configureStore({
    certificate: {
      raw,
      rawModified,
      verificationStatus,
      verificationPending,
      verificationError,
      retrieveCertificateByActionState,
      retrieveCertificateByActionError,
    },
  });
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  );
};

const { TYPES } = CONSTANTS;

export default {
  title: "Dropzone/CertificateDropZone",
  component: CertificateDropZone,
  parameters: {
    componentSubtitle: "All various scenarios with document verification.",
  },
};

export const Ready = () => (
  <RenderWithStore verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const Verifying = () => (
  <RenderWithStore verificationPending={true}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const AllVerificationErrors = () => (
  <RenderWithStore verificationStatus={whenDocumentHashInvalidAndNotIssued} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const InvalidHash = () => (
  <RenderWithStore verificationStatus={whenDocumentHashInvalid} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const NotIssued = () => (
  <RenderWithStore verificationStatus={whenDocumentNotIssued} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const IssuerIdentityInvalid = () => (
  <RenderWithStore verificationStatus={whenDocumentIssuerIdentityInvalidDnsTxt} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const Revoked = () => (
  <RenderWithStore verificationStatus={whenDocumentRevoked} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const ActionError = () => (
  <RenderWithStore
    retrieveCertificateByActionState={states.FAILURE}
    retrieveCertificateByActionError={`Unable to decrypt certificate with key=undefined and type=OPEN-ATTESTATION-TYPE-1`}
  >
    <CertificateDropZone />
  </RenderWithStore>
);

export const InvalidDocument = () => (
  <RenderWithStore verificationStatus={whenDocumentInvalid} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const AddressInvalidError = () => (
  <RenderWithStore verificationStatus={whenDocumentAddressInvalid} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const ContractNotFoundError = () => (
  <RenderWithStore verificationStatus={whenDocumentNotFound} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const InvalidArgumentError = () => (
  <RenderWithStore verificationStatus={whenInvalidCallArgument} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const ServerError = () => (
  <RenderWithStore verificationStatus={whenServerError} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const UnhandledError = () => (
  <RenderWithStore verificationStatus={whenUnhandledError} verificationError={null}>
    <CertificateDropZone />
  </RenderWithStore>
);

export const ClientNetworkError = () => (
  <RenderWithStore verificationStatus={whenDocumentValidAndIssuedByDns} verificationError={TYPES.CLIENT_NETWORK_ERROR}>
    <CertificateDropZone />
  </RenderWithStore>
);
