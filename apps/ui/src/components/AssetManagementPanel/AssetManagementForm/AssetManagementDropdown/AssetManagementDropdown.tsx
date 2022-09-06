import { Dropdown, DropdownItem } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { AssetManagementActions } from "./../../AssetManagementActions";

interface AssetManagementDropdownProps {
  onSetFormAction: (nextFormAction: AssetManagementActions) => void;
  canSurrender: boolean;
  canHandleSurrender?: boolean;
  canChangeHolder: boolean;
  canEndorseBeneficiary: boolean;
  canNominateBeneficiaryHolder: boolean;
  canEndorseTransfer: boolean;
}

export const AssetManagementDropdown: FunctionComponent<AssetManagementDropdownProps> = ({
  onSetFormAction,
  canSurrender,
  canHandleSurrender,
  canChangeHolder,
  canEndorseBeneficiary,
  canNominateBeneficiaryHolder,
  canEndorseTransfer,
}) => {
  return (
    <Dropdown
      data-testid="manageAssetDropdown"
      dropdownButtonText="Manage Assets"
      className="bg-cerulean font-bold text-white rounded-xl text-lg py-2 px-3 hover:bg-cerulean-300 w-30"
      classNameMenu="lg:right-0"
    >
      {canChangeHolder && (
        <DropdownItem
          className="active:bg-cloud-200 active:text-white"
          data-testid={"transferHolderDropdown"}
          onClick={() => onSetFormAction(AssetManagementActions.TransferHolder)}
        >
          Transfer holdership
        </DropdownItem>
      )}
      {canEndorseBeneficiary && (
        <DropdownItem
          className="active:bg-cloud-200 active:text-white"
          data-testid={"endorseBeneficiaryDropdown"}
          onClick={() => onSetFormAction(AssetManagementActions.EndorseBeneficiary)}
        >
          Endorse change of ownership
        </DropdownItem>
      )}
      {canNominateBeneficiaryHolder && (
        <DropdownItem
          className="active:bg-cloud-200 active:text-white"
          data-testid={"nominateBeneficiaryHolderDropdown"}
          onClick={() => onSetFormAction(AssetManagementActions.NominateBeneficiaryHolder)}
        >
          Nominate change of ownership
        </DropdownItem>
      )}
      {canSurrender && (
        <DropdownItem
          className="active:bg-cloud-200 active:text-white"
          data-testid={"surrenderDropdown"}
          onClick={() => onSetFormAction(AssetManagementActions.Surrender)}
        >
          Surrender document
        </DropdownItem>
      )}
      {canHandleSurrender && (
        <>
          <DropdownItem
            className="active:bg-cloud-200 active:text-white"
            data-testid={"acceptSurrenderDropdown"}
            onClick={() => onSetFormAction(AssetManagementActions.AcceptSurrendered)}
          >
            Accept surrender of document
          </DropdownItem>
          <DropdownItem
            className="active:bg-cloud-200 active:text-white"
            data-testid={"rejectSurrenderDropdown"}
            onClick={() => onSetFormAction(AssetManagementActions.RejectSurrendered)}
          >
            Reject surrender of document
          </DropdownItem>
        </>
      )}

      {canEndorseTransfer && (
        <DropdownItem
          className="active:bg-cloud-200 active:text-white"
          data-testid={"endorseTransferDropdown"}
          onClick={() => onSetFormAction(AssetManagementActions.EndorseTransfer)}
        >
          Endorse Transfer of ownership
        </DropdownItem>
      )}
    </Dropdown>
  );
};
