import React from "react";
import { render, screen } from "@testing-library/react";
import { DetailedErrors } from "./DetailedErrors";
import { CONSTANTS } from "@govtechsg/tradetrust-utils";
import { VerificationFragment } from "@govtechsg/oa-verify";
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
} from "../../../test/fixture/verifier-responses";

const { TYPES, MESSAGES } = CONSTANTS;

describe("DetailedErrors", () => {
  it("should display all verification error messages", () => {
    render(
      <DetailedErrors
        verificationStatus={whenDocumentHashInvalidAndNotIssued as VerificationFragment[]}
        verificationError={null}
      />
    );
    expect(screen.getByText(MESSAGES[TYPES.ISSUED].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.ISSUED].failureMessage)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.HASH].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.HASH].failureMessage)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.IDENTITY].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.IDENTITY].failureMessage)).toBeInTheDocument();
  });

  it("should display only verification error message on fragment 'hash' when verification error is HASH", () => {
    render(
      <DetailedErrors verificationStatus={whenDocumentHashInvalid as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.HASH].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.HASH].failureMessage)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureMessage)).not.toBeInTheDocument();
  });

  it("should display only verification error message on fragment 'issue' when verification error is issued", () => {
    render(
      <DetailedErrors verificationStatus={whenDocumentNotIssued as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.getByText(MESSAGES[TYPES.ISSUED].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.ISSUED].failureMessage)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureMessage)).not.toBeInTheDocument();
  });

  it("should display only verification error message on fragment 'identity' when verification error is IDENTITY", () => {
    render(
      <DetailedErrors
        verificationStatus={whenDocumentIssuerIdentityInvalidDnsTxt as VerificationFragment[]}
        verificationError={null}
      />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.IDENTITY].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.IDENTITY].failureMessage)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureMessage)).not.toBeInTheDocument();
  });

  it("should display only verification error message on fragment 'issue' when verification error is REVOKED", () => {
    render(
      <DetailedErrors verificationStatus={whenDocumentRevoked as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.getByText(MESSAGES[TYPES.REVOKED].failureTitle)).toBeInTheDocument();
    expect(screen.getByText(MESSAGES[TYPES.REVOKED].failureMessage)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureMessage)).not.toBeInTheDocument();
  });

  it("should display only verification error message 'invalid' when verification error is INVALID", () => {
    render(
      <DetailedErrors verificationStatus={whenDocumentInvalid as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID].failureMessage)).toBeInTheDocument();
  });

  it("should display only verification error message 'server error' when verification error is SERVER_ERROR", () => {
    render(<DetailedErrors verificationStatus={whenServerError as VerificationFragment[]} verificationError={null} />);
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.SERVER_ERROR].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.SERVER_ERROR].failureMessage)).toBeInTheDocument();
  });

  it("should display only verification error message 'invalid address' when verification error is ADDRESS_INVALID", () => {
    render(
      <DetailedErrors
        verificationStatus={whenDocumentAddressInvalid as VerificationFragment[]}
        verificationError={null}
      />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ADDRESS_INVALID].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ADDRESS_INVALID].failureMessage)).toBeInTheDocument();
  });

  it("should display only verification error message 'contract not found' when verification error is CONTRACT_NOT_FOUND", () => {
    render(
      <DetailedErrors verificationStatus={whenDocumentNotFound as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.CONTRACT_NOT_FOUND].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.CONTRACT_NOT_FOUND].failureMessage)).toBeInTheDocument();
  });

  it("should display verification error message 'invalid argument' when verification error is INVALID_ARGUMENT", () => {
    render(
      <DetailedErrors verificationStatus={whenInvalidCallArgument as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID_ARGUMENT].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.INVALID_ARGUMENT].failureMessage)).toBeInTheDocument();
  });

  it("should display only verification error message 'unhandled error' when verification error is ETHERS_UNHANDLED_ERROR", () => {
    render(
      <DetailedErrors verificationStatus={whenUnhandledError as VerificationFragment[]} verificationError={null} />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ETHERS_UNHANDLED_ERROR].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ETHERS_UNHANDLED_ERROR].failureMessage)).toBeInTheDocument();
  });

  it("should display only verification error message 'client network error' when verification error is CLIENT_NETWORK_ERROR", () => {
    render(
      <DetailedErrors
        verificationStatus={whenDocumentValidAndIssuedByDns as VerificationFragment[]}
        verificationError={TYPES.CLIENT_NETWORK_ERROR}
      />
    );
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.ISSUED].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.HASH].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureTitle)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.IDENTITY].failureMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.CLIENT_NETWORK_ERROR].failureTitle)).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES[TYPES.CLIENT_NETWORK_ERROR].failureMessage)).toBeInTheDocument();
  });
});
