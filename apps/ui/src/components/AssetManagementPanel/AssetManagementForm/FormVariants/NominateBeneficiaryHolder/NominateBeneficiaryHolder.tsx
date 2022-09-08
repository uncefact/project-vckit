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

interface NominateBeneficiaryHolderFormProps {
  formAction: AssetManagementActions;
  tokenRegistryAddress: string;
  beneficiary?: string;
  holder?: string;
  handleNomination: (newBeneficiary: string, newHolder: string) => void;
  nominationState: string;
  setFormActionNone: () => void;
  setShowEndorsementChain: (payload: boolean) => void;
}

export const NominateBeneficiaryHolderForm: FunctionComponent<NominateBeneficiaryHolderFormProps> = ({
  formAction,
  tokenRegistryAddress,
  beneficiary,
  holder,
  handleNomination,
  nominationState,
  setFormActionNone,
  setShowEndorsementChain,
}) => {
  const [newBeneficiary, setNewBeneficiary] = useState("");
  const isPendingConfirmation = nominationState === FormState.PENDING_CONFIRMATION;
  const isConfirmed = nominationState === FormState.CONFIRMED;
  const isEditable = nominationState !== FormState.PENDING_CONFIRMATION && nominationState !== FormState.CONFIRMED;
  const { showOverlay } = useContext(OverlayContext);

  useEffect(() => {
    if (isConfirmed) {
      showOverlay(
        showDocumentTransferMessage(MessageTitle.NOMINATE_BENEFICIARY_HOLDER_SUCCESS, {
          isSuccess: true,
        })
      );
      setFormActionNone();
    }
  }, [isConfirmed, newBeneficiary, showOverlay, setFormActionNone]);

  const isInvalidNomination =
    !newBeneficiary || !holder || newBeneficiary === beneficiary || !isEthereumAddress(newBeneficiary);

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
            error={nominationState === FormState.ERROR}
          />
        </div>
        <div className="w-full px-4 lg:w-1/3">
          <EditableAssetTitle role="Holder" value={holder} isEditable={false} />
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
                data-testid={"cancelNominationBtn"}
              >
                Cancel
              </Button>
            </div>
            <div className="w-auto ml-2">
              <Button
                className="bg-cerulean rounded-xl text-lg text-white py-2 px-3 shadow-none hover:bg-cerulean-300"
                disabled={isInvalidNomination || isPendingConfirmation}
                onClick={() => {
                  if (holder === undefined) return;
                  // holder is used instead of 'NewHolder' because we do not want to change the value on the UI when nominating beneficiary.
                  handleNomination(newBeneficiary, holder);
                }}
                data-testid={"nominationBtn"}
              >
                {isPendingConfirmation ? <LoaderSpinner data-testid={"loader"} /> : <>Nominate</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
