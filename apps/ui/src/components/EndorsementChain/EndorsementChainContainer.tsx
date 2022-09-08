import React, { FunctionComponent } from "react";
import { useEndorsementChain } from "../../common/hooks/useEndorsementChain";
import { EndorsementChainLayout } from "./EndorsementChainLayout";

interface EndorsementChainContainer {
  tokenRegistry: string;
  tokenId: string;
  setShowEndorsementChain: (payload: boolean) => void;
}

export const EndorsementChainContainer: FunctionComponent<EndorsementChainContainer> = ({
  tokenRegistry,
  tokenId,
  setShowEndorsementChain,
}) => {
  const endorsementChainProps = useEndorsementChain(tokenRegistry, tokenId);
  return <EndorsementChainLayout {...endorsementChainProps} setShowEndorsementChain={setShowEndorsementChain} />;
};
