import { location, navigateToVerify, uploadDocument, validateIframeTexts, validateIssuerTexts } from "./helper";

fixture("DNS DID Certificate Rendering").page`${location}`;

test("sample document is rendered correctly when dns did is verified", async () => {
  await navigateToVerify();
  await uploadDocument("./fixture/sample-dns-did-verified.json");
  await validateIssuerTexts(["EXAMPLE.TRADETRUST.IO"]);

  await validateIframeTexts([
    "Name & Address of Shipping Agent/Freight Forwarder",
    "CERTIFICATE OF NON-MANIPULATION",
    "DEMO CUSTOMS",
    "Certification by Singapore Customs",
    "AQSIQ170923130",
  ]);
});
