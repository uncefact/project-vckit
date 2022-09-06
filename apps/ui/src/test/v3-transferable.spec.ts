import { Selector } from "testcafe";
import { uploadDocument, validateIframeTexts, validateIssuerTexts, location, navigateToVerify } from "./helper";

fixture("v3 Transferable Record").page`${location}`;

test("should render correctly when verified", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/v3/ebl-ropsten.json");

  await t.expect(Selector("h5").withText("View NFT Registry").exists).ok();
  await validateIssuerTexts(["DEMO-TRADETRUST.OPENATTESTATION.COM"]);
  await validateIframeTexts(["Demo Shipper", "Singapore Port", "Green Apples"]);
});
