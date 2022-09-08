import { render, screen, fireEvent } from "@testing-library/react";
import { RevokeConfirmationModal } from "./RevokeConfirmationModal";
import { BrowserRouter } from "react-router-dom";

describe("RevokeConfirmationModal", () => {
  it("should not show revoke confirmation modal when show is false", () => {
    const revokingDocument = jest.fn();
    const show = false;
    const closeRevokeConfirmationModal = jest.fn();

    render(
      <BrowserRouter>
        <RevokeConfirmationModal
          fileName={""}
          revokingDocument={revokingDocument}
          show={show}
          closeRevokeConfirmationModal={closeRevokeConfirmationModal}
        />
      </BrowserRouter>
    );
    expect(screen.queryAllByTestId("modal-title")).toHaveLength(0);
  });

  it("should show revoke confirmation modal when show is true", () => {
    const revokingDocument = jest.fn();
    const show = true;
    const closeRevokeConfirmationModal = jest.fn();

    render(
      <BrowserRouter>
        <RevokeConfirmationModal
          fileName={""}
          revokingDocument={revokingDocument}
          show={show}
          closeRevokeConfirmationModal={closeRevokeConfirmationModal}
        />
      </BrowserRouter>
    );
    expect(screen.queryAllByTestId("modal-title")).toHaveLength(1);
  });

  it("should fire revokingDocument function when revoke button is pressed", () => {
    const revokingDocument = jest.fn();
    const show = true;
    const closeRevokeConfirmationModal = jest.fn();

    render(
      <BrowserRouter>
        <RevokeConfirmationModal
          fileName={""}
          revokingDocument={revokingDocument}
          show={show}
          closeRevokeConfirmationModal={closeRevokeConfirmationModal}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("confirm-modal-confirm-button"));
    expect(revokingDocument).toHaveBeenCalledTimes(1);
  });

  it("should fire closeRevokeConfirmationModal function when cancel button is clicked", () => {
    const revokingDocument = jest.fn();
    const show = true;
    const closeRevokeConfirmationModal = jest.fn();

    render(
      <BrowserRouter>
        <RevokeConfirmationModal
          fileName={""}
          revokingDocument={revokingDocument}
          show={show}
          closeRevokeConfirmationModal={closeRevokeConfirmationModal}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("confirm-modal-cancel-button"));
    expect(closeRevokeConfirmationModal).toHaveBeenCalledTimes(1);
  });
});
