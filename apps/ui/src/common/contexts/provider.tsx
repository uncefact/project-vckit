import { ethers, providers, Signer } from "ethers";
import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from "react";
import { INFURA_API_KEY } from "../../config";
import { utils } from "@govtechsg/oa-verify";
import { magic } from "./helpers";
import { ChainId, ChainInfoObject } from "../../constants/chain-info";
import { NoMetaMaskError, UnsupportedNetworkError } from "../errors";
import { getChainInfo } from "../utils/chain-utils";

export enum SIGNER_TYPE {
  IDENTITY = "Identity",
  METAMASK = "Metamask",
  MAGIC = "Magic",
}

// Utility function for use in non-react components that cannot get through hooks
let currentProvider: providers.Provider | undefined;
export const getCurrentProvider = (): providers.Provider | undefined => currentProvider;

const createProvider = (chainId: ChainId) =>
  chainId === ChainId.Local
    ? new providers.JsonRpcProvider()
    : utils.generateProvider({
        network: getChainInfo(chainId).networkName,
        providerType: "infura",
        apiKey: INFURA_API_KEY,
      });

interface ProviderContextProps {
  providerType: SIGNER_TYPE;
  upgradeToMetaMaskSigner: () => Promise<void>;
  upgradeToMagicSigner: () => Promise<void>;
  changeNetwork: (chainId: ChainId) => void;
  reloadNetwork: () => Promise<void>;
  getTransactor: () => Signer | providers.Provider | undefined;
  getSigner: () => Signer | undefined;
  getProvider: () => providers.Provider | undefined;
  supportedChainInfoObjects: ChainInfoObject[];
  currentChainId: ChainId | undefined;
}

export const ProviderContext = createContext<ProviderContextProps>({
  providerType: SIGNER_TYPE.IDENTITY,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  upgradeToMetaMaskSigner: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  upgradeToMagicSigner: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  changeNetwork: async (_chainId: ChainId) => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reloadNetwork: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getTransactor: () => undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getProvider: () => undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getSigner: () => undefined,
  supportedChainInfoObjects: [],
  currentChainId: undefined,
});

interface Ethereum extends providers.ExternalProvider, providers.BaseProvider {
  enable: () => void;
}

declare global {
  interface Window {
    ethereum: Ethereum;
    web3: {
      currentProvider: providers.ExternalProvider;
    };
  }
}

interface ProviderContextProviderProps {
  children: React.ReactNode;
  networks: ChainInfoObject[];
  defaultChainId: ChainId;
}

