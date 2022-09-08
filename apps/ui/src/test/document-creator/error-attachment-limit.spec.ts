import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, samplePdf, samplePdf6Mb } from "./helper";

fixture("Error attachment limit").page`http://localhost:3000`;

const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const Button = Selector("button");
const FormIdField = Selector("#root_iD");
const ProgressBar = Selector("[data-testid='progress-bar']");
const TotalFileSizeError = Selector("[data-testid='file-error']");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const AttachmentFileDropZoneInput = Selector("[data-testid='attachment-file-dropzone'] input");

test("should show file limit warning when over 6mb", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust ChAFTA Certificate of Origin v2"));
  await t.typeText(FormIdField, "COO-ID");

  // Upload a attachment (over file limit)
  await t.setFilesToUpload(AttachmentFileDropZoneInput, [samplePdf6Mb]);
  await t
    .expect(TotalFileSizeError.textContent)
    .contains("Total attachment file size exceeds 5MB, Please try again with a smaller file size.");

  // Upload a attachment (below file limit)
  await t.setFilesToUpload(AttachmentFileDropZoneInput, [samplePdf]);
  await t.expect(FormAttachmentField.textContent).contains("sample-file.pdf");
});
