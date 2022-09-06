import { render, screen } from "@testing-library/react";
import React from "react";
import { CustomObjectFieldTemplate, CustomTitle } from "./CustomObjectField";

const mockProperties = new Array(2).fill(null).map((_arr, index) => {
  return {
    content: <div>Properties Component {index}</div>,
  };
});

const whenAllFieldsArePresent = (): any => {
  return {
    properties: mockProperties,
    title: "Component Title",
    description: "Component Description",
    required: false,
  };
};

const customLayoutProperties = new Array(3).fill(null).map((_arr, index) => {
  return {
    content: <div>Properties Component {index}</div>,
  };
});

const customLayoutFields = (): any => {
  return {
    properties: customLayoutProperties,
    title: "Custom Layout",
    required: false,
    uiSchema: {
      uiLayout: {
        sm: [12, 12, 12],
        md: [6, 6, 12],
      },
    },
  };
};

const customLayoutFieldsWithDefault = (): any => {
  return {
    properties: customLayoutProperties,
    title: "Custom Layout",
    required: false,
    uiSchema: {
      uiLayout: {
        sm: [12, 12],
        md: [6, 6],
      },
    },
  };
};

describe("CustomObjectFieldTemplate", () => {
  it("should render all fields correctly", () => {
    render(<CustomObjectFieldTemplate {...whenAllFieldsArePresent()} />);
    expect(screen.getByText("Component Description")).not.toBeNull();
    expect(screen.getByText("Component Title")).not.toBeNull();
    expect(screen.getAllByText(/Properties Component/)).not.toBeNull();
  });

  it("should render all properties in a list", () => {
    render(<CustomObjectFieldTemplate {...whenAllFieldsArePresent()} />);
    expect(screen.getAllByText(/Properties Component/)).toHaveLength(2);
  });
});

describe("CustomTitle", () => {
  it("should render title text", () => {
    render(<CustomTitle title={`foobar`} />);
    expect(screen.getByText(/foobar/)).toBeInTheDocument();
  });

  it("should render divider when title exist", () => {
    render(<CustomTitle title={`foobar`} />);
    expect(screen.getByTestId("custom-title-divider")).toBeInTheDocument();
  });
});

describe("BuildLayout", () => {
  it("should include correct col-span for custom layout", () => {
    render(<CustomObjectFieldTemplate {...customLayoutFields()} />);

    const firstChild = screen.getByText(/Properties Component 0/);
    expect(firstChild.parentElement?.className).toStrictEqual("col-span-12 md:col-span-6");

    const secondChild = screen.getByText(/Properties Component 1/);
    expect(secondChild.parentElement?.className).toStrictEqual("col-span-12 md:col-span-6");

    const thirdChild = screen.getByText(/Properties Component 2/);
    expect(thirdChild.parentElement?.className).toStrictEqual("col-span-12 md:col-span-12");

    const parentDiv = screen.getByText(/Custom Layout/).nextElementSibling;
    expect(parentDiv?.className).toStrictEqual("grid grid-cols-12 gap-2");
  });

  it("should include correct default col-span", () => {
    render(<CustomObjectFieldTemplate {...customLayoutFieldsWithDefault()} />);

    const thirdChild = screen.getByText(/Properties Component 2/);
    expect(thirdChild.parentElement?.className).toStrictEqual("col-span-12 md:col-span-12");
  });
});
