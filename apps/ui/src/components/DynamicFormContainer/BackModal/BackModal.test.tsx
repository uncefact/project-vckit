import { fireEvent, render, screen } from "@testing-library/react";
import { BackModal } from "./BackModal";

describe("backModal", () => {
  it("should not display anything initially", () => {
    render(<BackModal backToFormSelection={() => {}} show={false} closeBackModal={() => {}} />);

    expect(screen.queryAllByText(/Clear All/)).toHaveLength(0);
  });

  it("should display the modal when state changed to 'true'", () => {
    render(<BackModal backToFormSelection={() => {}} show={true} closeBackModal={() => {}} />);

    expect(screen.queryAllByText(/Clear All/)).toHaveLength(1);
  });

  it("should fire 'backToFormSelection' function when clicked back button", () => {
    const mockBackToFormSelection = jest.fn();
    render(<BackModal backToFormSelection={mockBackToFormSelection} show={true} closeBackModal={() => {}} />);

    fireEvent.click(screen.getByTestId("confirm-modal-confirm-button"));
    expect(mockBackToFormSelection).toHaveBeenCalledTimes(1);
  });

  it("should fire 'closeBackModal' function when clicked cancel button", () => {
    const mockCloseBackModal = jest.fn();
    render(<BackModal backToFormSelection={() => {}} show={true} closeBackModal={mockCloseBackModal} />);

    fireEvent.click(screen.getByTestId("confirm-modal-cancel-button"));
    expect(mockCloseBackModal).toHaveBeenCalledTimes(1);
  });
});
