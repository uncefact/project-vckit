import { verify as OAVerify } from "../../../vc/backends/openAttestation";

import unsigned_OA_V3 from "../../fixtures/OA_v3/did.json";
import signed_OA_V3 from "../../fixtures/OA_v3/did-signed.json";
import invalid_OA_V3 from "../../fixtures/OA_v3/did-invalid-signed.json";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import valid_simple_vc from "../../fixtures/generic_VC/degree_unsigned.json"; // used in failing test

describe("OAVerify", () => {
  it("Should verify a valid OA credential", async () => {
    const verificationResult = await OAVerify(signed_OA_V3, {});
    expect(verificationResult).toHaveProperty("errors");
    expect(verificationResult.errors).toHaveLength(0);
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  //it("Should verify a valid non-OA credential", async () => {
  //  const verificationResult = await OAVerify(valid_simple_vc, {});
  //  expect(verificationResult).toHaveProperty("errors");
  //  expect(verificationResult.errors).toHaveLength(0);
  //});
  it("Should fail when input is not a credential", async () => {
    const verificationResult = await OAVerify({ this_is: "not a vc" }, {});
    expect(verificationResult).toHaveProperty("errors");
    expect(verificationResult.errors).toContain("identity");
    expect(verificationResult.errors).toContain("status");
    expect(verificationResult.errors).toContain("proof");
  });
  it("Should fail DOCUMENT_INTEGRITY when signature is invalid", async () => {
    const verificationResult = await OAVerify(invalid_OA_V3, {});
    expect(verificationResult).toHaveProperty("errors");
    expect(verificationResult.errors).toContain("proof");
  });
  it("Should fail DOCUMENT_STATUS when it's unsigned and unwrapped", async () => {
    const verificationResult = await OAVerify(unsigned_OA_V3, {});
    expect(verificationResult).toHaveProperty("errors");
    expect(verificationResult.errors).toContain("status");
    expect(verificationResult.errors).toContain("proof");
  });
});
