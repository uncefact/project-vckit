import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument } from "./helper";

fixture("Render document for direct ownership").page`${location}`;

const DocumentStatus = Selector("#document-status");
const InteractionAvaliable = Selector("[data-testid='connectToWallet']");

test("Displays action button for wallet owners", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/ebl-wallet-owner.json");

  await DocumentStatus.with({ visibilityCheck: true })();
  await t.expect(InteractionAvaliable.count).eql(1);
});
