import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, documentRevoked } from "./helper";

fixture("Revoke flow").page`http://localhost:3000`;

const ProcessDocumentTitle = Selector("[data-testid='process-document-title']");
const RevokeTitle = Selector("[data-testid='revoke-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const RevokeFileDropZoneInput = Selector("[data-testid='revoke-file-dropzone'] input");

test("should revoke a document on local blockchain correctly", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Go to Revoke document page
  await t.click(Selector("[data-testid='revoke-selector']"));
  await t.expect(RevokeTitle.textContent).contains("Upload Document");

  // Upload a file
  await t.setFilesToUpload(RevokeFileDropZoneInput, [documentRevoked]);

  // Click back button to test back flow and upload file again
  await t.click(Selector("[data-testid='back-revoke-button']"));
  await t.expect(RevokeTitle.textContent).contains("Upload Document");
  await t.setFilesToUpload(RevokeFileDropZoneInput, [documentRevoked]);

  // Revoke Document
  await t.click(Selector("[data-testid='revoke-button']"));
  await t.expect(Selector("[data-testid='modal-title']").textContent).contains("Revoke Document");
  await t.click(Selector("[data-testid='confirm-modal-confirm-button']"));

  await t.wait(6000); // cater to ci latency, so it does not break the subsequent tests, try not use everywhere

  await t.expect(ProcessDocumentTitle.withText("Document revoked successfully").exists).ok();
  await t.expect(Selector("[data-testid='file-name']").textContent).contains("wrapped-document-local-revokable.json");
});
