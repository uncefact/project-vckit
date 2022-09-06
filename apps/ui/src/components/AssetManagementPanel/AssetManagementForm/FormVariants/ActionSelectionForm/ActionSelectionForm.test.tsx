import * as obfuscatedDocument from "../../../../../test/fixture/obfuscated-document.json";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { whenDocumentValidAndIssuedByDns } from "../../../../../test/fixture/verifier-responses";
import { ActionSelectionForm } from "./ActionSelectionForm";
import { VerificationFragment } from "@govtechsg/oa-verify";
import { WrappedOrSignedOpenAttestationDocument } from "../../../../../utils/shared";

const defaultProps = {
  setShowEndorsementChain: () => {},
  onSetFormAction: () => {},
  tokenRegistryAddress: "0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2",
  beneficiary: "0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
  holder: "0xa61B056dA0084a5f391EC137583073096880C2e3",
  account: "0xa61B056dA0084a5f391EC137583073096880C2e3",
  canSurrender: false,
  canHandleSurrender: false,
  onConnectToWallet: () => alert("Login to Metamask"),
  canChangeHolder: false,
  canEndorseBeneficiary: false,
  canNominateBeneficiaryHolder: false,
  isSurrendered: false,
  canEndorseTransfer: false,
  isTitleEscrow: true,
  isTokenBurnt: false,
  document: obfuscatedDocument as WrappedOrSignedOpenAttestationDocument,
  verificationStatus: whenDocumentValidAndIssuedByDns as VerificationFragment[],
};

describe("ActionSelectionForm", () => {
  it("should display the non-editable beneficiary & holder", async () => {
    await act(async () => {
      const container = render(<ActionSelectionForm {...defaultProps} />);
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

  it("should fire login to browser wallet if user is not logged in", async () => {
    await act(async () => {
      const mockOnConnectToWallet = jest.fn();

      const container = render(
        <ActionSelectionForm {...defaultProps} account="" onConnectToWallet={mockOnConnectToWallet} />
      );

      fireEvent.click(container.getByTestId("connectToWallet"));
      expect(mockOnConnectToWallet).toHaveBeenCalled();
    });
  });

  it("should display the Manage Assets dropdown if user is logged in", async () => {
    await act(async () => {
      const container = render(<ActionSelectionForm {...defaultProps} canChangeHolder={true} />);

      const manageAssetsDropdown = container.getByTestId("manageAssetDropdown");
      expect(manageAssetsDropdown).not.toBeNull();
    });
  });

  it("should allow the selection of Surrender if user can surrender", async () => {
    await act(async () => {
      const container = render(<ActionSelectionForm {...defaultProps} canSurrender={true} />);

      await act(async () => {
        fireEvent.click(container.getByTestId("manageAssetDropdown"));
      });

      expect(container.queryByTestId("surrenderDropdown")).not.toBeNull();
    });
  });

  it("should not display the selection of Surrender if user cannot surrender", async () => {
    await act(async () => {
      const container = render(<ActionSelectionForm {...defaultProps} canSurrender={false} />);

      expect(container.queryByTestId("SurrenderDropdown")).toBeNull();
    });
  });

  it("should display the Surrender to issuer tag if document is owned by token registry", async () => {
    await act(async () => {
      const container = render(<ActionSelectionForm {...defaultProps} isSurrendered={true} />);

      expect(container.queryByText("Surrendered To Issuer")).not.toBeNull();
    });
  });

  it("should display the Surrender tag if document is surrendered", async () => {
    await act(async () => {
      const container = render(<ActionSelectionForm {...defaultProps} isTokenBurnt={true} />);

      expect(container.queryByText("Surrendered")).not.toBeNull();
    });
  });

  it("should change the state of the application to TransferHolder when we clicked on TransferHolder", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <ActionSelectionForm {...defaultProps} onSetFormAction={mockOnSetFormAction} canChangeHolder={true} />
      );

      await act(async () => {
        fireEvent.click(container.getByTestId("manageAssetDropdown"));
      });

      await act(async () => {
        fireEvent.click(container.getByTestId("transferHolderDropdown"));
      });

      expect(mockOnSetFormAction).toHaveBeenCalled();
    });
  });

  it("should change the state of the application to EndorseBeneficiary when we clicked on EndorseBeneficiary", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <ActionSelectionForm {...defaultProps} onSetFormAction={mockOnSetFormAction} canEndorseBeneficiary={true} />
      );

      await act(async () => {
        fireEvent.click(container.getByTestId("manageAssetDropdown"));
      });

      await act(async () => {
        fireEvent.click(container.getByTestId("endorseBeneficiaryDropdown"));
      });

      expect(mockOnSetFormAction).toHaveBeenCalled();
    });
  });

  it("should display the dropdown option when canEndorseTransfer is true", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <ActionSelectionForm {...defaultProps} onSetFormAction={mockOnSetFormAction} canEndorseTransfer={true} />
      );

      await act(async () => {
        fireEvent.click(container.getByTestId("manageAssetDropdown"));
      });

      const endorseTransferDropdown = container.getByTestId("endorseTransferDropdown");
      expect(endorseTransferDropdown).not.toBeNull();
    });
  });

  it("should change the state of the action form to 'EndorseTransfer' when clicked on the dropdown", async () => {
    await act(async () => {
      const mockOnSetFormAction = jest.fn();

      const container = render(
        <ActionSelectionForm {...defaultProps} onSetFormAction={mockOnSetFormAction} canEndorseTransfer={true} />
      );

      await act(async () => {
        fireEvent.click(container.getByTestId("manageAssetDropdown"));
      });

      await act(async () => {
        fireEvent.click(container.getByTestId("endorseTransferDropdown"));
      });

      expect(mockOnSetFormAction).toHaveBeenCalled();
    });
  });

  it("should change the state of the action form to 'Accept Surrender' when clicked on the dropdown", async () => {
    const mockOnSetFormAction = jest.fn();

    const container = render(
      <ActionSelectionForm
        {...defaultProps}
        onSetFormAction={mockOnSetFormAction}
        isTitleEscrow={false}
        canHandleSurrender={true}
      />
    );

    await act(async () => {
      fireEvent.click(container.getByTestId("manageAssetDropdown"));
    });

    await act(async () => {
      fireEvent.click(container.getByTestId("acceptSurrenderDropdown"));
    });

    expect(mockOnSetFormAction).toHaveBeenCalled();
  });

  it("should change the state of the action form to 'Reject Surrender' when clicked on the dropdown", async () => {
    const mockOnSetFormAction = jest.fn();

    const container = render(
      <ActionSelectionForm
        {...defaultProps}
        onSetFormAction={mockOnSetFormAction}
        isTitleEscrow={false}
        canHandleSurrender={true}
      />
    );

    await act(async () => {
      fireEvent.click(container.getByTestId("manageAssetDropdown"));
    });

    await act(async () => {
      fireEvent.click(container.getByTestId("rejectSurrenderDropdown"));
    });

    expect(mockOnSetFormAction).toHaveBeenCalled();
  });
});
