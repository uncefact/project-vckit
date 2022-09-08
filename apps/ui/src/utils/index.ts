import { utils } from "ethers";
import { compareDesc, compareAsc } from "date-fns";
import { ChainId } from "../constants/chain-info";
import { getChainInfo } from "../common/utils/chain-utils";
import { NewsTag } from "../components/News/types";

export * from "./utils";

export const makeEtherscanAddressURL = (address: string, chainId: ChainId): string => {
  const baseUrl = getChainInfo(chainId).explorerUrl;
  return new URL(`/address/${address}`, baseUrl).href;
};

export const isEthereumAddress = (address: string): boolean | undefined => {
  try {
    if (utils.getAddress(address)) {
      return true;
    }
  } catch (e: any) {
    if (e.reason === "invalid address") {
      return false;
    } else throw e;
  }
};

export const convertSecondsToMinAndSec = (seconds: number): string => {
  const sec = seconds % 60;
  return `${~~(seconds / 60)}:${sec < 10 ? `0${sec}` : sec}m`;
};

export const getSortedByDateDesc = (items: any[]): any[] => {
  items.sort((a, b): number => {
    return compareDesc(new Date(a.attributes.date), new Date(b.attributes.date));
  });

  return items;
};

export const getSortedByDateAsc = (items: any[]): any[] => {
  items.sort((a, b): number => {
    return compareAsc(new Date(a.attributes.date), new Date(b.attributes.date));
  });

  return items;
};

// https://docs.netlify.com/forms/setup/#submit-javascript-rendered-forms-with-ajax
export const encode: any = (data: { [x: string]: string | number | boolean }) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export const addClassNameIfExist = (className?: string): string => {
  if (!className) {
    return "";
  }

  return className;
};

/**
 * Fetch CMS content according to the context provided and returns an array of cms content.
 * 'context' in this case is some directory that is used as a base for resolving paths to modules.
 *
 * @param context  directory in which the contents are stored
 * @param type     this applies for news content only. It is the type of news article. (other CMS content will be undefined)
 * @returns array of CMS contents
 */
export const getCmsContentWithSlug = (context: __WebpackModuleApi.RequireContext, type?: NewsTag): any[] => {
  const cmsContent: any[] = [];

  context.keys().forEach((filename: string) => {
    const content = context(filename);
    const slug = filename.replace("./", "").replace(".md", "");
    cmsContent.push({
      slug,
      type,
      ...content,
    });
  });

  return cmsContent;
};

/**
 * Takes a file path, i.e. "static/img/image.png" , and returns the file name, i.e. "image.png".
 *
 * @param filePath a string that represents the filePath i.e. "static/img/image.png"
 * @returns name of file i.e. "image.png"
 */
export const getFileName = (filePath: string): string => {
  return (
    filePath.match(/[A-Za-z0-9_\-\.]+\.[A-Za-z0-9]+$/)?.shift() ||
    filePath.match(/[A-Za-z0-9_\-\.]+$/)?.shift() ||
    filePath
  );
};
