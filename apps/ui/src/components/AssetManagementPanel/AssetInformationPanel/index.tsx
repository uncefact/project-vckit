import React, { FunctionComponent } from "react";
import { AddressInfo } from "../../AddressInfo";
import { ExternalLinkEtherscanAddress } from "../../UI/ExternalLink";

interface AssetInformationPanelProps {
  tokenRegistryAddress: string;
  setShowEndorsementChain: (payload: boolean) => void;
  className?: string;
}

export const AssetInformationPanel: FunctionComponent<AssetInformationPanelProps> = ({
  tokenRegistryAddress,
  setShowEndorsementChain,
  className,
}) => {
  return (
    <div className={`py-4 ${className}`}>
      <AddressInfo title="NFT information" name="" resolvedBy="" source="">
        <ExternalLinkEtherscanAddress name="View NFT Registry" address={tokenRegistryAddress} />
        <div
          onClick={() => setShowEndorsementChain(true)}
          className="cursor-pointer transition-colors duration-200 ease-out text-cerulean-200 hover:text-cerulean"
          id="endorsement-chain-button"
        >
          <h5 className="text-cerulean-200 hover:text-cerulean">View Endorsement Chain</h5>
        </div>
      </AddressInfo>
    </div>
  );
};
