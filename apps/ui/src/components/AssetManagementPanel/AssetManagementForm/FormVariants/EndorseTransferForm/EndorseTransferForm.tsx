import {
  Button,
  MessageTitle,
  OverlayContext,
  showDocumentTransferMessage,
  LoaderSpinner,
} from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { FormState } from "../../../../../constants/FormState";
import { AssetInformationPanel } from "../../../AssetInformationPanel";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { AssetManagementTitle } from "../../AssetManagementTitle";
import { EditableAssetTitle } from "./../EditableAssetTitle";

interface EndorseTransferFormProps {
  formAction: AssetManagementActions;
  tokenRegistryAddress: string;
  approvedBeneficiary?: string;
  approvedHolder?: string;
  handleEndorseTransfer: (approvedBeneficiary: string, approvedHolder: string) => void;
  transferToNewEscrowState: string;
  setFormActionNone: () => void;
  setShowEndorsementChain: (payload: boolean) => void;
}

export const EndorseTransferForm: FunctionComponent<EndorseTransferFormProps> = ({
  formAction,
  tokenRegistryAddress,
  approvedBeneficiary,
  approvedHolder,
  handleEndorseTransfer,
  transferToNewEscrowState,
  setFormActionNone,
  setShowEndorsementChain,
}) => {
  const isPendingConfirmation = transferToNewEscrowState === FormState.PENDING_CONFIRMATION;
  const isConfirmed = transferToNewEscrowState === FormState.CONFIRMED;

  const { showOverlay } = useContext(OverlayContext);

  useEffect(() => {
    if (isConfirmed) {
      showOverlay(
        showDocumentTransferMessage(MessageTitle.ENDORSE_TRANSFER_SUCCESS, {
          isSuccess: true,
          beneficiaryAddress: approvedBeneficiary,
          holderAddress: approvedHolder,
        })
      );
      setFormActionNone();
    }
  }, [isConfirmed, approvedHolder, approvedBeneficiary, showOverlay, setFormActionNone]);

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
          <EditableAssetTitle role="Owner" value={approvedBeneficiary} isEditable={false} />
        </div>
        <div className="w-full px-4 lg:w-1/3">
          <EditableAssetTitle role="Holder" value={approvedHolder} isEditable={false} />
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
              >
                Cancel
              </Button>
            </div>
            <div className="w-auto ml-2">
              <Button
                className="bg-cerulean rounded-xl text-lg text-white py-2 px-3 shadow-none hover:bg-cerulean-300"
                onClick={() => handleEndorseTransfer(approvedBeneficiary || "", approvedHolder || "")}
                disabled={isPendingConfirmation}
                data-testid={"endorseTransferBtn"}
              >
                {isPendingConfirmation ? <LoaderSpinner data-testid={"loader"} /> : <>Endorse Transfer</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
