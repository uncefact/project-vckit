import {
  Button,
  MessageTitle,
  OverlayContext,
  showDocumentTransferMessage,
  LoaderSpinner,
} from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { FormState } from "../../../../../constants/FormState";
import { isEthereumAddress } from "../../../../../utils";
import { AssetInformationPanel } from "../../../AssetInformationPanel";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { AssetManagementTitle } from "../../AssetManagementTitle";
import { EditableAssetTitle } from "./../EditableAssetTitle";

interface EndorseBeneficiaryProps {
  formAction: AssetManagementActions;
  tokenRegistryAddress: string;
  beneficiary?: string;
  holder?: string;
  handleTransfer: (newBeneficiary: string, newHolder: string) => void;
  beneficiaryEndorseState: string;
  setFormActionNone: () => void;
  setShowEndorsementChain: (payload: boolean) => void;
}

export const EndorseBeneficiaryForm: FunctionComponent<EndorseBeneficiaryProps> = ({
  formAction,
  tokenRegistryAddress,
  beneficiary,
  holder,
  handleTransfer,
  beneficiaryEndorseState,
  setFormActionNone,
  setShowEndorsementChain,
}) => {
  const [newBeneficiary, setNewBeneficiary] = useState("");
  const [newHolder, setNewHolder] = useState("");
  const isPendingConfirmation = beneficiaryEndorseState === FormState.PENDING_CONFIRMATION;
  const isConfirmed = beneficiaryEndorseState === FormState.CONFIRMED;
  const isEditable =
    beneficiaryEndorseState !== FormState.PENDING_CONFIRMATION && beneficiaryEndorseState !== FormState.CONFIRMED;
  const { showOverlay } = useContext(OverlayContext);

  useEffect(() => {
    if (isConfirmed) {
      showOverlay(
        showDocumentTransferMessage(MessageTitle.CHANGE_BENEFICIARY_SUCCESS, {
          isSuccess: true,
          beneficiaryAddress: newBeneficiary,
        })
      );
      setFormActionNone();
    }
  }, [isConfirmed, newBeneficiary, showOverlay, setFormActionNone]);

  const isValidEndorse = () => {
    if (!newBeneficiary || !newHolder) return false;
    if (newBeneficiary === beneficiary && newHolder === holder) return false;
    if (!isEthereumAddress(newBeneficiary) || !isEthereumAddress(newHolder)) return false;

    return true;
  };

  return (
    <>
      <AssetManagementTitle
        setFormActionNone={setFormActionNone}
        formAction={formAction}
        disabled={isPendingConfirmation}
      />
      <div className="flex flex-wrap justify-between mb-4 -mx-4">
        <div className="w-full px-4 lg:w-1/3">
          <AssetInformationPanel
            setShowEndorsementChain={setShowEndorsementChain}
            tokenRegistryAddress={tokenRegistryAddress}
          />
        </div>
        <div className="w-full px-4 lg:w-1/3">
          <EditableAssetTitle
            role="Owner"
            value={beneficiary}
            newValue={newBeneficiary}
            isEditable={isEditable}
            onSetNewValue={setNewBeneficiary}
            error={beneficiaryEndorseState === FormState.ERROR}
          />
        </div>
        <div className="w-full px-4 lg:w-1/3">
          <EditableAssetTitle
            role="Holder"
            value={holder}
            newValue={newHolder}
            isEditable={isEditable}
            onSetNewValue={setNewHolder}
            error={beneficiaryEndorseState === FormState.ERROR}
          />
        </div>
      </div>
      <div className="flex flex-wrap pb-4">
        <div className="w-auto lg:ml-auto">
          <div className="flex flex-wrap">
            <div className="w-auto">
              <Button
                className="bg-white rounded-xl text-lg py-2 px-3 border-cloud-100 text-cloud-900 shadow-none hover:bg-cloud-200"
                onClick={setFormActionNone}
                disabled={isPendingConfirmation}
                data-testid={"cancelEndorseBtn"}
              >
                Cancel
              </Button>
            </div>
            <div className="w-auto ml-2">
              <Button
                className="bg-cerulean rounded-xl text-lg text-white py-2 px-3 shadow-none hover:bg-cerulean-300"
                disabled={!isValidEndorse() || isPendingConfirmation}
                onClick={() => handleTransfer(newBeneficiary, newHolder)}
                data-testid={"endorseBtn"}
              >
                {isPendingConfirmation ? <LoaderSpinner data-testid={"loader"} /> : <>Endorse</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