export const ProviderContextProvider: FunctionComponent<ProviderContextProviderProps> = ({
  children,
  networks: supportedChainInfoObjects,
  defaultChainId,
}) => {
  const [providerType, setProviderType] = useState<SIGNER_TYPE>(SIGNER_TYPE.IDENTITY);
  const [isConnected, setIsConnected] = useState<boolean>();
  const [currentChainId, setCurrentChainId] = useState<ChainId | undefined>(defaultChainId);

  const isSupportedNetwork = (chainId: ChainId) =>
    supportedChainInfoObjects.some((chainInfoObj) => chainInfoObj.chainId === chainId);

  const defaultProvider = isSupportedNetwork(defaultChainId) ? createProvider(defaultChainId) : undefined;
  const [providerOrSigner, setProviderOrSigner] = useState<providers.Provider | Signer | undefined>(defaultProvider);

  const updateProviderOrSigner = async (newProviderOrSigner: typeof providerOrSigner) => {
    try {
      if (!Signer.isSigner(newProviderOrSigner)) {
        setIsConnected(false);
      } else {
        await (newProviderOrSigner as Signer).getAddress();
        setIsConnected(true);
      }
    } catch (e) {
      setIsConnected(false);
    }
    setProviderOrSigner(newProviderOrSigner);
  };

  const changeNetwork = async (chainId: ChainId) => {
    if (!isSupportedNetwork(chainId)) throw new UnsupportedNetworkError(chainId);

    const chainInfo = getChainInfo(chainId);

    try {
      const web3provider = getWeb3Provider();
      await requestSwitchChain(chainId);
      await updateProviderOrSigner(web3provider.getSigner());
    } catch (e: unknown) {
      if (e instanceof NoMetaMaskError) {
        console.warn(e.message);
        await updateProviderOrSigner(createProvider(chainInfo.chainId));
      } else {
        throw e;
      }
    }
  };

  const getProvider = useCallback(() => {
    if (providers.Provider.isProvider(providerOrSigner)) return providerOrSigner;
    if (Signer.isSigner(providerOrSigner)) return providerOrSigner.provider;
    return undefined;
  }, [providerOrSigner]);

  const getSigner = useCallback(
    () => (isConnected ? (providerOrSigner as Signer) : undefined),
    [isConnected, providerOrSigner]
  );

  const getTransactor = useCallback(() => getSigner() ?? getProvider(), [getProvider, getSigner]);

  const getWeb3Provider = () => {
    const { ethereum, web3 } = window;
    const metamaskExtensionNotFound = typeof ethereum === "undefined" || typeof web3 === "undefined";
    if (metamaskExtensionNotFound || !ethereum.request) throw new NoMetaMaskError();

    const injectedWeb3 = ethereum || web3.currentProvider;
    if (!injectedWeb3) throw new Error("No injected web3 provider found");
    return new ethers.providers.Web3Provider(injectedWeb3, "any");
  };

  const requestSwitchChain = async (chainId: ChainId) => {
    const { ethereum } = window;
    if (!ethereum || !ethereum.request) return;
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (e: any) {
      if (e.code === -32601) {
        // Possibly on localhost which doesn't support the call
        return console.error(e);
      }
      throw e;
    }
  };

  const initializeMetaMaskSigner = async () => {
    const web3Provider = getWeb3Provider();
    const provider = getProvider();
    const network = await (provider ? provider.getNetwork() : web3Provider.getNetwork());
    await web3Provider.send("eth_requestAccounts", []);
    await requestSwitchChain(network.chainId);

    await updateProviderOrSigner(web3Provider.getSigner());
    setProviderType(SIGNER_TYPE.METAMASK);
  };

  const initialiseMagicSigner = async () => {
    // needs to be cast as any before https://github.com/magiclabs/magic-js/issues/83 has been merged.
    const magicProvider = new ethers.providers.Web3Provider(magic.rpcProvider as any);

    await updateProviderOrSigner(magicProvider.getSigner());
    setProviderType(SIGNER_TYPE.MAGIC);
  };

  const upgradeToMetaMaskSigner = async () => {
    return initializeMetaMaskSigner();
  };

  const upgradeToMagicSigner = async () => {
    if (providerType === SIGNER_TYPE.MAGIC) return;
    return initialiseMagicSigner();
  };

  const reloadNetwork = async () => {
    const provider = getProvider();
    if (!provider) throw new UnsupportedNetworkError();

    const chainId = (await provider.getNetwork()).chainId;
    await changeNetwork(chainId);
  };

  useEffect(() => {
    currentProvider = getProvider();
    const updateChainId = async () => {
      const provider = getProvider();
      if (!provider) {
        setCurrentChainId(undefined);
      } else {
        const network = await provider.getNetwork();
        setCurrentChainId(network.chainId);
      }
    };
    updateChainId();
  }, [getProvider]);

  useEffect(() => {
    if (!window.ethereum) return;

    const chainChangedHandler = async (chainIdHex: string) => {
      try {
        await changeNetwork(parseInt(chainIdHex, 16));
      } catch (e) {
        // Clear provider/signer when user selects an unsupported network
        await updateProviderOrSigner(undefined);
        console.warn("An unsupported network has been selected.", e);
        throw e;
      }
    };

    window.ethereum.on("accountsChanged", reloadNetwork).on("chainChanged", chainChangedHandler);

    const initialiseWallet = async () => {
      try {
        const web3Provider = getWeb3Provider();
        const provider = getProvider();
        if (!provider) return;
        const [web3Network, appNetwork] = await Promise.all([web3Provider.getNetwork(), provider.getNetwork()]);
        if (web3Network.chainId === appNetwork.chainId) setProviderOrSigner(web3Provider.getSigner().provider);
      } catch (e) {
        if (e instanceof NoMetaMaskError) {
          console.warn(e.message);
        } else {
          throw e;
        }
      }
    };
    initialiseWallet();

    return () => {
      if (!window.ethereum) return;
      window.ethereum.off("chainChanged").off("accountsChanged");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProviderContext.Provider
      value={{
        providerType,
        upgradeToMetaMaskSigner,
        upgradeToMagicSigner,
        changeNetwork,
        reloadNetwork,
        getProvider,
        getTransactor,
        getSigner,
        supportedChainInfoObjects,
        currentChainId,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export const useProviderContext = (): ProviderContextProps => useContext<ProviderContextProps>(ProviderContext);
