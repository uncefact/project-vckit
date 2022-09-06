import axios from "axios";
import { v2, v3 } from "@govtechsg/open-attestation";
import { generateFileName, getIssuerLocation, getIdentityProofType, getIssuerAddress, storeVc } from "./utils";
import { FormTemplate } from "../types";
import { encodeQrCode } from "../common/utils/utils";
import { VCKIT_DOMAIN, PROTOCOL } from "../appConfig";

jest.mock("axios");

describe("generateFileName", () => {
  it("should generate the file name correctly with the given config and file name", async () => {
    const fileName = generateFileName({
      network: "ropsten",
      fileName: "document-1",
      extension: "tt",
    });

    expect(fileName).toStrictEqual("document-1-ropsten.tt");
  });

  it("should generate the file name correctly when config.network is 'homestead'", async () => {
    const fileName = generateFileName({
      network: "homestead",
      fileName: "document-1",
      extension: "tt",
    });

    expect(fileName).toStrictEqual("document-1.tt");
  });

  it("should generate the extension correctly", async () => {
    const fileName = generateFileName({
      network: "homestead",
      fileName: "document-1",
      extension: "txt",
    });

    expect(fileName).toStrictEqual("document-1.txt");
  });
});

describe("generateErrorLogFileName", () => {
  it("should generate the correct date time at the end of the error log file name", () => {
    const mockDate = new Date(1572393600000);
    const RealDate = Date;
    (global as any).Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
    };

    const fileName = generateFileName({
      network: "ropsten",
      fileName: "error-log",
      extension: "tt",
      hasTimestamp: true,
    });

    expect(fileName).toStrictEqual("error-log-ropsten-2019-10-30T00:00:00.000Z.tt");

    global.Date = RealDate;
  });
});

const mockInvoiceV2: FormTemplate = {
  name: "TradeTrust Invoice v2",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    $template: {
      type: v2.TemplateType.EmbeddedRenderer,
      name: "INVOICE",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "Demo Issuer",
        documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        identityProof: {
          type: v2.IdentityProofType.DNSTxt,
          location: "demo-tradetrust.openattestation.com",
        },
        revocation: {
          type: v2.RevocationType.None,
        },
      },
    ],
  },
  schema: {},
};

const mockInvoiceV2DnsDid: FormTemplate = {
  name: "TradeTrust Invoice v2",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    $template: {
      type: v2.TemplateType.EmbeddedRenderer,
      name: "INVOICE",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        id: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
        name: "Demo DNS-DID",
        identityProof: {
          type: v2.IdentityProofType.DNSDid,
          location: "demo-tradetrust.openattestation.com",
          key: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733#controller",
        },
        revocation: {
          type: v2.RevocationType.None,
        },
      },
    ],
  },
  schema: {},
};

const mockInvoiceV3: FormTemplate = {
  name: "TradeTrust Invoice v3",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json",
      "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuanceDate: "2010-01-01T19:23:24Z",
    openAttestationMetadata: {
      template: {
        type: v3.TemplateType.EmbeddedRenderer,
        name: "INVOICE",
        url: "https://generic-templates.tradetrust.io",
      },
      proof: {
        type: v3.ProofType.OpenAttestationProofMethod,
        method: v3.Method.DocumentStore,
        value: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        revocation: {
          type: v3.RevocationType.None,
        },
      },
      identityProof: {
        type: v3.IdentityProofType.DNSTxt,
        identifier: "demo-tradetrust.openattestation.com",
      },
    },
    credentialSubject: {},
    issuer: {
      id: "https://example.com",
      name: "DEMO DOCUMENT STORE",
      type: "OpenAttestationIssuer",
    },
  },
  schema: {},
};

const mockInvoiceV3DnsDid: FormTemplate = {
  name: "TradeTrust Invoice v3",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json",
      "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuanceDate: "2010-01-01T19:23:24Z",
    openAttestationMetadata: {
      template: {
        type: v3.TemplateType.EmbeddedRenderer,
        name: "INVOICE",
        url: "https://generic-templates.tradetrust.io",
      },
      proof: {
        type: v3.ProofType.OpenAttestationProofMethod,
        method: v3.Method.Did,
        value: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
        revocation: {
          type: v3.RevocationType.None,
        },
      },
      identityProof: {
        type: v3.IdentityProofType.DNSTxt,
        identifier: "demo-tradetrust.openattestation.com",
      },
    },
    credentialSubject: {},
    issuer: {
      id: "https://example.com",
      name: "DEMO DOCUMENT STORE",
      type: "OpenAttestationIssuer",
    },
  },
  schema: {},
};

describe("getIssuerLocation", () => {
  it("should return dns location from raw document v2", () => {
    const location = getIssuerLocation(mockInvoiceV2.defaults);
    expect(location).toBe("demo-tradetrust.openattestation.com");
  });

  it("should return dns location from raw document v3", () => {
    const location = getIssuerLocation(mockInvoiceV3.defaults);
    expect(location).toBe("demo-tradetrust.openattestation.com");
  });
});

describe("getIdentityProofType", () => {
  it("should return identity proof type from raw document v2", () => {
    const method = getIdentityProofType(mockInvoiceV2.defaults);
    expect(method).toBe("DNS-TXT");
  });

  it("should return identity proof type from raw document v3", () => {
    const method = getIdentityProofType(mockInvoiceV3.defaults);
    expect(method).toBe("DNS-TXT");
  });
});

describe("getIssuerAddress", () => {
  it("should return issuer address from raw document v2", () => {
    const address = getIssuerAddress(mockInvoiceV2.defaults);
    expect(address).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should return issuer address from raw document v3", () => {
    const address = getIssuerAddress(mockInvoiceV3.defaults);
    expect(address).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should return issuer address from raw document v2 (dns-did)", () => {
    const address = getIssuerAddress(mockInvoiceV2DnsDid.defaults);
    expect(address).toBe("0x1245e5b64d785b25057f7438f715f4aa5d965733");
  });

  it("should return issuer address from raw document v3 (dns-did)", () => {
    const address = getIssuerAddress(mockInvoiceV3DnsDid.defaults);
    expect(address).toBe("0x1245e5b64d785b25057f7438f715f4aa5d965733");
  });
});

describe("storeVc", () => {
  const fullUrl = "http://test.com";
  const decryptionKey = "decryptionKey123";
  const id = "123";

  const payloadUrl = encodeQrCode({
    type: "DOCUMENT",
    payload: {
      uri: `${fullUrl}/${id}`,
      key: decryptionKey,
      permittedActions: ["STORE"],
      redirect: `${PROTOCOL}://${VCKIT_DOMAIN}`,
    },
  });

  it("should post VC to document store and return url", async () => {
    (axios.post as any).mockResolvedValueOnce({ data: "test" });

    const res = await storeVc({
      documentStorage: fullUrl,
      id,
      document: { a: "a" } as any,
      decryptionKey,
    });

    expect(res).toBe(payloadUrl);
  });

  it("should return undefined if there's an error", async () => {
    (axios.post as any).mockResolvedValueOnce({ data: { err: "Something wrong" } });

    const res = await storeVc({
      documentStorage: fullUrl,
      id,
      document: { a: "a" } as any,
      decryptionKey,
    });

    expect(res).toBe(undefined);
  });
});
