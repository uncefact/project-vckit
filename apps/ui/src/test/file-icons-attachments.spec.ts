import { Selector } from "testcafe";
import { location, navigateToVerify, uploadDocument, validateIframeTexts } from "./helper";

fixture("Document with 8 Attachments Rendering File Icons").page`${location}`;

const TabsItems = Selector(".multi-tab");
const TabDefault = Selector("[data-testid='default']");
const TabAttachment = Selector("[data-testid='tab-attachment']");
const IconWordDoc = Selector("[data-testid='attachment-icon-doc']");
const IconCsv = Selector("[data-testid='attachment-icon-csv']");
const IconJpeg = Selector("[data-testid='attachment-icon-jpg']");
const IconPdf = Selector("[data-testid='attachment-icon-pdf']");
const IconPng = Selector("[data-testid='attachment-icon-png']");
const IconTxt = Selector("[data-testid='attachment-icon-txt']");
const IconPaperclip = Selector("[data-testid='attachment-icon-paperclip']");

const AttachmentNumber = Selector("[data-testid='attachment-number']");
const AttachmentLink = Selector("[data-testid='attachment-download-link']");

test("Attachment Tab and Panel rendered correctly", async (t) => {
  await navigateToVerify();
  await uploadDocument("./fixture/file-with-attachments.json");

  // default document pdf content should render
  await validateIframeTexts(["Documents Bundle"]);

  // tabs number should tally
  await TabDefault.with({ visibilityCheck: true })();
  await t.expect(TabsItems.count).eql(3);
  await t.expect(TabAttachment.textContent).contains("Attachments");
  await t.expect(AttachmentNumber.textContent).contains("8");

  // pdf tabs content should render (pdf rendering is slow on ci causing flaky test, await specifically for pdf spans to render before text validation checks)
  await t.click(TabAttachment);
  await TabAttachment.with({ visibilityCheck: true })();

  // check file-icons display
  await t.expect(AttachmentLink.count).eql(8);
  await t.expect(IconWordDoc.count).eql(2);
  await t.expect(IconCsv.count).eql(1);
  await t.expect(IconJpeg.count).eql(1);
  await t.expect(IconPdf.count).eql(1);
  await t.expect(IconPng.count).eql(1);
  await t.expect(IconTxt.count).eql(1);
  await t.expect(IconPaperclip.count).eql(1);
});
