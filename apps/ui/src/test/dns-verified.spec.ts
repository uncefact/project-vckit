import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument, validateIframeTexts, validateIssuerTexts } from "./helper";

fixture("DNS Certificate Rendering").page`${location}`;

const ButtonUploadAddressBook = Selector("[data-testid='multi-button'] button").withText("Address Book");

test("sample document is rendered correctly when dns is verified", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/sample-dns-verified.json");
  await validateIssuerTexts(["EXAMPLE.OPENATTESTATION.COM"]);

  await t.expect(ButtonUploadAddressBook.count).eql(0);

  await validateIframeTexts([
    "Name & Address of Shipping Agent/Freight Forwarder",
    "CERTIFICATE OF NON-MANIPULATION",
    "DEMO JOHN TAN",
    "Certification by Singapore Customs",
    "AQSIQ170923130",
  ]);
});
