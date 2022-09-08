import { ButtonIcon, OverlayAddressBook, useOverlayContext } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Book } from "react-feather";
import { usePersistedConfigFile } from "../../../common/hooks/usePersistedConfigFile";

interface TransferableRecordForm {
  beneficiaryAddress: string;
  holderAddress: string;
  setBeneficiaryAddress: (address: string) => void;
  setHolderAddress: (address: string) => void;
}

export const TransferableRecordForm: FunctionComponent<TransferableRecordForm> = ({
  beneficiaryAddress,
  setBeneficiaryAddress,
  holderAddress,
  setHolderAddress,
}) => {
  const { showOverlay } = useOverlayContext();
  const { configFile } = usePersistedConfigFile();

  const onOverlayHandler = (onAddressSelected: (address: string) => void): void => {
    showOverlay(
      <OverlayAddressBook
        title="Address Book"
        onAddressSelected={onAddressSelected}
        network={configFile?.network ?? "local"}
      />
    );
  };

  return (
    <div data-testid="transferable-record-form" className="border-b border-solid border-gray-300 pb-8 mb-8">
      <h4 className="pb-4">Transferable Record Owner</h4>
      <div className="mb-3">
        <div>Owner</div>
        <div className="w-full flex">
          <input
            data-testid="transferable-record-beneficiary-input"
            className="custom-input mr-2"
            value={beneficiaryAddress}
            type="text"
            onChange={(e) => setBeneficiaryAddress(e.target.value)}
          />
          <ButtonIcon
            className="bg-white text-cerulean-200 hover:bg-cloud-100"
            onClick={() => onOverlayHandler(setBeneficiaryAddress)}
          >
            <Book />
          </ButtonIcon>
        </div>
      </div>
      <div>
        <div>Holder</div>
        <div className="w-full flex">
          <input
            data-testid="transferable-record-holder-input"
            className="custom-input mr-2"
            value={holderAddress}
            type="text"
            onChange={(e) => setHolderAddress(e.target.value)}
          />
          <ButtonIcon
            className="bg-white text-cerulean-200 hover:bg-cloud-100"
            onClick={() => onOverlayHandler(setHolderAddress)}
          >
            <Book />
          </ButtonIcon>
        </div>
      </div>
    </div>
  );
};
