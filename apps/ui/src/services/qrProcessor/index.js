import { getLogger } from "../../utils/logger";

const { error } = getLogger("services:qrProcessor");

export const decodeQrCode = (qrCode) => {
  const url = new URL(qrCode);
  const actionStr = url.searchParams.get("q");
  const anchorStr = decodeURIComponent(url.hash.substr(1));

  if (url.origin !== "https://action.openattestation.com" || !actionStr)
    throw new Error("QR Code is not formatted to TradeTrust specifications");

  const action = JSON.parse(actionStr);
  const anchor = anchorStr ? JSON.parse(anchorStr) : {};

  return { action, anchor };
};

export const processQrCode = async (qrCode) => {
  try {
    const { action, anchor } = decodeQrCode(qrCode);
    if (action.type !== "DOCUMENT")
      throw new Error(`The type ${action.type} provided from the action is not supported`);
    return { payload: action.payload, anchor };
  } catch (e) {
    error(e.message);
    throw new Error(e.message);
  }
};
