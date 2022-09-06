import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { screen, render, fireEvent } from "@testing-library/react";
import { ViewActionError } from "./ViewActionError";
import { Provider } from "react-redux";
import { configureStore } from "../../../store";
import { states } from "../../../reducers/certificate";
jest.mock("qr-scanner");

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

describe("ViewActionError", () => {
  it("displays texts correctly", () => {
    render(
      <RenderWithStore
        retrieveCertificateByActionState={states.FAILURE}
        retrieveCertificateByActionError={`Unable to decrypt certificate with key=undefined and type=OPEN-ATTESTATION-TYPE-1`}
      >
        <ViewActionError resetData={() => {}} />
      </RenderWithStore>
    );

    expect(screen.getByText("Unable to load certificate with the provided parameters")).toBeInTheDocument();
    expect(
      screen.getByText("Unable to decrypt certificate with key=undefined and type=OPEN-ATTESTATION-TYPE-1")
    ).toBeInTheDocument();
  });

  it("should reset document", () => {
    const resetData = jest.fn();

    render(
      <RenderWithStore
        retrieveCertificateByActionState={states.FAILURE}
        retrieveCertificateByActionError={`Unable to decrypt certificate with key=undefined and type=OPEN-ATTESTATION-TYPE-1`}
      >
        <ViewActionError resetData={resetData} />
      </RenderWithStore>
    );

    fireEvent.click(screen.getByText("Try another document"));
    expect(resetData).toBeCalledTimes(1);
  });
});
