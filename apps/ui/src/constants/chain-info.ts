export interface ChainInfoObject {
  label: string;
  chain: string;
  iconImage: string;
  chainId: ChainId;
  networkName: string; // network name that aligns with existing NETWORK_NAME
  explorerUrl: string;
  explorerApiUrl: string;
}

type ChainInfo = Record<ChainId, ChainInfoObject>;

export enum ChainId {
  // Localhost
  Local = 1337,

  // Ethereum Mainnet
  Ethereum = 1,

  // Ethereum Testnet
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,

  // Polygon
  Polygon = 137,
  PolygonMumbai = 80001,
}

export const ChainInfo: ChainInfo = {
  [ChainId.Local]: {
    label: "Local",
    chain: "ETH",
    chainId: ChainId.Local,
    iconImage: "/static/images/networks/ethereum.gif",
    networkName: "local",
    explorerUrl: "https://localhost/explorer",
    explorerApiUrl: "NIL",
    // Is there a api for the ganache or sth
  },
  [ChainId.Ethereum]: {
    label: "Ethereum",
    chain: "ETH",
    chainId: ChainId.Ethereum,
    iconImage: "/static/images/networks/ethereum.gif",
    networkName: "homestead",
    explorerUrl: "https://etherscan.io",
    explorerApiUrl: "https://api.etherscan.io",
  },
  [ChainId.Ropsten]: {
    label: "Ropsten",
    chain: "ETH",
    chainId: ChainId.Ropsten,
    iconImage: "/static/images/networks/ethereum.gif",
    networkName: "ropsten",
    explorerUrl: "https://ropsten.etherscan.io",
    explorerApiUrl: "https://api-ropsten.etherscan.io",
  },
  [ChainId.Rinkeby]: {
    label: "Rinkeby",
    chain: "ETH",
    chainId: ChainId.Rinkeby,
    iconImage: "/static/images/networks/ethereum.gif",
    networkName: "rinkeby",
    explorerUrl: "https://rinkeby.etherscan.io",
    explorerApiUrl: "https://api-rinkeby.etherscan.io",
  },
  [ChainId.Goerli]: {
    label: "Goerli",
    chain: "ETH",
    chainId: ChainId.Goerli,
    iconImage: "/static/images/networks/ethereum.gif",
    networkName: "goerli",
    explorerUrl: "https://goerli.etherscan.io",
    explorerApiUrl: "https://api-goerli.etherscan.io",
  },
  [ChainId.Kovan]: {
    label: "Kovan",
    chain: "ETH",
    chainId: ChainId.Kovan,
    iconImage: "/static/images/networks/ethereum.gif",
    networkName: "kovan",
    explorerUrl: "https://kovan.etherscan.io",
    explorerApiUrl: "https://api-kovan.etherscan.io",
  },
  [ChainId.Polygon]: {
    label: "Polygon (Beta)",
    chain: "MATIC",
    chainId: ChainId.Polygon,
    iconImage: "/static/images/networks/polygon.gif",
    networkName: "matic",
    explorerUrl: "https://polygonscan.com",
    explorerApiUrl: "https://api.polygonscan.com",
  },
  [ChainId.PolygonMumbai]: {
    label: "Polygon Mumbai",
    chain: "MATIC",
    chainId: ChainId.PolygonMumbai,
    iconImage: "/static/images/networks/polygon.gif",
    networkName: "maticmum",
    explorerUrl: "https://mumbai.polygonscan.com",
    explorerApiUrl: "https://api-testnet.polygonscan.com",
  },
};
