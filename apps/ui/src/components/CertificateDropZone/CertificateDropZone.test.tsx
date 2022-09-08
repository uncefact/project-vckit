import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { CertificateDropZoneContainer } from "./CertificateDropZoneContainer";
import { CertificateDropZone } from "./CertificateDropZone";
import { Provider } from "react-redux";
import { configureStore } from "../../store";
jest.mock("qr-scanner");

const store = configureStore();

const renderWithStore = (additionalProps: any) => {
  return render(
    <Provider store={store}>
      <CertificateDropZoneContainer {...additionalProps}>
        <CertificateDropZone />
      </CertificateDropZoneContainer>
    </Provider>
  );
};
describe("CertificateDropZone", () => {
  it("shows QrReader when qrReaderVisible is true", () => {
    renderWithStore({
      updateNetworkId: () => {},
    });
    fireEvent.click(screen.getByText("Scan QR Code"));
    expect(screen.getByTestId("qr-code-reader")).not.toBeNull();
  });

  it("shows CertificateDropZone when qrReaderVisible is false", () => {
    renderWithStore({
      updateNetworkId: () => {},
    });
    expect(screen.getByTestId("certificate-dropzone")).not.toBeNull();
  });
});
