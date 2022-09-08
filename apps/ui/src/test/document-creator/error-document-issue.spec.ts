import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocalErrorDocumentIssue } from "./helper";

fixture("Error document issue").page`http://localhost:3000`;

const ProcessDocumentTitle = Selector("[data-testid='process-document-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const Button = Selector("button");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("should show failed published document(s) errors", async (t) => {
  // Upload config file
  await loadConfigFile(configLocalErrorDocumentIssue);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust Covering Letter v2"));

  // Submit form
  await t.click(SubmitButton);

  // Failed published document
  await t.expect(ProcessDocumentTitle.textContent).contains("Document(s) failed to issue");
  await t.expect(Selector("div").withText("1 document(s)").exists).ok();
  await t.expect(Selector("div").withText("The document(s) could not be issued at this time.").exists).ok();
  await t.expect(Selector("div").withText("TradeTrust Covering Letter v2-1-local.tt").exists).ok();
});
