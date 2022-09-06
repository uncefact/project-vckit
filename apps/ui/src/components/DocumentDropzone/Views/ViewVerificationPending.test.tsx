import { render, screen } from "@testing-library/react";
import React from "react";
import { ViewVerificationPending } from "./ViewVerificationPending";

describe("ViewVerificationPending", () => {
  it("should display correct text while verifying document", () => {
    render(<ViewVerificationPending />);
    expect(screen.getByText("Verifying Document...")).toBeInTheDocument();
  });

  it("should display loader", () => {
    render(<ViewVerificationPending />);
    expect(screen.getByTestId("loader-spinner")).toBeInTheDocument();
  });
});
