import React from "react";
import { render } from "@testing-library/react";
import { DocumentStatus, IssuedBy } from "./DocumentStatus";
import {
  whenDocumentHashInvalid,
  whenDocumentNotIssued,
  whenDocumentIssuerIdentityInvalidDnsTxt,
  whenDocumentHashInvalidAndNotIssued,
  whenDocumentIssuerIdentityInvalidDid,
} from "../../test/fixture/verifier-responses";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";
import { Provider } from "react-redux";
import { configureStore } from "../../store";
import { v2, wrapDocument } from "@govtechsg/open-attestation";

const { MESSAGES } = CONSTANTS;

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

describe("IssuedBy", () => {
  const renderWithStore = (additionalProps: any) => {
    const store = configureStore({ certificate: { rawModified: document, verificationStatus: additionalProps } });
    return render(
      <Provider store={store}>
        <IssuedBy verificationStatus={additionalProps} document={document} />
      </Provider>
    );
  };
  it("should return appropriate display text when single dns is verified", () => {
    const fragments = [
      {
        name: "OpenAttestationDnsTxtIdentityProof",
        type: "ISSUER_IDENTITY",
        status: "VALID",
        data: [
          {
            status: "VALID",
            location: "abc.com",
          },
        ],
      },
    ];
    const container = renderWithStore(fragments);
    expect(container.queryByText("ABC.COM")).not.toBeNull();
  });

  it("should return appropriate display text when multiple dns is verified", () => {
    const fragments = [
      {
        name: "OpenAttestationDnsTxtIdentityProof",
        type: "ISSUER_IDENTITY",
        status: "VALID",
        data: [
          {
            status: "VALID",
            location: "abc.com",
          },
          {
            status: "VALID",
            location: "xyz.com",
          },
          {
            status: "VALID",
            location: "demo.com",
          },
        ],
      },
    ];
    const container = renderWithStore(fragments);
    expect(container.queryByText("ABC.COM, XYZ.COM and DEMO.COM")).not.toBeNull();
  });

  it("should return domain if is verified with DNS-DID", () => {
    const fragments = [
      {
        name: "OpenAttestationDnsDidIdentityProof",
        type: "ISSUER_IDENTITY",
        status: "VALID",
        data: [
          {
            status: "VALID",
            location: "abc.com",
          },
        ],
      },
    ];
    const container = renderWithStore(fragments);
    expect(container.queryByText("ABC.COM")).not.toBeNull();
  });

  it("should return did if is verified with DID", () => {
    const sampleDidIdentity = "did:ethr:0xE712878f6E8d5d4F9e87E10DA604F9cB564C9a89";
    const fragments = [
      {
        name: "OpenAttestationDidIdentityProof",
        type: "ISSUER_IDENTITY",
        status: "VALID",
        data: [
          {
            status: "VALID",
            did: sampleDidIdentity,
          },
        ],
      },
    ];
    const container = renderWithStore(fragments);
    expect(container.queryByText(sampleDidIdentity.toUpperCase())).not.toBeNull();
  });
});

describe("DocumentStatus", () => {
  const renderWithStore = (verificationStatus: any) => {
    const store = configureStore({ certificate: { rawModified: document, verificationStatus: verificationStatus } });
    return render(
      <Provider store={store}>
        <DocumentStatus />
      </Provider>
    );
  };
  it("should display hash error if the hash is invalid", () => {
    const container = renderWithStore(whenDocumentHashInvalid);
    expect(container.queryByText(MESSAGES["HASH"]["failureTitle"])).not.toBeNull();
    expect(container.queryByText(MESSAGES["ISSUED"]["failureTitle"])).toBeNull();
    expect(container.queryByText(MESSAGES["IDENTITY"]["failureTitle"])).toBeNull();
  });

  it("displays issuing error if the document is not issued", () => {
    const container = renderWithStore(whenDocumentNotIssued);
    expect(container.queryByText(MESSAGES["HASH"]["failureTitle"])).toBeNull();
    expect(container.queryByText(MESSAGES["ISSUED"]["failureTitle"])).not.toBeNull();
    expect(container.queryByText(MESSAGES["IDENTITY"]["failureTitle"])).toBeNull();
  });

  it("displays identity error if the dns txt identity is not verified", () => {
    const container = renderWithStore(whenDocumentIssuerIdentityInvalidDnsTxt);
    expect(container.queryByText(MESSAGES["HASH"]["failureTitle"])).toBeNull();
    expect(container.queryByText(MESSAGES["ISSUED"]["failureTitle"])).toBeNull();
    expect(container.queryByText(MESSAGES["IDENTITY"]["failureTitle"])).not.toBeNull();
  });

  it("displays identity error if the did identity is not verified", () => {
    const container = renderWithStore(whenDocumentIssuerIdentityInvalidDid);
    expect(container.queryByText(MESSAGES["HASH"]["failureTitle"])).toBeNull();
    expect(container.queryByText(MESSAGES["ISSUED"]["failureTitle"])).toBeNull();
    expect(container.queryByText(MESSAGES["IDENTITY"]["failureTitle"])).not.toBeNull();
  });

  it("displays error in all fields when all verification fail", () => {
    const container = renderWithStore(whenDocumentHashInvalidAndNotIssued);
    expect(container.queryByText(MESSAGES["HASH"]["failureTitle"])).not.toBeNull();
    expect(container.queryByText(MESSAGES["ISSUED"]["failureTitle"])).not.toBeNull();
    expect(container.queryByText(MESSAGES["IDENTITY"]["failureTitle"])).not.toBeNull();
  });
});
