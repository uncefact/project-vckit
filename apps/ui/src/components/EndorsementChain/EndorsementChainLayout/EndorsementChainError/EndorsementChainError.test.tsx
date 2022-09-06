import { render, screen } from "@testing-library/react";
import React from "react";
import { EndorsementChainError } from "./EndorsementChainError";

describe("EndorsementChainError", () => {
  it("should render error message correctly", () => {
    render(<EndorsementChainError error={"Unknown Error"} />);
    expect(screen.getAllByText("Unknown Error has occurred, please try again later.")).toHaveLength(1);
  });
});
