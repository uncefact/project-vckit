import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument, validateIssuerTexts } from "./helper";

fixture("Endorsement Chain Rendering").page`${location}`;

const ViewEndorsementChainButton = Selector("#endorsement-chain-button").withText("View Endorsement Chain");
const EndorsementChainTitle = Selector("[data-testid='endorsement-chain-title']").withText("Endorsement Chain");
const EndorsementChainAddress1 = Selector("[data-testid='address-entity']").withText(
  "0xFC6e365B926166d0D69bF336d03164FB301D6C41"
);
const EndorsementChainAddress2 = Selector("[data-testid='address-entity']").withText(
  "0x1Dc271EaE22a83c9670571d1a206043E8a420fdE"
);
const DocumentIssuedAction = Selector("[data-testid='action-title']").withText("Document has been issued");
const ChangeOwnershipAction = Selector("[data-testid='action-title']").withText("Endorse change of ownership");
const TransferHoldershipAction = Selector("[data-testid='action-title']").withText("Transfer holdership");
const SurrenderToIssuerAction = Selector("[data-testid='action-title']").withText("Document surrendered to issuer");
const SurrenderAcceptedAction = Selector("[data-testid='action-title']").withText("Surrender of document accepted");

test("Endorsement chain title and actions are rendered correctly", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/ebl-endorsement-chain.json");
  await validateIssuerTexts(["DEMO-TRADETRUST.OPENATTESTATION.COM"]);

  await t.wait(3000);
  await t.expect(ViewEndorsementChainButton.count).eql(1);
  await t.click(ViewEndorsementChainButton);

  // add wait 3000 due to endorsement chain component having a little latency because getting endorsement data
  await t.wait(3000);
  await t.expect(EndorsementChainTitle.count).eql(1);
  await t.expect(EndorsementChainAddress1.count).eql(5);
  await t.expect(EndorsementChainAddress2.count).eql(5);
  await t.expect(DocumentIssuedAction.count).eql(1);
  await t.expect(ChangeOwnershipAction.count).eql(4);
  await t.expect(TransferHoldershipAction.count).eql(1);
  await t.expect(SurrenderToIssuerAction.count).eql(1);
  await t.expect(SurrenderAcceptedAction.count).eql(1);
});
