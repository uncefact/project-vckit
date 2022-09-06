import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument, validateIssuerTexts } from "./helper";

fixture("Selective Disclosure").page`${location}`;

const IframeBlock = Selector("#iframe");

const PrivacyFilterButton = Selector("#privacySwitch");
const CertificateSection = Selector("#rendered-certificate");
const ExporterObfuscationButton = Selector(".fa-minus-circle").nth(0);

test("Fields on a document can be hidden", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/coo-selective-disclosure.json");
  await validateIssuerTexts(["DEMO-TRADETRUST.OPENATTESTATION.COM"]);

  await t.switchToIframe(IframeBlock);

  // Check that all text elements exist
  await t.expect(CertificateSection.textContent).contains("TREASURY WINE ESTATES VINTNERS LIMITED");
  await t.expect(CertificateSection.textContent).contains("Penfolds wine");

  // Obfuscate the exporters
  await t.click(PrivacyFilterButton);
  await t.click(ExporterObfuscationButton);

  // Check that only the exporter is removed
  await t.expect(CertificateSection.textContent).notContains("TREASURY WINE ESTATES VINTNERS LIMITED");
  await t.expect(CertificateSection.textContent).contains("Penfolds wine");
});
