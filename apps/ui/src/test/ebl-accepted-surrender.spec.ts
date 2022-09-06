import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument } from "./helper";

fixture("Render red surrender sign if ebl is accepted surrendered").page`${location}`;

const DocumentStatus = Selector("#document-status");
const SurrenderedSign = Selector("#surrendered-sign");
const InteractionAvaliable = Selector("[data-testid='connectToWallet']");

test("should displays surrendered sign when document is owned by 0xdead address", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/ebl-accepted-surrender.json");

  await DocumentStatus.with({ visibilityCheck: true })();

  await SurrenderedSign.with({ visibilityCheck: true })();
  await t.expect(SurrenderedSign.count).eql(1);
  await t.expect(InteractionAvaliable.count).eql(0);
});
