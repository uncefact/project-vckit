import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import { CertificateDropZoneContainer } from "./CertificateDropZoneContainer";
import { Provider } from "react-redux";
import { configureStore } from "../../store";
jest.mock("qr-scanner");

const store = configureStore();

const renderWithStore = (additionalProps: any) => {
  return render(
    <Provider store={store}>
      <CertificateDropZoneContainer {...additionalProps} />
    </Provider>
  );
};

describe("certificateDropZoneContainer", () => {
  it("toggles qrReaderVisible when toggleQrReaderVisible is called", () => {
    const { getByTestId } = renderWithStore({ updateNetworkId: () => {} });
    fireEvent.click(screen.getByText("Scan QR Code"));
    expect(getByTestId("qr-code-reader")).toBeInTheDocument();
  });
});
