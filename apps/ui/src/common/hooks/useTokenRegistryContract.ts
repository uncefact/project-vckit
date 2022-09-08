import { useState, useEffect } from "react";
import { TradeTrustErc721Factory } from "@govtechsg/token-registry";
import { TradeTrustErc721 } from "@govtechsg/token-registry/types/TradeTrustErc721";
import { providers, Signer } from "ethers";

export const useTokenRegistryContract = (
  address?: string,
  provider?: providers.Provider | Signer
): {
  tokenRegistry?: TradeTrustErc721;
} => {
  const [tokenRegistry, setTokenRegistry] = useState<TradeTrustErc721>();

  useEffect(() => {
    if (!address || !provider) return;
    const instance = TradeTrustErc721Factory.connect(address, provider);
    setTokenRegistry(instance);
    return () => {
      setTokenRegistry(undefined);
    };
  }, [address, provider]);

  return { tokenRegistry };
};
