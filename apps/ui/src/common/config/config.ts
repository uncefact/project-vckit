import { ChainInfoObject } from "../../constants/chain-info";

export const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || "6028cd7708c54c91a90df6cefd9bf1a9"; // TODO: inject project id into env variable

export const ETHERSCAN_API_KEY = {
  ETH: process.env.REACT_APP_API_KEY_ETH,
  MATIC: process.env.REACT_APP_API_KEY_MATIC,
};

// Addresses retrieved from https://docs.opengsn.org/gsn-provider/networks.html
interface GsnRelayConfig {
  relayHub: string;
  stakeManager: string;
  forwarder: string;
  gasPrice: number;
}
interface EtherscanNetworkApiDetails {
  apiKey: string;
  hostname: string;
}

const ropstenGsnRelayConfig = {
  relayHub: "0x29e41C2b329fF4921d8AC654CEc909a0B575df20",
  stakeManager: "0x762A4D5F51d8b2F9bA1B0412B45687cE0EfFD92B",
  forwarder: "0x25CEd1955423BA34332Ec1B60154967750a0297D",
  gasPrice: 20000000000, // 20 Gwei
};

const homesteadGsnRelayConfig = {
  relayHub: "0xB1E47968aD4909b9eb693c212feA22D0419D2D56",
  stakeManager: "0xcAA46E3a5D2c3c07A0C4F7723c7977c3e643C2B1",
  forwarder: "0xa530F85085C6FE2f866E7FdB716849714a89f4CD",
  gasPrice: 20000000000, // 20 Gwei
};

export const getGSNRelayConfig = (networkId?: string): GsnRelayConfig => {
  if (networkId === "ropsten") return ropstenGsnRelayConfig;
  return homesteadGsnRelayConfig;
};

export const getHttpProviderUri = (networkId: string): string => {
  if (networkId === "local") return `http://localhost:8545`;
  if (networkId === "homestead") return `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`;
  return `https://${networkId}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const getEtherscanNetworkApiDetails = (chainInfo: ChainInfoObject): EtherscanNetworkApiDetails => {
  const apiKey = (ETHERSCAN_API_KEY as any)[chainInfo.chain];
  return { hostname: chainInfo.explorerApiUrl, apiKey: apiKey } as EtherscanNetworkApiDetails;
};
