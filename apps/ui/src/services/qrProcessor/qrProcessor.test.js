import { decodeQrCode, processQrCode } from "./index";

const encodeQrCode = (payload) => `https://action.openattestation.com?q=${encodeURIComponent(JSON.stringify(payload))}`;
const encodeQrCodeWithAnchor = (payload, anchor) =>
  `https://action.openattestation.com?q=${encodeURIComponent(JSON.stringify(payload))}#${encodeURIComponent(
    JSON.stringify(anchor)
  )}`;

describe("decodeQrCode", () => {
  it("decodes an action correctly", () => {
    const sampleAction = {
      uri: "https://sample.domain/document/id?q=abc#123",
    };

    const { action, anchor } = decodeQrCode(encodeQrCode(sampleAction));
    expect(action).toStrictEqual(sampleAction);
    expect(anchor).toStrictEqual({});
  });

  it("decodes an action and anchor correctly", () => {
    const sampleAction = {
      uri: "https://sample.domain/document/id?q=abc#123",
    };
    const sampleAnchor = { key: "secret" };

    const { action, anchor } = decodeQrCode(encodeQrCodeWithAnchor(sampleAction, sampleAnchor));
    expect(action).toStrictEqual(sampleAction);
    expect(anchor).toStrictEqual(sampleAnchor);
  });

  it("throws error when qr code is malformed", () => {
    const encodedQrCode = "http://%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";
    expect(() => decodeQrCode(encodedQrCode)).toThrow(`Invalid URL: ${encodedQrCode}`);
  });
});

describe("processQrCode", () => {
  it("throws error when action type is not supported", async () => {
    const document = { name: "foo" };
    const type = "MANY_DOCUMENT";
    const actionUri = { payload: document, type };

    await expect(() => processQrCode(encodeQrCode(actionUri))).rejects.toThrow(
      `The type ${type} provided from the action is not supported`
    );
  });

  it("extracts the correct payload from a QR code", async () => {
    const document = { name: "foo" };
    const sampleAction = { payload: document, type: "DOCUMENT" };

    const results = await processQrCode(encodeQrCode(sampleAction));
    expect(results).toStrictEqual({ payload: document, anchor: {} });
  });

  it("extracts the correct payload and anchor from a QR code", async () => {
    const document = { name: "foo" };
    const sampleAction = { payload: document, type: "DOCUMENT" };
    const sampleAnchor = { key: "secret" };

    const results = await processQrCode(`${encodeQrCodeWithAnchor(sampleAction, sampleAnchor)}`);
    expect(results).toStrictEqual({ payload: document, anchor: sampleAnchor });
  });
});
