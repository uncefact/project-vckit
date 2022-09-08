import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { CustomDropdownWidget } from "./CustomDropdownWidget";

const propsToPassIntoWidget = (): any => {
  return {
    options: {
      enumOptions: [
        {
          label: "foo",
          value: "bar",
        },
        {
          label: "foo2",
          value: "bar2",
        },
        {
          label: "foo3",
          value: "bar3",
        },
      ],
    },
  };
};

describe("CustomDropdownWidget", () => {
  it("should render dropdown with 3 options correctly", () => {
    render(<CustomDropdownWidget {...propsToPassIntoWidget()} />);
    fireEvent.click(screen.getByText("Select One"));
    expect(screen.getByText("foo")).toBeInTheDocument();
    expect(screen.getByText("foo2")).toBeInTheDocument();
    expect(screen.getByText("foo3")).toBeInTheDocument();
  });
});
