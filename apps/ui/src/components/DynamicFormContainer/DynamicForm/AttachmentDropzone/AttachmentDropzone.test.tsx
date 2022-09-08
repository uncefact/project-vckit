import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { AttachmentDropzone, fileInfo } from "./AttachmentDropzone";

const mockData = (files: File[]): any => {
  return {
    dataTransfer: {
      files,
      items: files.map((file: any) => ({
        kind: "file",
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
};

describe("attachmentDropzone", () => {
  let atobSpy: jest.SpyInstance;
  /* eslint-disable jest/no-hooks */
  beforeEach(() => {
    atobSpy = jest.spyOn(window, "atob");
  });

  afterEach(() => {
    atobSpy.mockRestore();
  });

  it("should render with the props", () => {
    render(
      <AttachmentDropzone
        acceptedFormat=".pdf, .json"
        onUpload={() => {}}
        onRemove={() => {}}
        uploadedFiles={[
          {
            filename: "asdfdfs.pdf",
            data: "asdfasdf",
            type: "application/pdf",
          },
        ]}
      />
    );

    expect(screen.getByText("Drag and drop your file(s) here")).not.toBeNull();
    expect(screen.getByText("or")).not.toBeNull();
    expect(screen.getByText("Browse File")).not.toBeNull();
  });
  it("should fire onUpload when a file is successfully read", async () => {
    const mockOnUploadFn = jest.fn();
    render(
      <AttachmentDropzone
        acceptedFormat=".pdf, .json"
        onUpload={mockOnUploadFn}
        onRemove={() => {}}
        uploadedFiles={[]}
      />
    );

    const dropzone = screen.getByTestId("attachment-file-dropzone");
    const file = new File([JSON.stringify({ foo: "bar" })], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(mockOnUploadFn).toHaveBeenCalledTimes(1));
    });
  });

  it("should show error when a file cannot be read", async () => {
    render(<AttachmentDropzone acceptedFormat=".pdf" onUpload={() => {}} onRemove={() => {}} uploadedFiles={[]} />);

    const dropzone = screen.getByTestId("attachment-file-dropzone");
    const file = new File(["RANDOM_BINARY_FILE"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(screen.getByTestId("invalid-file-error")).not.toBeUndefined());
    });
  });

  it("should show error when the total file size is over 5MB", async () => {
    atobSpy.mockImplementation(() => ({ length: 123000000 }));

    render(
      <AttachmentDropzone
        acceptedFormat=".pdf, .json"
        onUpload={() => {}}
        onRemove={() => {}}
        uploadedFiles={[
          {
            filename: "asdfdfs.pdf",
            data: "asdfasdfasdf",
            type: "application/pdf",
          },
        ]}
      />
    );

    const dropzone = screen.getByTestId("attachment-file-dropzone");
    const file = new File(["sample"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(screen.getByTestId("file-error")).not.toBeUndefined());
    });
  });
});

describe("fileInfo", () => {
  it("should work for all types of files", () => {
    expect(fileInfo("data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKM")).toStrictEqual({
      type: "application/pdf",
      data: "JVBERi0xLjQKJdPr6eEKM",
    });
    expect(fileInfo("data:application/zip;base64,UEsDBBQAAgAIAKB47VBTBq")).toStrictEqual({
      type: "application/zip",
      data: "UEsDBBQAAgAIAKB47VBTBq",
    });
    expect(fileInfo("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAADawA")).toStrictEqual({
      type: "image/png",
      data: "iVBORw0KGgoAAAANSUhEUgAADawA",
    });
    expect(fileInfo("data:application/octet-stream;base64,ewogICJzY2hlb")).toStrictEqual({
      type: "application/octet-stream",
      data: "ewogICJzY2hlb",
    });
  });
  it("should throw for malformed file data", () => {
    expect(() => fileInfo("data:application/octet-stream:base64:ewogICJzY2hlb")).toThrow(/File data cannot be read/);
  });
});
