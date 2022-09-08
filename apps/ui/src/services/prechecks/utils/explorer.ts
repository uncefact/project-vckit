import axios, { AxiosResponse } from "axios";
import { getEtherscanNetworkApiDetails } from "../../../config/config";
import { ChainInfoObject } from "../../../constants/chain-info";
interface ExplorerHeaders {
  "Content-Type": string;
}

interface ExploreParams {
  module: string;
  action: string;
  address: string;
  startblock: string;
  endblock: string;
  page: string;
  offset: string;
  sort: string;
  apikey: string;
}
interface SimplifiedResponse {
  status: number;
  reason: string;
  address?: string;
}

const getHeaders = (): ExplorerHeaders => {
  const headers = {
    "Content-Type": "application/json",
  } as ExplorerHeaders;

  return headers;
};

const getParams = (contractAddress: string, apiKey: string): ExploreParams => {
  const params = {
    module: "account",
    action: "txlist",
    startblock: "0",
    endblock: "99999999",
    page: "1",
    offset: "1",
    sort: "asc",
  } as ExploreParams;

  if (apiKey) {
    params["apikey"] = apiKey;
  }

  if (contractAddress) {
    params["address"] = contractAddress;
  }

  return params;
};

export const getCreationAddressRequest = async (
  contractAddress: string,
  chainInfo: ChainInfoObject,
  apiKey?: string
): Promise<AxiosResponse> => {
  const networkApiDetails = getEtherscanNetworkApiDetails(chainInfo);
  const url = `${networkApiDetails.hostname}/api`;

  if (apiKey === undefined) {
    apiKey = networkApiDetails.apiKey;
  }

  return axios.get(url, { headers: { ...getHeaders() }, params: getParams(contractAddress, apiKey) });
};

const simplifyResponse = (responseData: any): SimplifiedResponse => {
  const responseStatus = responseData?.status?.toString?.();
  const responseMessage = responseData?.message?.toString?.();
  let simplifiedResponse: SimplifiedResponse = { status: 1, reason: "Call Failed" };
  if (responseStatus === "0") {
    if (responseMessage === "No transactions found") {
      simplifiedResponse = { status: 2, reason: "No Transaction Found" };
    }
  } else if (responseStatus === "1") {
    simplifiedResponse = { status: 0, reason: "Call Successful" };
    simplifiedResponse.address = responseData?.result?.[0]?.from;
  }
  return simplifiedResponse;
};

const sendCreationAddressRequest = async (
  contractAddress: string,
  chainInfo: ChainInfoObject,
  apiKey?: string
): Promise<SimplifiedResponse> => {
  const response = await getCreationAddressRequest(contractAddress, chainInfo, apiKey);
  const responseData = response.data;
  return simplifyResponse(responseData);
};

export const getCreationAddress = async (
  contractAddress: string,
  chainInfo: ChainInfoObject,
  apiKey?: string
): Promise<string | undefined> => {
  return await (
    await sendCreationAddressRequest(contractAddress, chainInfo, apiKey)
  ).address;
};

export const checkCreationAddress = async ({
  contractAddress,
  network,
  userAddress,
  strict,
  apiKey,
}: {
  contractAddress: string;
  network: ChainInfoObject;
  userAddress: string;
  strict: boolean;
  apiKey?: string;
}): Promise<boolean> => {
  const simplifiedResponse = await sendCreationAddressRequest(contractAddress, network, apiKey);
  if (simplifiedResponse.status === 0) {
    return simplifiedResponse?.address?.toLowerCase?.() === userAddress.toLowerCase();
  } else if (simplifiedResponse.status === 1) {
    return !strict;
  }
  return false;
};
