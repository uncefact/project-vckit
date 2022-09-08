import {
  Button,
  LoaderSpinner,
  MessageTitle,
  OverlayContext,
  showDocumentTransferMessage,
} from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { FormState } from "../../../../../constants/FormState";
import { AssetInformationPanel } from "../../../AssetInformationPanel";
import { AssetManagementActions } from "../../../AssetManagementActions";
import { AssetManagementTitle } from "../../AssetManagementTitle";
import { EditableAssetTitle } from "./../EditableAssetTitle";

interface SurrenderFormProps {
  formAction: AssetManagementActions;
  tokenRegistryAddress: string;
  beneficiary?: string;
  holder?: string;
  handleSurrender: () => void;
  surrenderingState: string;
  setFormActionNone: () => void;
  setShowEndorsementChain: (payload: boolean) => void;
}

export const SurrenderForm: FunctionComponent<SurrenderFormProps> = ({
  formAction,
  tokenRegistryAddress,
  beneficiary,
  holder,
  handleSurrender,
  surrenderingState,
  setFormActionNone,
  setShowEndorsementChain,
}) => {
  const isPendingConfirmation = surrenderingState === FormState.PENDING_CONFIRMATION;
  const isConfirmed = surrenderingState === FormState.CONFIRMED;

  const { showOverlay } = useContext(OverlayContext);

  useEffect(() => {
    if (isConfirmed) {
      showOverlay(showDocumentTransferMessage(MessageTitle.SURRENDER_DOCUMENT_SUCCESS, { isSuccess: true }));
      setFormActionNone();
    }
  }, [isConfirmed, showOverlay, setFormActionNone]);

  return (
    <>
      <AssetManagementTitle
        setFormActionNone={setFormActionNone}
        formAction={formAction}
        disabled={isPendingConfirmation}
      />
      <div className="flex flex-wrap justify-between pb-4 -mx-4">
        <div className="w-full px-4 lg:w-1/3">
          <AssetInformationPanel
            setShowEndorsementChain={setShowEndorsementChain}
            tokenRegistryAddress={tokenRegistryAddress}
          />
        </div>
        <div className="w-full px-4 lg:w-1/3">
          <EditableAssetTitle role="Owner" value={beneficiary} isEditable={false} />
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
                data-testid={"cancelSurrenderBtn"}
              >
                Cancel
              </Button>
            </div>
            <div className="w-auto ml-2">
              <Button
                className="bg-rose rounded-xl text-lg text-white py-2 px-3 shadow-none hover:bg-rose-400"
                onClick={handleSurrender}
                disabled={isPendingConfirmation}
                data-testid={"surrenderBtn"}
              >
                {isPendingConfirmation ? <LoaderSpinner data-testid={"loader"} /> : <>Surrender Document</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
