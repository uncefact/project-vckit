import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal } from "./helper";

fixture("Document extension").page`http://localhost:3000`;

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const Button = Selector("button");
const AddNewButton = Selector("[data-testid='add-new-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const SubmitButton = Selector("[data-testid='form-submit-button']");

test("should have the correct extension if specified", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // login
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust Covering Letter v2"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Add new form
  await t.click(AddNewButton);

  // Navigate to form
  await t.click(Button.withText("Covering Letter (extension)"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Submit
  await t.click(SubmitButton);

  // Check that the two Covering Letters are created with the correct document extensions
  const fileName1 = "TradeTrust Covering Letter v2-1-local.tt";
  const fileName2 = "Covering Letter (extension)-2-local.docTest";
  await t.expect(Selector("div").withText(fileName1).exists).ok();
  await t.expect(Selector("div").withText(fileName2).exists).ok();
});
