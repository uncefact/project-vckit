import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { screen, render } from "@testing-library/react";
import { View } from "./View";
import { Provider } from "react-redux";
import { configureStore } from "../../../store";

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

describe("View", () => {
  it("displays text correctly", () => {
    render(
      <RenderWithStore>
        <View />
      </RenderWithStore>
    );

    expect(screen.getByText("Drop your Verifiable Credential file to view its contents")).toBeInTheDocument();
  });
});
