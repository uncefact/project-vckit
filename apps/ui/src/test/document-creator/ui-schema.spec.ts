import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal } from "./helper";

fixture("uiSchema").page`http://localhost:3000`;

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const Button = Selector("button");
const Form = Selector("[data-testid='form-group field field-object']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("form should render remarks as custom textarea when uiSchema exists", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Check if on correct network
  await t.expect(Selector("[data-testid='network-bar']").withText("Local network").exists).ok();

  // login
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust Covering Letter v2"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Expect uiSchema to be working, it renders the remarks field to become textarea (rjsf custom widget)
  await t.expect(Form.find("input#root_remarks").exists).notOk();
  await t.expect(Form.find("textarea#root_remarks").exists).ok();
});

test("form should render remarks as default input when uiSchema not exists", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Check if on correct network
  await t.expect(Selector("[data-testid='network-bar']").withText("Local network").exists).ok();

  // login
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("Covering Letter (No uiSchema)"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Expect remarks field to be a normal input field, uiSchema does not exist at the form template's root level
  await t.expect(Form.find("input#root_remarks").exists).ok();
  await t.expect(Form.find("textarea#root_remarks").exists).notOk();
});
