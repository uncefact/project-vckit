import { render, screen } from "@testing-library/react";

import React from "react";
import { CustomColorWidget } from "./CustomColorWidget";

const propsToPassIntoWidget = (): any => {
  return {
    options: {
      emptyValue: "#333333",
    },
  };
};

describe("CustomColorWidget", () => {
  it("should render color widget correctly", () => {
    render(<CustomColorWidget {...propsToPassIntoWidget()} />);
    const colorWidget = screen.getByTestId("custom-color-widget") as HTMLInputElement;
    expect(colorWidget.value).toEqual("#333333");
  });
});
