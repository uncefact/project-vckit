/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
import { createFileTransferEvent } from "../../../utils/utils";

describe("configFileDropZone", () => {
  it("should have the right text", () => {
    render(<ConfigFileDropZone onConfigFile={() => {}} />);
    expect(screen.queryByText(/Create and Revoke Document/)).not.toBeNull();
    expect(screen.queryByText(/Drag and drop your configuration file here/)).not.toBeNull();
  });

  it("should allow onConfigFile to be called with dropped JSON file", async () => {
    const onConfigFile = jest.fn();
    render(<ConfigFileDropZone onConfigFile={onConfigFile} />);

    const configContent = { foo: "bar" };
    const file = new File([JSON.stringify(configContent)], "ping.json", { type: "text/plain" });
    const data = createFileTransferEvent([file]);

    await act(async () => {
      const event = new Event("drop", { bubbles: true });
      Object.assign(event, data);
      fireEvent(screen.getByTestId("config-file-dropzone"), event);
      await waitFor(() => expect(onConfigFile).toHaveBeenCalledWith(configContent));
    });
  });
});
