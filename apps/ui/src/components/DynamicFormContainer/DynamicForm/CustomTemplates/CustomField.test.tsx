import { render, screen } from "@testing-library/react";
import React from "react";
import { CustomFieldTemplate } from "./CustomField";

const mockComponent = (string: string): React.ReactElement => {
  return <div>{string}</div>;
};

const whenAllFieldsArePresentWithoutFormat = (): any => {
  return {
    id: "Component Id",
    classNames: "Component ClassName",
    label: "Component Label",
    help: mockComponent("Component Help"),
    required: true,
    description: mockComponent("Component Description"),
    errors: mockComponent("Component Errors"),
    children: mockComponent("Component Children"),
    schema: {
      format: undefined,
      type: "string",
      title: "Component Title",
    },
  };
};

const whenAllFieldsArePresentWithoutFormatRequireFalse = (): any => {
  return {
    id: "Component Id",
    classNames: "Component ClassName",
    label: "Component Label",
    help: mockComponent("Component Help"),
    required: false,
    description: mockComponent("Component Description"),
    errors: mockComponent("Component Errors"),
    children: mockComponent("Component Children"),
    schema: {
      format: undefined,
      type: "string",
      title: "Component Title",
    },
  };
};

const whenAllFieldsArePresentWithFormat = (): any => {
  return {
    id: "Component Id",
    classNames: "Component ClassName",
    label: "Component Label",
    help: mockComponent("Component Help"),
    required: false,
    description: mockComponent("Component Description"),
    errors: mockComponent("Component Errors"),
    children: mockComponent("Component Children"),
    schema: {
      format: true,
      type: "string",
      title: "Component Title",
    },
  };
};

describe("customFieldTemplate", () => {
  it("should render all fields correctly with label", () => {
    render(<CustomFieldTemplate {...whenAllFieldsArePresentWithoutFormat()} />);

    expect(screen.getByText("Component Label*")).not.toBeNull();
    expect(screen.getByText("Component Description")).not.toBeNull();
    expect(screen.getByText("Component Children")).not.toBeNull();
    expect(screen.getByText("Component Errors")).not.toBeNull();
    expect(screen.getByText("Component Help")).not.toBeNull();
  });

  it("should render all fields correctly with legend", () => {
    render(<CustomFieldTemplate {...whenAllFieldsArePresentWithFormat()} />);

    expect(screen.getByText("Component Title")).not.toBeNull();
    expect(screen.getByText("Component Description")).not.toBeNull();
    expect(screen.getByText("Component Children")).not.toBeNull();
    expect(screen.getByText("Component Errors")).not.toBeNull();
    expect(screen.getByText("Component Help")).not.toBeNull();
  });

  it("should render label and * if schema.format is undefined and required is true", () => {
    render(<CustomFieldTemplate {...whenAllFieldsArePresentWithoutFormat()} />);

    expect(screen.getByText("Component Label*")).not.toBeNull();
  });

  it("should render label without * if schema.format is undefined and required is false", () => {
    render(<CustomFieldTemplate {...whenAllFieldsArePresentWithoutFormatRequireFalse()} />);

    expect(screen.getByText("Component Label")).not.toBeNull();
  });

  it("should render the title if schema.format exist", () => {
    render(<CustomFieldTemplate {...whenAllFieldsArePresentWithFormat()} />);

    expect(screen.getByText("Component Title")).not.toBeNull();
  });
});
