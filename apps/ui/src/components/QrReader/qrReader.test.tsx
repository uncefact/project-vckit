import React from "react";
import { render } from "@testing-library/react";
import QrReaderZone from "./qrReader";

jest.mock("./Scanner", () => ({ useScanner: () => {} }));

describe("qrReaderZone", () => {
  it("renders video when component is mounted", () => {
    const container = render(<QrReaderZone handleQrScanned={() => {}} />);
    expect(container.queryByTestId("qr-code-reader")).not.toBeNull();
  });
});
