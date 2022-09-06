import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { FormState } from "../../../../../constants/FormState";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { SurrenderForm } from "./SurrenderForm";
import { act } from "react-dom/test-utils";

describe("Surrender", () => {
  it("should display the non-editable beneficiary & holder", async () => {
    await act(async () => {
      const container = render(
        <SurrenderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          surrenderingState={FormState.UNINITIALIZED}
          handleSurrender={() => {}}
        />
      );
      const beneficiaryComponent = container.getByTestId("asset-title-owner");
      const beneficiaryText = container.getByText("0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C");
      const holderComponent = container.getByTestId("asset-title-holder");
      const holderText = container.getByText("0xa61B056dA0084a5f391EC137583073096880C2e3");

      expect(beneficiaryComponent).not.toBeNull();
      expect(beneficiaryText).not.toBeNull();
      expect(holderComponent).not.toBeNull();
      expect(holderText).not.toBeNull();
    });
  });

  it("should have the surrender button and cancel button", async () => {
    await act(async () => {
      const container = render(
        <SurrenderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          surrenderingState={FormState.UNINITIALIZED}
          handleSurrender={() => {}}
        />
      );

      expect(container.queryByTestId("cancelSurrenderBtn")).not.toBeNull();
      expect(container.queryByTestId("surrenderBtn")).not.toBeNull();
    });
  });

  it("should change the state of the application to Surrender when we clicked on Surrender", async () => {
    await act(async () => {
      const mockHandleSurrender = jest.fn();

      const container = render(
        <SurrenderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          surrenderingState={FormState.UNINITIALIZED}
          handleSurrender={mockHandleSurrender}
        />
      );

      fireEvent.click(container.getByTestId("surrenderBtn"));
      expect(mockHandleSurrender).toHaveBeenCalled();
    });
  });

  it("should change the state of the application to None when we clicked on Cancel", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <SurrenderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={mockOnSetFormAction}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          surrenderingState={FormState.UNINITIALIZED}
          handleSurrender={() => {}}
        />
      );

      fireEvent.click(container.getByTestId("cancelSurrenderBtn"));
      expect(mockOnSetFormAction).toHaveBeenCalled();
    });
  });

  it("should show a loader when the surrender state is in PENDING_CONFIRMATION", async () => {
    await act(async () => {
      const container = render(
        <SurrenderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          surrenderingState={FormState.PENDING_CONFIRMATION}
          handleSurrender={() => {}}
        />
      );

      expect(container.queryByTestId("loader")).not.toBeNull();
    });
  });

  it("should disable surrender button when the surrender state is in INITIALIZED or PENDING_CONFIRMATION", async () => {
    await act(async () => {
      const mockHandleSurrender = jest.fn();

      const container = render(
        <SurrenderForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.Surrender}
          setFormActionNone={() => {}}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          beneficiary="0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          holder="0xa61B056dA0084a5f391EC137583073096880C2e3"
          surrenderingState={FormState.PENDING_CONFIRMATION}
          handleSurrender={mockHandleSurrender}
        />
      );

      fireEvent.click(container.getByTestId("surrenderBtn"));
      expect(mockHandleSurrender).not.toHaveBeenCalled();
    });
  });
});
