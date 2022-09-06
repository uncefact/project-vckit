import { UnsupportedNetworkError } from "../errors";
import { ChainId, ChainInfo, ChainInfoObject } from "../../constants/chain-info";
import { IS_DEVELOPMENT } from "../../config";
import { MAIN_NETWORKS, TEST_NETWORKS } from "../../config/chain-config";

/**
 * Gets the ChainInfoObject of a supported chain ID.
 * Throws UnsupportedNetworkError if chain ID is not supported.
 * @param chainId Chain ID of network
 */
export const getChainInfo = (chainId: ChainId): ChainInfoObject => {
  const res = ChainInfo[chainId];
  if (!res) throw new UnsupportedNetworkError(chainId);
  return res;
};

/**
 * Helper function to get chain info from network name.
 * @param networkName Network name used by ethers standard providers and in OA
 */
export const getChainInfoFromNetworkName = (networkName: string): ChainInfoObject => {
  const res = Object.keys(ChainInfo)
    .map((chainId) => ChainInfo[Number(chainId) as ChainId])
    .find((chainInfo) => chainInfo.networkName === networkName);
  if (!res) throw new UnsupportedNetworkError(networkName);
  return res;
};

/**
 * Returns an array of supported chain info based on the environment type.
 * Will include local chain if site is running under test or localhost environment.
 */
export const getSupportedChainInfo = (): ChainInfoObject[] => {
  const isLocal = window.location.host.indexOf("localhost") > -1;
  const isTestEnv = process.env.NODE_ENV === "test";
  const networks = IS_DEVELOPMENT ? [...TEST_NETWORKS] : [...MAIN_NETWORKS];
  if (isTestEnv || isLocal) networks.push(ChainId.Local);
  return networks.map((chainId) => getChainInfo(chainId));
};
