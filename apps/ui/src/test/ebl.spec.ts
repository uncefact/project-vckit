import { location, navigateToVerify, uploadDocument, validateIframeTexts, validateIssuerTexts } from "./helper";

fixture("Token Document Rendering").page`${location}`;

test("Token is verified and rendered correctly", async () => {
  await navigateToVerify();
  await uploadDocument("./fixture/ebl.json");
  await validateIssuerTexts(["TRADETRUST.IO"]);
  await validateIframeTexts(["BILL OF LADING FOR OCEAN TRANSPORT OR MULTIMODAL TRANSPORT"]);
});

test("Should be able to render certificate twice consecutively", async () => {
  await navigateToVerify();
  await uploadDocument("./fixture/ebl.json");
  await validateIssuerTexts(["TRADETRUST.IO"]);
  await validateIframeTexts(["BILL OF LADING FOR OCEAN TRANSPORT OR MULTIMODAL TRANSPORT"]);

  await navigateToVerify();
  await uploadDocument("./fixture/ebl.json");
  await validateIssuerTexts(["TRADETRUST.IO"]);
  await validateIframeTexts(["BILL OF LADING FOR OCEAN TRANSPORT OR MULTIMODAL TRANSPORT"]);
});
