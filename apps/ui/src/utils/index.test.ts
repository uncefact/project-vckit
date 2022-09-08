import { addClassNameIfExist, convertSecondsToMinAndSec, isEthereumAddress, getFileName } from "./";

describe("utils/isEthereumAddress", () => {
  it("should work", () => {
    expect(isEthereumAddress("0x")).toEqual(false);
    expect(isEthereumAddress("")).toEqual(false);
    expect(isEthereumAddress("foo")).toEqual(false);
    expect(isEthereumAddress("0x67b5Bc373cAA527Cee654d6A0f629ba1E84fAd02")).toEqual(true);
    expect(isEthereumAddress("0x67b5Bc373cAA527Cee654d6A0f629ba1E84fAd02".toLowerCase())).toEqual(true);
  });
});

describe("convertSecondsToMinAndSec", () => {
  it("should return the correct min and sec based on the payload", () => {
    expect(convertSecondsToMinAndSec(5)).toEqual("0:05m");
    expect(convertSecondsToMinAndSec(59)).toEqual("0:59m");
    expect(convertSecondsToMinAndSec(60)).toEqual("1:00m");
    expect(convertSecondsToMinAndSec(61)).toEqual("1:01m");
    expect(convertSecondsToMinAndSec(730)).toEqual("12:10m");
    expect(convertSecondsToMinAndSec(1065)).toEqual("17:45m");
  });
});

describe("utils/addClassNameIfExist", () => {
  it("should return a non-empty string if classname exists", () => {
    expect(addClassNameIfExist("random-class")).toEqual("random-class");
  });

  it("should return an empty string is no classname is provided", () => {
    expect(addClassNameIfExist(undefined)).toEqual("");
  });
});

describe("utils/getFileName", () => {
  it("should return the file name with the given file path", () => {
    const filePath = "/abc/path2/file.jpeg";
    expect(getFileName(filePath)).toEqual("file.jpeg");
  });

  it("should return the correct file name even if file name does not have an extension", () => {
    const filePath = "/abc/path2/file";
    expect(getFileName(filePath)).toEqual("file");
  });
});
