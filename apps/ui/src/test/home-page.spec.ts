import { Selector } from "testcafe";
import { location } from "./helper";

fixture("Home Page").page`${location}`;

const WelcomeSection = Selector("[id='welcome']");
const MainBenefitsSection = Selector("[id='main-benefits']");
const HowItWorksSection = Selector("[id='how-it-works']");

const PlayButton = Selector("[data-testid='play-button']");
const VerifyButton = Selector("[data-testid='verify-button']");

const YoutubeTitle = Selector("[data-testid='overlay-title']").withText("Digitalising Trust for Cross-Border Trade");

const ReducedCostTitle = Selector("[data-testid='benefit-title']").withText(
  "Legal certainty for electronic Transferable Documents"
);
const EfficiencyTitle = Selector("[data-testid='benefit-title']").withText(
  "Increase efficiency, lower cost and lower risk of fraud"
);
const SupportTitle = Selector("[data-testid='benefit-title']").withText("Support innovative service offerings");

const TransferableRecordsTitle = Selector("[data-testid='document-type-0']").withText("Transferable Records");
const VerifiableDocumentsTitle = Selector("[data-testid='document-type-1']").withText("Verifiable Documents");

const Personas = Selector("[data-testid='persona-card']");

const GetInTouchButton = Selector("[data-testid='get-in-touch']");

const OverlayCloseButton = Selector("[data-testid='overlay-close']");

test("Render home page", async (t) => {
  // display 3 main sections
  await t.expect(WelcomeSection.count).eql(1);
  await t.expect(MainBenefitsSection.count).eql(1);
  await t.expect(HowItWorksSection.count).eql(1);

  // display components in welcome and test for video overlay
  await t.expect(PlayButton.count).eql(1);
  await t.expect(VerifyButton.count).eql(1);
  await t.click(PlayButton);
  await t.expect(YoutubeTitle.count).eql(1);
  await t.click(OverlayCloseButton);

  // display components in main benefits
  await t.expect(ReducedCostTitle.count).eql(1);
  await t.expect(EfficiencyTitle.count).eql(1);
  await t.expect(SupportTitle.count).eql(1);

  // display document type details in how it works
  await t.expect(TransferableRecordsTitle.count).eql(1);
  await t.expect(VerifiableDocumentsTitle.count).eql(1);

  // display persona modals for transferable record
  await t.expect(Personas.count).eql(4);
  await t.click(Selector("[data-testid='persona-details-0']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Bill of Lading").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-0']").count).eql(1);
  await t.click(OverlayCloseButton);

  await t.click(Selector("[data-testid='persona-details-1']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Bill of Lading").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-1']").count).eql(1);
  await t.click(OverlayCloseButton);

  await t.click(Selector("[data-testid='persona-details-2']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Bill of Lading").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-2']").count).eql(1);
  await t.click(OverlayCloseButton);

  await t.click(Selector("[data-testid='persona-details-3']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Bill of Lading").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-3']").count).eql(1);
  await t.click(OverlayCloseButton);

  // display persona modal for verifiable document
  await t.click(VerifiableDocumentsTitle);
  await t.expect(Personas.count).eql(4);
  await t.click(Selector("[data-testid='persona-details-0']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Certificate of Origin").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-0']").count).eql(1);
  await t.click(OverlayCloseButton);

  await t.click(Selector("[data-testid='persona-details-1']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Certificate of Origin").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-1']").count).eql(1);
  await t.click(OverlayCloseButton);

  await t.click(Selector("[data-testid='persona-details-2']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Certificate of Origin").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-2']").count).eql(1);
  await t.click(OverlayCloseButton);

  await t.click(Selector("[data-testid='persona-details-3']"));
  await t.expect(Selector("[id='persona-modal']").withText("Electronic Certificate of Origin").count).eql(1);
  await t.expect(Selector("[data-testid='get-in-touch-3']").count).eql(1);
  await t.click(OverlayCloseButton);

  // display Get In Touch button and test for Try our Demo
  await t.expect(GetInTouchButton.count).eql(1);
  await t.click(GetInTouchButton);
  const element = await Selector("[data-testid='page-title']");
  await t.expect(element.textContent).contains("Demo");
});
