import { getRevokingJobs, getRevokeAddress } from "./revoke";
import sampleWrappedDocument from "../../../../test/fixture/sample-files/v2/wrapped/sample-wrapped-document.json";
import sampleWrappedCertificate from "../../../../test/fixture/sample-files/v2/wrapped/sample-wrapped-certificate.json";
import sampleV2DidDocument from "../../../../test/fixture/sample-files/v2/did/sample-v2-did-wrapped.json";
import sampleV3DidDocument from "../../../../test/fixture/sample-files/v3/did/sample-v3-did-wrapped.json";

describe("getRevokingJobs", () => {
  it("should return an array with the revoking jobs", async () => {
    const revokingJobs = await getRevokingJobs([sampleWrappedDocument]);

    expect(revokingJobs).toHaveLength(1);
    expect(revokingJobs[0].contractAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
    expect(revokingJobs[0].targetHash).toBe("82018d4e6f3807fce0cb6a7c584c9477fdd1719746cbe74804608b7d0f982b7e");
    expect(revokingJobs[0].documents).toStrictEqual([sampleWrappedDocument]);
  });
});

describe("getRevokeAddress", () => {
  it("should get the document store for dns-txt verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleWrappedDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should get the certificate store for dns-txt verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleWrappedCertificate);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should get the revocation store address for v2 dns-did verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV2DidDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should get the revocation store address for v3 dns-did verifiable document", () => {
    const revokeAddress = getRevokeAddress(sampleV3DidDocument);
    expect(revokeAddress).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });
});
