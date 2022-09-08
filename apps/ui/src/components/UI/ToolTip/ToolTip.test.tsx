import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ToolTip } from "./ToolTip";

describe("ToolTip", () => {
  it("should render the UI accordingly when clicked", () => {
    render(<ToolTip toolTipText="Testing this is the text for the tool tip" />);
    fireEvent.click(screen.getByTestId("tool-tip-button"));
    expect(screen.getAllByTestId("tool-tip-text")).toHaveLength(1);
    expect(screen.getByTestId("tool-tip-text")).toContainHTML("Testing this is the text for the tool tip");
  });

  it("should not have any tool tip text if not clicked", () => {
    render(<ToolTip toolTipText="Testing this is the text for the tool tip" />);
    expect(screen.queryAllByTestId("tool-tip-text")).toHaveLength(0);
  });

  it("should close tool tip when clicked anywhere outside tooltip box", () => {
    render(<ToolTip toolTipText="Testing this is the text for the tool tip" />);
    fireEvent.click(screen.getByTestId("tool-tip-button"));
    fireEvent.click(screen.getByTestId("close-tool-tip"));
    expect(screen.queryAllByTestId("tool-tip-text")).toHaveLength(0);
  });
});
