import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, dataFileJsonEblMissingFields } from "./helper";

fixture("Data upload error").page`http://localhost:3000`;

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const ErrorItem1 = Selector("[data-testid='form-error-banner'] li").nth(0);
const ErrorItem2 = Selector("[data-testid='form-error-banner'] li").nth(1);
const DataFileDropZoneInput = Selector("[data-testid='data-file-dropzone'] input");

test("should show validation error messages correctly", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust Bill of Lading v2"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Upload data file
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileJsonEblMissingFields]);

  // Assert validation error messages
  await t.expect(ErrorItem1.textContent).contains("must have required property 'blNumber'");
  await t.expect(ErrorItem2.textContent).contains("must have required property 'scac'");
});
