import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { FormState } from "../../../../../constants/FormState";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { EndorseTransferForm } from "./EndorseTransferForm";

describe("Endorse Transfer to nominated beneficiary and holder", () => {
  it("should display the approvedBeneficiary and approvedHolder address as non editable fields", async () => {
    await act(async () => {
      const mockHandleEndorseTransfer = jest.fn();

      const container = render(
        <EndorseTransferForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseTransfer}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          approvedBeneficiary="0xc0F28621Ca5454B66E51786003c798154FeBc6EB"
          approvedHolder="0xFC6e365B926166d0D69bF336d03164FB301D6C41"
          handleEndorseTransfer={mockHandleEndorseTransfer}
          transferToNewEscrowState={FormState.UNINITIALIZED}
          setFormActionNone={() => {}}
        />
      );

      const beneficiaryField = container.getByTestId("non-editable-input-owner");
      const holderField = container.getByTestId("non-editable-input-holder");
      expect(beneficiaryField).toHaveTextContent("0xc0F28621Ca5454B66E51786003c798154FeBc6EB");
      expect(holderField).toHaveTextContent("0xFC6e365B926166d0D69bF336d03164FB301D6C41");
    });
  });
  it("should fire the function to handle endorse transfer when 'endorse' button is clicked", async () => {
    await act(async () => {
      const mockHandleEndorseTransfer = jest.fn();

      const container = render(
        <EndorseTransferForm
          setShowEndorsementChain={() => {}}
          formAction={AssetManagementActions.EndorseTransfer}
          tokenRegistryAddress="0xdA8DBd2Aaffc995F11314c0040716E791de5aEd2"
          approvedBeneficiary="0xc0F28621Ca5454B66E51786003c798154FeBc6EB"
          approvedHolder="0xFC6e365B926166d0D69bF336d03164FB301D6C41"
          handleEndorseTransfer={mockHandleEndorseTransfer}
          transferToNewEscrowState={FormState.UNINITIALIZED}
          setFormActionNone={() => {}}
        />
      );
      fireEvent.click(container.getByTestId("endorseTransferBtn"));
      expect(mockHandleEndorseTransfer).toBeCalled();
    });
  });
});
