import { uploadDocument, validateIframeTexts, validateIssuerTexts, location, navigateToVerify } from "./helper";

fixture("v3 DNS DID Certificate Rendering").page`${location}`;

test("sample document is rendered correctly when dns did is verified", async () => {
  await navigateToVerify();
  await uploadDocument("./fixture/v3/dns-did-signed.json");
  await validateIssuerTexts(["EXAMPLE.OPENATTESTATION.COM"]);

  await validateIframeTexts(["S1234567a", "John Doe", "22 Feb 1977", "1 Jan 2010"]);
});
