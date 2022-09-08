import { decodeQrCode, encodeQrCode, getDocumentNetwork } from "./utils";

jest.mock("../../appConfig", () => ({
  VCKIT_DOMAIN: "vckit-test.com",
  PROTOCOL: "http",
  VCKIT_WEBSITE: "http://vckit-test.com",
}));

describe("encodeQrCode", () => {
  it("should encode the url into the correct format", () => {
    const qrCode = {
      type: "url",
      payload: {
        uri: "https://testurl.com",
        key: "123",
        permittedActions: ["STORE"],
        redirect: "test Site",
      },
    };

    expect(encodeQrCode(qrCode)).toStrictEqual(
      "http://vckit-test.com?q=%7B%22type%22%3A%22url%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftesturl.com%22%2C%22key%22%3A%22123%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22test%20Site%22%7D%7D"
    );
  });
});

describe("decodeQrCode", () => {
  it("decodes an action correctly regardless of trailing slash", () => {
    const encodedQrCodeSlash =
      "http://vckit-test.com/?q=%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";
    const encodedQrCodeNoSlash =
      "http://vckit-test.com?q=%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";

    expect(decodeQrCode(encodedQrCodeSlash)).toStrictEqual({
      uri: "https://sample.domain/document/id?q=abc#123",
    });
    expect(decodeQrCode(encodedQrCodeNoSlash)).toStrictEqual({
      uri: "https://sample.domain/document/id?q=abc#123",
    });
  });

  it("throws when qr code is malformed", () => {
    const encodedQrCode = "http://%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";
    expect(() => decodeQrCode(encodedQrCode)).toThrow("not formatted");
  });
});

describe("getDocumentNetwork", () => {
  it("should get the network details based on the network given", () => {
    expect(getDocumentNetwork("ropsten")).toStrictEqual({ network: { chain: "ETH", chainId: "3" } });
  });

  it("should throw an error when the network is not in the list", () => {
    // @ts-expect-error: Test if the error will throw when its not one of the type in the Network enum.
    expect(() => getDocumentNetwork("abc")).toThrow("Unsupported network abc");
  });
});
