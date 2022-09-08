import { fireEvent, render, screen } from "@testing-library/react";
import { AddFormModal } from "./AddFormModal";

describe("addFormModal", () => {
  it("should not display anything initially", () => {
    render(<AddFormModal onAdd={() => {}} show={false} onClose={() => {}} forms={[]} />);

    expect(screen.queryAllByText(/Choose Document Type to Issue/)).toHaveLength(0);
  });

  it("should display the modal when state changed to 'true'", () => {
    render(<AddFormModal onAdd={() => {}} show={true} onClose={() => {}} forms={[]} />);

    expect(screen.queryAllByText(/Choose Document Type to Issue/)).toHaveLength(1);
  });

  it("should fire 'onClose' function when clicked cancel button", () => {
    const mockOnClose = jest.fn();
    render(<AddFormModal onAdd={() => {}} show={true} onClose={mockOnClose} forms={[]} />);

    fireEvent.click(screen.getByTestId("cancel-add-form-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
