import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument, validateTextContent } from "./helper";

fixture("Unverified Document Rendering").page`${location}`;

const RenderedDocument = Selector("[data-testid='certificate-dropzone']");
const InvalidMessage = Selector(".invalid");

test("should render error texts when document issuers are unverified", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/unverified-issuer.json");

  await InvalidMessage.with({ visibilityCheck: true })();
  await validateTextContent(t, RenderedDocument, [
    "Document issuer identity is invalid",
    "This document was issued by an invalid issuer.",
  ]);
});

test("should be able to go to faq without triggering upload", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/unverified-issuer.json");

  await InvalidMessage.with({ visibilityCheck: true })();
  await t.click(Selector("a[href='/faq']"));
  await t.expect(Selector("[data-testid='page-title']").withText("Frequently Asked Questions").exists).ok();
});

test("should be able go back to reupload file state", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/unverified-issuer.json");

  await InvalidMessage.with({ visibilityCheck: true })();
  await t.click(Selector("[data-testid='try-another']"));
  await t
    .expect(
      Selector("[data-testid='certificate-dropzone']").withText("Drop your TradeTrust file to view its contents").exists
    )
    .ok();
});
