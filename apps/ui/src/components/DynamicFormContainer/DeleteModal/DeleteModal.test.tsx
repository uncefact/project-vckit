import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { DeleteModal } from "./DeleteModal";

describe("deleteModal", () => {
  it("should not display anything on initial", () => {
    render(<DeleteModal deleteForm={() => {}} show={false} closeDeleteModal={() => {}} />);

    expect(screen.queryAllByText("Delete Form")).toHaveLength(0);
  });

  it("should display the modal when state changed to 'true'", () => {
    render(<DeleteModal deleteForm={() => {}} show={true} closeDeleteModal={() => {}} />);

    expect(screen.queryAllByText("Delete Form")).toHaveLength(1);
  });

  it("should fire 'deleteForm' function when clicked delete button", () => {
    const mockDeleteForm = jest.fn();
    render(<DeleteModal deleteForm={mockDeleteForm} show={true} closeDeleteModal={() => {}} />);

    fireEvent.click(screen.getByTestId("confirm-modal-confirm-button"));

    expect(mockDeleteForm).toHaveBeenCalledTimes(1);
  });

  it("should fire 'closeDeleteModal' function when clicked cancel button", () => {
    const mockCloseDeleteModal = jest.fn();
    render(<DeleteModal deleteForm={() => {}} show={true} closeDeleteModal={mockCloseDeleteModal} />);

    fireEvent.click(screen.getByTestId("confirm-modal-cancel-button"));

    expect(mockCloseDeleteModal).toHaveBeenCalledTimes(1);
  });
});
