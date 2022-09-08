import { issue as OAIssue } from "../../../vc/backends/openAttestation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import simple_unsigned_cred from "../../fixtures/generic_VC/degree_unsigned.json";
import unsigned_OA_V3 from "../../fixtures/OA_v3/did.json";
import already_signed_OA_V3 from "../../fixtures/OA_v3/did-signed.json";

// Need to include key material for these tests
const signingKeyId =
  "did:ethr:0x5aaA29b606d730E96a61eD5745D109f82a87A9C8#controller";
const signingKey =
  "0xba675ad1f430090b30b3e322748d0a9999c0625620765aaa1d704c505ba5c648";

describe("OAIssue", () => {
  it("Should sign and wrap a valid OA credential", async () => {
    const issuedDoc = await OAIssue(unsigned_OA_V3, signingKeyId, signingKey);
    expect(issuedDoc).toHaveProperty("proof");
    expect(issuedDoc).toHaveProperty("credentialSubject");
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  //it("Should sign and wrap a valid generic credential", async () => {
  //  const issuedDoc = await OAIssue(simple_unsigned_cred, signingKeyId, signingKey);
  //  expect(issuedDoc).toHaveProperty("proof");
  //  expect(issuedDoc).toHaveProperty("credentialSubject");
  //});
  it("Should fail when required VC fields are not present", async () => {
    const invalid_doc = { this_is: "Not a", valid: "vc" };
    await expect(
      OAIssue(invalid_doc, signingKeyId, signingKey)
    ).rejects.toThrowError();
  });
  it("Should fail when credential is already signed", async () => {
    await expect(
      OAIssue(already_signed_OA_V3, signingKeyId, signingKey)
    ).rejects.toThrowError();
  });
});
