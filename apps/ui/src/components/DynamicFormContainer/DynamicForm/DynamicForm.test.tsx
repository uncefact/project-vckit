import { render, screen } from "@testing-library/react";
import React from "react";
import { FormTemplate, FormType } from "../../../types";
import { DynamicForm } from "./DynamicForm";

import sampleConfig from "../../../test/fixture/config/v2/sample-config-ropsten.json";

const form = sampleConfig.forms[1] as FormTemplate;

const mockSetFormData = jest.fn();
const mockSetOwnership = jest.fn();
const mockSetCurrentForm = jest.fn();

const commonProps = {
  type: "TRANSFERABLE_RECORD" as FormType,
  schema: form.schema,
  form: {
    fileName: "",
    data: { formData: {} },
    templateIndex: 0,
    ownership: { beneficiaryAddress: "", holderAddress: "" },
    extension: "tt",
  },
  setFormData: mockSetFormData,
  setOwnership: mockSetOwnership,
  setCurrentForm: mockSetCurrentForm,
  attachmentAccepted: false,
};

describe("dynamicForm", () => {
  beforeEach(() => {
    mockSetFormData.mockReset();
  });

  it("should render the fields from the form definition", async () => {
    render(<DynamicForm {...commonProps} />);
    expect(screen.queryByLabelText("Information")).not.toBeNull();
  });

  it("should show the ownership section when type is transferable record", () => {
    render(<DynamicForm {...commonProps} />);
    expect(screen.queryByTestId("transferable-record-form")).not.toBeNull();
  });

  it("should not show the ownership section when type is verifiable document", () => {
    render(<DynamicForm {...commonProps} type="VERIFIABLE_DOCUMENT" />);
    expect(screen.queryByTestId("transferable-record-form")).toBeNull();
  });

  it("should render the attachment dropzone section if attachment is accepted", () => {
    render(<DynamicForm {...commonProps} attachmentAccepted={true} />);
    expect(screen.queryByTestId("attachment-dropzone")).not.toBeNull();
  });

  it("should not render the attachment dropzone section if attachment is not accepted", () => {
    render(<DynamicForm {...commonProps} attachmentAccepted={false} />);
    expect(screen.queryByTestId("attachment-dropzone")).toBeNull();
  });

  it("should render the data file dropzone", () => {
    render(<DynamicForm {...commonProps} />);
    expect(screen.queryByTestId("data-file-dropzone")).not.toBeNull();
  });
});
