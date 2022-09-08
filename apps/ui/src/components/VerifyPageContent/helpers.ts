import { ChainId } from "../../constants/chain-info";
import { getChainInfo } from "../../common/utils/chain-utils";

type LoadCertificate = (certificate: any) => void;

export const getDemoCert = (chainId: ChainId): string => {
  const networkName = getChainInfo(chainId).networkName;
  return `/static/demo/${networkName}.tt`;
};

export const loadDemoCertificate = (loadCertificate: LoadCertificate, chainId: ChainId): void => {
  window
    .fetch(getDemoCert(chainId))
    .then((res) => res.json())
    .then((res) => {
      loadCertificate(res);
    });
};
