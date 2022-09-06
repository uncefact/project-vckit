import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { FormState } from "../../../../../constants/FormState";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { EndorseBeneficiaryForm } from "./EndorseBeneficiary";
import { act } from "react-dom/test-utils";

describe("Endorse Owner", () => {
  it("should display the editable beneficiary & static holder when the app is in EndorseBeneficiary state", async () => {
    await act(async () => {
      const container = render(
        <EndorseBeneficiaryForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseBeneficiary}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          beneficiaryEndorseState={FormState.UNINITIALIZED}
        />
      );

      const beneficiaryComponent = container.getByTestId("editable-input-owner");
      const holderComponent = container.getByTestId("editable-input-holder");

      expect(beneficiaryComponent).not.toBeNull();
      expect(holderComponent).not.toBeNull();
    });
  });

  it("should have the endorse button and cancel button", async () => {
    await act(async () => {
      const container = render(
        <EndorseBeneficiaryForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseBeneficiary}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          beneficiaryEndorseState={FormState.UNINITIALIZED}
        />
      );

      expect(container.queryByTestId("cancelEndorseBtn")).not.toBeNull();
      expect(container.queryByTestId("endorseBtn")).not.toBeNull();
    });
  });

  it("should change the state of the application to None when we clicked on Cancel", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <EndorseBeneficiaryForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseBeneficiary}
          setFormActionNone={mockOnSetFormAction}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          beneficiaryEndorseState={FormState.UNINITIALIZED}
        />
      );

      fireEvent.click(container.getByTestId("cancelEndorseBtn"));
      expect(mockOnSetFormAction).toHaveBeenCalled();
    });
  });

  it("should disable endorse button when holder is empty", async () => {
    await act(async () => {
      const mockHandleEndorse = jest.fn();

      const container = render(
        <EndorseBeneficiaryForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseBeneficiary}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={mockHandleEndorse}
          beneficiaryEndorseState={FormState.UNINITIALIZED}
        />
      );

      fireEvent.click(container.getByTestId("endorseBtn"));
      expect(mockHandleEndorse).not.toHaveBeenCalled();
    });
  });

  it("should show error when changeBeneficiary return error endorseBeneficiaryState", async () => {
    await act(async () => {
      const { getAllByText } = render(
        <EndorseBeneficiaryForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseBeneficiary}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          handleTransfer={() => {}}
          beneficiaryEndorseState={FormState.ERROR}
        />
      );

      expect(getAllByText("Unidentified address. Please check and input again.", { exact: false })).not.toBeNull();
    });
  });
});
