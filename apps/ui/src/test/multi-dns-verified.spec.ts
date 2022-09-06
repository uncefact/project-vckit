import { location, navigateToVerify, uploadDocument, validateIframeTexts, validateIssuerTexts } from "./helper";

fixture("Multiple DNS Verified for Certificate Rendering").page`${location}`;

test("Sample document is rendered correctly when multiple dns is verfied", async () => {
  await navigateToVerify();
  await uploadDocument("./fixture/sample-multidns-verified.json");
  await validateIssuerTexts(["EXAMPLE.TRADETRUST.IO and EXAMPLE.OPENATTESTATION.COM"]);
  await validateIframeTexts([
    "This is to certify that",
    "Mr Blockchain",
    "certification through training administered by",
  ]);
});
