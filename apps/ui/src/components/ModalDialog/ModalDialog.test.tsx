import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ModalDialog } from "./ModalDialog";

describe("modalDialog", () => {
  it("should render the UI accordingly", () => {
    render(
      <ModalDialog close={() => {}}>
        <div>Hello World!</div>
      </ModalDialog>
    );

    expect(screen.queryByTestId("modal-dialog")).not.toBeNull();
    expect(screen.queryAllByText("Hello World!")).toHaveLength(1);
  });

  it("should fire the 'close' function when backdrop is clicked", () => {
    const mockClose = jest.fn();
    render(
      <ModalDialog close={mockClose}>
        <div>Hello World!</div>
      </ModalDialog>
    );

    fireEvent.click(screen.getByTestId("modal-backdrop"));

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
