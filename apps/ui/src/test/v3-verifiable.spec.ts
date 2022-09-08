import { uploadDocument, validateIframeTexts, validateIssuerTexts, location, navigateToVerify } from "./helper";

fixture("v3 Verifiable Document").page`${location}`;

test("should render correctly when verified", async () => {
  await navigateToVerify();
  await uploadDocument("./fixture/v3/invoice-ropsten.json");

  await validateIssuerTexts(["DEMO-TRADETRUST.OPENATTESTATION.COM"]);
  await validateIframeTexts(["ABC Company", "James Lee", "Service Fee"]);
});
