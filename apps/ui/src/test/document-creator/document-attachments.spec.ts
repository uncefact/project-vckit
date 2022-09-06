import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, samplePdf } from "./helper";

fixture("Document attachments").page`http://localhost:3000`;

const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FillFormTitle = Selector("[data-testid='fill-form-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const AttachmentXButton = Selector("[data-testid='remove-uploaded-file-0']");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const FormAttachmentFields = Selector("[data-testid*='upload-file-']");
const AttachmentFileDropZoneInput = Selector("[data-testid='attachment-file-dropzone'] input");

test("should be added and removed correctly", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust Covering Letter v2"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Add attachment
  await t.setFilesToUpload(AttachmentFileDropZoneInput, [samplePdf]);
  await t.expect(FormAttachmentField.textContent).contains("sample-file.pdf");
  await t.expect(FormAttachmentFields.count).eql(1);

  // Remove attachment
  await t.click(AttachmentXButton);
});
