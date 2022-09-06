import React, { FunctionComponent } from "react";
import { makeEtherscanAddressURL } from "../../../utils";
import { useProviderContext } from "../../../common/contexts/provider";

interface ExternalLinkProps {
  name: string;
  href: string;
}

interface ExternalLinkEtherscanAddressProps {
  name: string;
  address: string;
  className?: string;
}

export const ExternalLink: FunctionComponent<ExternalLinkProps> = ({ name, href, ...props }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      <h5>{name}</h5>
    </a>
  );
};

export const ExternalLinkEtherscanAddress: FunctionComponent<ExternalLinkEtherscanAddressProps> = ({
  name,
  address,
  ...props
}) => {
  const { currentChainId } = useProviderContext();
  const href = currentChainId ? makeEtherscanAddressURL(address, currentChainId) : "#";

  return <ExternalLink name={name} href={href} {...props} />;
};
