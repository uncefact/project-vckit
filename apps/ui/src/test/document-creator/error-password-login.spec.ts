import { Selector } from "testcafe";
import { enterPassword, deletePassword, loadConfigFile, configLocal } from "./helper";

fixture("Error password login").page`http://localhost:3000`;

const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ButtonLogin = Selector("[data-testid='login-button']");
const PasswordFieldMsg = Selector("[data-testid='password-field-msg']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("should handle no password, wrong password errors correctly", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login (no password)
  await t.click(ButtonLogin);
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // Login (wrong password)
  await enterPassword("test error");
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // Login (correct password)
  await deletePassword();
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");
});
