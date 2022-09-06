import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { SampleMobile } from "./SampleMobile";
import { configureStore } from "../../../store";
import { ChainId } from "../../../constants/chain-info";

const store = configureStore();

const renderWithStore = () => {
  return render(
    <Provider store={store}>
      <SampleMobile currentChainId={ChainId.Ropsten} />
    </Provider>
  );
};

describe("SampleMobile", () => {
  it("should have button text", () => {
    renderWithStore();
    expect(screen.getByText("Click Here")).toBeInTheDocument();
  });
});
