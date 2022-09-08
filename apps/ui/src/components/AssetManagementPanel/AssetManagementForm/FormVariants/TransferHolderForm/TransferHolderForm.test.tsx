import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { FormState } from "../../../../../constants/FormState";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { TransferHolderForm } from "./TransferHolderForm";
import { act } from "react-dom/test-utils";

describe("Transfer Holder", () => {
  it("should display the static beneficiary & editable holder when the app is in TransferHolder state", async () => {
    await act(async () => {
      const container = render(
        <TransferHolderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.TransferHolder}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          holderTransferringState={FormState.UNINITIALIZED}
        />
      );

      const beneficiaryComponent = container.getByTestId("asset-title-owner");
      const beneficiaryText = container.getByText("0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C");
      const holderComponent = container.getByTestId("editable-input-holder");

      expect(beneficiaryComponent).not.toBeNull();
      expect(beneficiaryText).not.toBeNull();
      expect(holderComponent).not.toBeNull();
    });
  });

  it("should have the transfer holder button and cancel button", async () => {
    await act(async () => {
      const container = render(
        <TransferHolderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.TransferHolder}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          holderTransferringState={FormState.UNINITIALIZED}
        />
      );

      expect(container.queryByTestId("cancelTransferBtn")).not.toBeNull();
      expect(container.queryByTestId("transferBtn")).not.toBeNull();
    });
  });

  it("should change the state of the application to None when we clicked on Cancel", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <TransferHolderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.TransferHolder}
          setFormActionNone={mockOnSetFormAction}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          holderTransferringState={FormState.UNINITIALIZED}
        />
      );

      fireEvent.click(container.getByTestId("cancelTransferBtn"));
      expect(mockOnSetFormAction).toHaveBeenCalled();
    });
  });

  it("should disable transfer button when holder is empty", async () => {
    await act(async () => {
      const mockHandleTransfer = jest.fn();

      const container = render(
        <TransferHolderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.TransferHolder}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={mockHandleTransfer}
          holderTransferringState={FormState.UNINITIALIZED}
        />
      );

      fireEvent.click(container.getByTestId("transferBtn"));
      expect(mockHandleTransfer).not.toHaveBeenCalled();
    });
  });

  it("should show error when changeHolder return error holderState", async () => {
    await act(async () => {
      const container = render(
        <TransferHolderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.TransferHolder}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          holderTransferringState={FormState.ERROR}
        />
      );

      const hasError = container.getByTestId("error-msg");
      expect(hasError).not.toBeNull();
    });
  });
});
