import { v2 } from "@govtechsg/open-attestation";
import { getDnsDidRecords, getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { validateDnsTxtRecords } from "./dns-checks";

jest.mock("@govtechsg/dnsprove", () => ({
  getDnsDidRecords: jest.fn(),
  getDocumentStoreRecords: jest.fn(),
}));
const mockGetDnsDidRecords = getDnsDidRecords as jest.Mock;
const mockGetDocumentStoreRecords = getDocumentStoreRecords as jest.Mock;

const mockRecordsDnsDid = [
  {
    type: "openatts",
    algorithm: "dns-did",
    publicKey: "did:ethr:0x123B86fC8FCE13c4A0f452Cd0A8AB5b6b3e3A4f3#controller",
    version: "1.0",
    dnssec: true,
  },
  {
    type: "openatts",
    algorithm: "dns-did",
    publicKey: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
    version: "1.0",
    dnssec: true,
  },
];

const mockRecordsDnsTxt = [
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x10E936e6BA85dC92505760259881167141365821",
    dnssec: true,
  },
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
    dnssec: true,
  },
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    dnssec: true,
  },
];

describe("validateDnsTxtRecords", () => {
  it("should return true for DNS-TXT method if address exists on dns regardless of text casing", async () => {
    mockGetDocumentStoreRecords.mockReturnValue(mockRecordsDnsTxt);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSTxt,
      issuerLocation: "example.com",
      issuerAddress: "0x8BA63EAB43342AAC3ADBB4B827B68CF4AAE5CACA",
    });
    expect(isDnsValidated).toBe(true);
  });

  it("should return true for DNS-TXT method if address exists on dns", async () => {
    mockGetDocumentStoreRecords.mockReturnValue(mockRecordsDnsTxt);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSTxt,
      issuerLocation: "example.com",
      issuerAddress: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    });
    expect(isDnsValidated).toBe(true);
  });

  it("should return false for DNS-TXT method if address not exists on dns", async () => {
    mockGetDocumentStoreRecords.mockReturnValue(mockRecordsDnsTxt);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSTxt,
      issuerLocation: "example.com",
      issuerAddress: "0x0x987654321",
    });
    expect(isDnsValidated).toBe(false);
  });

  it("should return true for DNS-DID method if address exists on dns", async () => {
    mockGetDnsDidRecords.mockReturnValue(mockRecordsDnsDid);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSDid,
      issuerLocation: "example.com",
      issuerAddress: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733#controller",
    });
    expect(isDnsValidated).toBe(true);
  });

  it("should return false for DNS-DID method if address not exists on dns", async () => {
    mockGetDnsDidRecords.mockReturnValue(mockRecordsDnsDid);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSDid,
      issuerLocation: "example.com",
      issuerAddress: "did:ethr:0x987654321#controller",
    });
    expect(isDnsValidated).toBe(false);
  });
});
