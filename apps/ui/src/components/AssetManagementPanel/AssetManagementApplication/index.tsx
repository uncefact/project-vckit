import { useContractFunctionHook } from "@govtechsg/ethers-contract-hook";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useProviderContext } from "../../../common/contexts/provider";
import { useTokenInformationContext } from "../../../common/contexts/TokenInformationContext";
import { useTokenRegistryContract } from "../../../common/hooks/useTokenRegistryContract";
import { AssetManagementActions } from "../AssetManagementActions";
import { AssetManagementForm } from "../AssetManagementForm";
import { AssetManagementTags } from "../AssetManagementTags";
import { DocumentStatus } from "../../DocumentStatus";

interface AssetManagementApplicationProps {
  isMagicDemo?: boolean;
  tokenId: string;
  tokenRegistryAddress: string;
  setShowEndorsementChain: (payload: boolean) => void;
}

export const AssetManagementApplication: FunctionComponent<AssetManagementApplicationProps> = ({
  isMagicDemo,
  tokenId,
  tokenRegistryAddress,
  setShowEndorsementChain,
}) => {
  const {
    approvedHolder,
    holder,
    approvedBeneficiary,
    beneficiary,
    changeHolder,
    changeHolderState,
    endorseBeneficiary,
    endorseBeneficiaryState,
    transferTo,
    transferToState,
    destroyTokenState,
    destroyToken,
    isSurrendered,
    isTokenBurnt,
    isTitleEscrow,
    approveNewTransferTargets,
    approveNewTransferTargetsState,
    transferToNewEscrow,
    transferToNewEscrowState,
    documentOwner,
    restoreToken,
    restoreTokenState,
  } = useTokenInformationContext();
  const [assetManagementAction, setAssetManagementAction] = useState(AssetManagementActions.None);
  const [account, setAccount] = useState<string | undefined>();
  const { upgradeToMetaMaskSigner, getSigner, getProvider } = useProviderContext();

  const provider = getProvider();
  const { tokenRegistry } = useTokenRegistryContract(tokenRegistryAddress, provider);
  // Check if direct owner is minter, useContractFunctionHook value returns {0: boolean}
  const { call: checkIsMinter, value: isMinter } = useContractFunctionHook(tokenRegistry, "isMinter");

  useEffect(() => {
    const updateAccount = async () => {
      try {
        const signer = getSigner();
        const address = signer ? await signer.getAddress() : undefined;
        setAccount(address);
      } catch {
        setAccount(undefined);
      }
    };
    updateAccount();
  }, [getSigner]);

  useEffect(() => {
    if (isTitleEscrow === false && account) {
      checkIsMinter(account);
    }
  }, [account, checkIsMinter, isTitleEscrow]);
  const onSurrender = () => {
    // Change to surrendered state
    transferTo(tokenRegistryAddress);
  };

  const onDestroyToken = () => {
    destroyToken(tokenId);
  };

  const onRestoreToken = (lastBeneficiary?: string, lastHolder?: string) => {
    if (!lastBeneficiary || !lastHolder) throw new Error("Ownership data is not found");
    restoreToken(lastBeneficiary, lastHolder);
  };

  const onSetFormAction = useCallback(
    (assetManagementActions: AssetManagementActions) => {
      setAssetManagementAction(assetManagementActions);
    },
    [setAssetManagementAction]
  );

  useEffect(() => {
    onSetFormAction(AssetManagementActions.None);
  }, [account, onSetFormAction]); // unset action panel to none, whenever user change metamask account

  return (
    <div id="title-transfer-panel">
      {assetManagementAction === AssetManagementActions.None && (
        // ui design requirement, to not show DocumentStatus & AssetManagementTags when user is on other actions
        <>
          <DocumentStatus isMagicDemo={isMagicDemo} />
          <AssetManagementTags />
        </>
      )}
      <div className="container">
        {isTitleEscrow !== undefined && (
          <AssetManagementForm
            account={account}
            onConnectToWallet={upgradeToMetaMaskSigner}
            beneficiary={beneficiary}
            approvedBeneficiary={approvedBeneficiary}
            holder={holder}
            approvedHolder={approvedHolder}
            documentOwner={documentOwner}
            formAction={assetManagementAction}
            tokenRegistryAddress={tokenRegistryAddress}
            onSetFormAction={onSetFormAction}
            surrenderingState={transferToState}
            destroyTokenState={destroyTokenState}
            onSurrender={onSurrender}
            onTransferHolder={changeHolder}
            holderTransferringState={changeHolderState}
            onEndorseBeneficiary={endorseBeneficiary}
            beneficiaryEndorseState={endorseBeneficiaryState}
            isSurrendered={isSurrendered}
            isTokenBurnt={isTokenBurnt}
            onApproveNewTransferTargets={approveNewTransferTargets}
            approveNewTransferTargetsState={approveNewTransferTargetsState}
            onTransferToNewEscrow={transferToNewEscrow}
            transferToNewEscrowState={transferToNewEscrowState}
            setShowEndorsementChain={setShowEndorsementChain}
            isTitleEscrow={isTitleEscrow}
            isMinter={isMinter?.[0]}
            onDestroyToken={onDestroyToken}
            onRestoreToken={onRestoreToken}
            restoreTokenState={restoreTokenState}
            tokenId={tokenId}
          />
        )}
      </div>
    </div>
  );
};
