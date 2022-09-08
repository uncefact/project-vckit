jest.mock("../../../../common/hooks/useQueue/utils/publish");
jest.mock("../../../../common/contexts/config");
jest.mock("../../WatermarkPreview");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CustomWatermarkPreviewWidget } from "./CustomWatermarkPreviewWidget";
import { WatermarkPreview } from "../../WatermarkPreview";
import { useConfigContext } from "../../../../common/contexts/config";
import { getReservedStorageUrl } from "../../../../common/hooks/useQueue/utils/publish";

const mockuseConfigContext = useConfigContext as jest.Mock;

mockuseConfigContext.mockReturnValue({
  config: { network: "testnetwork", documentStorage: { url: "http://localhost:5010/dev" } },
});

const mockWatermarkPreview = WatermarkPreview as jest.Mock;
const mockGetReservedStorageUrl = getReservedStorageUrl as jest.Mock;

const propsToPassIntoWidget = (): any => {
  return {
    onChange: jest.fn(),
    options: {
      text: "Upload document attachment",
      accept: ".pdf",
    },
  };
};

describe("CustomWatermarkPreviewWidget", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReservedStorageUrl.mockClear();
  });

  it("should pass qrUrl to child component", async () => {
    const mockFile = new File(["(⌐□_□)"], "mockFile.pdf", { type: "application/pdf" });
    mockGetReservedStorageUrl.mockReturnValueOnce("testQrURL");
    mockWatermarkPreview.mockReturnValueOnce(<></>);

    render(<CustomWatermarkPreviewWidget {...propsToPassIntoWidget()} />);

    const fileWidget = screen.getByTestId("custom-watermark-preview-widget") as HTMLInputElement;
    userEvent.upload(fileWidget, mockFile);

    await waitFor(() => {
      expect(mockGetReservedStorageUrl).toBeCalledTimes(1);
      expect(mockWatermarkPreview.mock.calls[0][0].qrURL).toBe("testQrURL");
    });
  });

  it("should display file name after upload", async () => {
    const mockFile = new File(["(⌐□_□)"], "mockFile.pdf", { type: "application/pdf" });
    render(<CustomWatermarkPreviewWidget {...propsToPassIntoWidget()} />);
    const fileWidget = screen.getByTestId("custom-watermark-preview-widget") as HTMLInputElement;
    userEvent.upload(fileWidget, mockFile);
    expect(fileWidget.files?.[0].name).toBe("mockFile.pdf");
    expect(fileWidget.files?.length).toBe(1);
  });
});
