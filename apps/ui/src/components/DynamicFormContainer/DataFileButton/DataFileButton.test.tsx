import React from "react";
import { fireEvent, render, screen, act, waitFor } from "@testing-library/react";
import { DataFileButton } from "./DataFileButton";
import FileSaver from "file-saver";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

const onDataFile = jest.fn();
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
const mockSchema = {
  properties: { abc: { title: "Abc", type: "string" } },
  required: ["abc"],
  type: "object",
};

beforeEach(() => jest.clearAllMocks());

describe("dataFileButton", () => {
  it("should render correctly", () => {
    render(<DataFileButton onDataFile={() => {}} schema={{}} />);
    expect(screen.getByTestId("data-upload-button")).toHaveTextContent("Upload Data File");
  });

  it("should fire onDataFile when a file is successfully read", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={{}} />);

    const dropzone = screen.getByTestId("data-file-dropzone");
    const file = new File([JSON.stringify({ foo: "bar" })], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(onDataFile).toHaveBeenCalledWith({ foo: "bar" }));
    });
  });

  it("should show error when a file cannot be read", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={{}} />);

    const dropzone = screen.getByTestId("data-file-dropzone");
    const file = new File(["RANDOM_BINARY_FILE"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(screen.getByTestId("file-read-error")).not.toBeUndefined());
    });
  });

  it("should validate against schema", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={mockSchema} />);

    const dropzone = screen.getByTestId("data-file-dropzone");
    const mockDataFileUpload = { data: { abc: "bar" } };
    const file = new File([JSON.stringify(mockDataFileUpload)], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(onDataFile).toHaveBeenCalledWith(mockDataFileUpload));
    });
  });

  it("should display error when data file schema validation fails", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={mockSchema} />);

    const dropzone = screen.getByTestId("data-file-dropzone");
    const mockDataFileUpload = { data: { foo: "bar" } };
    const file = new File([JSON.stringify(mockDataFileUpload)], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(screen.getByTestId("file-read-error")).not.toBeUndefined());
    });
  });

  it("should call 'saveas' function when json data download button is pressed", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={mockSchema} />);

    expect(screen.queryAllByTestId("download-json-data-schema-button")).toHaveLength(1);

    await act(async () => {
      await fireEvent.click(screen.getByTestId("download-json-data-schema-button"));
    });

    await waitFor(() => {
      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    });
  });

  it("should call 'saveas' function when csv data download button is pressed", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={mockSchema} />);

    expect(screen.queryAllByTestId("download-csv-data-schema-button")).toHaveLength(1);

    await act(async () => {
      await fireEvent.click(screen.getByTestId("download-csv-data-schema-button"));
    });

    await waitFor(() => {
      expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    });
  });
});
