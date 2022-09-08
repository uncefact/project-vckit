import { render, screen } from "@testing-library/react";
import React from "react";
import { CustomTextareaWidget } from "./CustomTextareaWidget";

const propsToPassIntoWidget = (): any => {
  return {
    placeholder: "some placeholder text",
    value: "some default text",
  };
};

describe("customTextareaWidget", () => {
  it("should render the correct textarea", () => {
    render(<CustomTextareaWidget {...propsToPassIntoWidget()} />);

    expect(screen.queryAllByText("some default text")).toHaveLength(1);
    expect(screen.queryAllByPlaceholderText("some placeholder text")).toHaveLength(1);
  });
});
