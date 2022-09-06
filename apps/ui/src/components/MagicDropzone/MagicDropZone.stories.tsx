import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import { v2, wrapDocument } from "@govtechsg/open-attestation";
import { MagicDropzone } from "./MagicDropzone";
import { configureStore } from "../../store";
import {
  whenDocumentHashInvalidAndNotIssued,
  whenDocumentHashInvalid,
  whenDocumentNotIssued,
  whenDocumentIssuerIdentityInvalidDnsTxt,
  whenDocumentRevoked,
} from "../../test/fixture/verifier-responses";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";

const { TYPES } = CONSTANTS;

const sampleDocument = wrapDocument({
  issuers: [
    {
      name: "John Doe",
      documentStore: "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd",
      identityProof: {
        type: v2.IdentityProofType.DNSTxt,
        location: "helloworld.com",
      },
    },
  ],
  name: "foobar",
});

const RenderWithStore = ({ children, ...props }: any) => {
  const { document, fragments, isPending, error } = props;
  const store = configureStore({
    demoVerify: {
      rawModifiedDocument: document,
      verificationStatus: fragments,
      verificationPending: isPending,
      verificationError: error,
    },
  });
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  );
};

export default {
  title: "Dropzone/MagicDropzone",
  component: MagicDropzone,
  parameters: {
    componentSubtitle: "All various scenarios with document verification.",
  },
};

export const MagicDemo = () => {
  return (
    <RenderWithStore document={sampleDocument} fragments={null}>
      <MagicDropzone />
    </RenderWithStore>
  );
};

export const MagicDemoVerifying = () => {
  return (
    <RenderWithStore document={sampleDocument} fragments={null} isPending={true}>
      <MagicDropzone />
    </RenderWithStore>
  );
};

export const MagicDemoVerificationErrorsAll = () => {
  return (
    <RenderWithStore
      document={sampleDocument}
      fragments={whenDocumentHashInvalidAndNotIssued}
      error={[TYPES.HASH, TYPES.ISSUED, TYPES.IDENTITY]}
    >
      <MagicDropzone />
    </RenderWithStore>
  );
};

export const MagicDemoVerificationErrorHash = () => {
  return (
    <RenderWithStore document={sampleDocument} fragments={whenDocumentHashInvalid} error={[TYPES.HASH]}>
      <MagicDropzone />
    </RenderWithStore>
  );
};

export const MagicDemoVerificationErrorIssue = () => {
  return (
    <RenderWithStore document={sampleDocument} fragments={whenDocumentNotIssued} error={[TYPES.ISSUED]}>
      <MagicDropzone />
    </RenderWithStore>
  );
};

export const MagicDemoVerificationErrorIdentity = () => {
  return (
    <RenderWithStore
      document={sampleDocument}
      fragments={whenDocumentIssuerIdentityInvalidDnsTxt}
      error={[TYPES.IDENTITY]}
    >
      <MagicDropzone />
    </RenderWithStore>
  );
};

export const MagicDemoVerificationErrorRevoked = () => {
  return (
    <RenderWithStore document={sampleDocument} fragments={whenDocumentRevoked} error={[TYPES.REVOKED]}>
      <MagicDropzone />
    </RenderWithStore>
  );
};
