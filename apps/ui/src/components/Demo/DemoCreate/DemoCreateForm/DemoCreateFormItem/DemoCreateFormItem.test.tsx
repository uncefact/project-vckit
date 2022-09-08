import React from "react";
import { render, screen } from "@testing-library/react";
import {
  FormItemAccordion,
  FormItemUploadWithSignature,
  FormItemUploadWithoutSignature,
  FormItemWithLabel,
  FormItemWithoutLabel,
} from "./DemoCreateFormItem.stories";
import { data } from "../data";

describe("DemoCreateFormItem", () => {
  it("should render form item accordion", () => {
    render(<FormItemAccordion />);
    expect(screen.getByTestId("accordion-icon")).not.toBeNull();
  });

  it("should render form item with label", () => {
    render(<FormItemWithLabel />);
    expect(screen.getByTestId("form-item-input")).not.toBeNull();
    expect(screen.getByText("Form Item With Label")).not.toBeNull();
  });

  it("should render form item without label", async () => {
    render(<FormItemWithoutLabel />);
    expect(screen.getByTestId("form-item-input")).not.toBeNull();
    expect(screen.queryByText("Form Item Without Label")).toBeNull();
  });

  it("should render form item upload image src correctly", () => {
    render(<FormItemUploadWithSignature />);
    expect(screen.getByAltText("First Signatory Authentication").getAttribute("src")).toContain(
      data.firstSignatoryAuthentication.signature
    );
  });

  it("should render form item upload (with default signature)", () => {
    render(<FormItemUploadWithSignature />);
    expect(screen.getByTestId("form-item-dropzone")).not.toBeNull();
  });

  it("should render form item upload (without default signature) with upload text", () => {
    render(<FormItemUploadWithoutSignature />);
    expect(screen.getByText("Upload")).not.toBeNull();
  });
});
