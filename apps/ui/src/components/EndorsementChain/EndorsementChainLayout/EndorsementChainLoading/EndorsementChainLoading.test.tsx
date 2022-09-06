import { render, screen } from "@testing-library/react";
import React from "react";
import { EndorsementChainLoading } from "./EndorsementChainLoading";

describe("EndorsementChainLoading", () => {
  it("should render correctly", () => {
    render(<EndorsementChainLoading />);

    expect(screen.getAllByTestId("loader-skeleton")).toHaveLength(9);
  });
});
