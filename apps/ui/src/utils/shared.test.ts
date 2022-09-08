import { getChainId, WrappedOrSignedOpenAttestationDocument } from "./shared";
import ebl from "../test/fixture/ebl.json";
import invoice from "../test/fixture/v3/invoice-ropsten.json";
import v2DID from "../test/fixture/sample-dns-did-verified.json";
import v3DID from "../test/fixture/v3/dns-did-signed.json";

describe("getChainId", () => {
  it("should return the correct chainId for v2 document", () => {
    const document = {
      ...ebl,
      data: { ...ebl.data, network: { chain: "ETH", chainId: "3" } },
    } as unknown as WrappedOrSignedOpenAttestationDocument;
    expect(getChainId(document)).toStrictEqual(3);
  });

  it("should return 'undefined' when there is not network for v2 document", () => {
    expect(getChainId(ebl as unknown as WrappedOrSignedOpenAttestationDocument)).toStrictEqual(undefined);
  });

  it("should throw an error when the chainId is not in the network object for v2 document", () => {
    const document = {
      ...ebl,
      data: { ...ebl.data, network: { chain: "ETH" } },
    } as unknown as WrappedOrSignedOpenAttestationDocument;
    expect(() => getChainId(document)).toThrow("Invalid Document, please use a valid document.");
  });

  it("should throw an error when the chainId is not in the list of networks for v2 document", () => {
    const document = {
      ...ebl,
      data: { ...ebl.data, network: { chain: "ETH", chainId: "8" } },
    } as unknown as WrappedOrSignedOpenAttestationDocument;
    expect(() => getChainId(document)).toThrow("Invalid Document, please use a valid document.");
  });

  it("should return 'undefined' when a V2 did document is being dropped", () => {
    expect(getChainId(v2DID as unknown as WrappedOrSignedOpenAttestationDocument)).toStrictEqual(undefined);
  });

  it("should return the correct chainId for v3 document", () => {
    const document = {
      ...invoice,
      network: { chain: "ETH", chainId: "3" },
    } as unknown as WrappedOrSignedOpenAttestationDocument;
    expect(getChainId(document)).toStrictEqual(3);
  });

  it("should return 'undefined' when there is not network for v3 document", () => {
    expect(getChainId(invoice as unknown as WrappedOrSignedOpenAttestationDocument)).toStrictEqual(undefined);
  });

  it("should throw an error when the chainId is not in the network object for v3 document", () => {
    const document = {
      ...invoice,
      network: { chain: "ETH" },
    } as unknown as WrappedOrSignedOpenAttestationDocument;
    expect(() => getChainId(document)).toThrow("Invalid Document, please use a valid document.");
  });

  it("should throw an error when the chainId is not in the list of networks for v3 document", () => {
    const document = {
      ...invoice,
      network: { chain: "ETH", chainId: "8" },
    } as unknown as WrappedOrSignedOpenAttestationDocument;
    expect(() => getChainId(document)).toThrow("Invalid Document, please use a valid document.");
  });

  it("should return 'undefined' when a V3 did document is being dropped", () => {
    expect(getChainId(v3DID as unknown as WrappedOrSignedOpenAttestationDocument)).toStrictEqual(undefined);
  });
});
