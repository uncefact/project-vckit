import React from "react";
import { MagicDemo, MagicDemoVerifying } from "./MagicDropZone.stories";
import { render, screen } from "@testing-library/react";

describe("MagicDropZone", () => {
  it("should display demo watermark", () => {
    render(<MagicDemo />);
    expect(screen.getByAltText("Magic Dropzone TradeTrust").getAttribute("src")).toContain(
      "/static/images/dropzone/dropzone_illustration.svg"
    );
  });

  it("should display spinning loader and pending message", () => {
    render(<MagicDemoVerifying />);
    expect(screen.getByTestId("loader-spinner")).toBeInTheDocument();
    expect(screen.getByText("Verifying Document...")).toBeInTheDocument();
  });
});
