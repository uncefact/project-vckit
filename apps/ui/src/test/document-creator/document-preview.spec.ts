import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, dataFileJsonCoo } from "./helper";

fixture("Document preview").page`http://localhost:3000`;

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const Iframe = Selector("#iframe[title='Decentralised Rendered Certificate']");
const IframeRoot = Selector("#root");
const DataFileDropZoneInput = Selector("[data-testid='data-file-dropzone'] input");

test("should be able to preview form with data", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust ChAFTA Certificate of Origin v2"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Upload data file
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileJsonCoo]);

  // Set preview mode to true
  await t.click(Selector("[data-testid='toggle-switch-label']"));
  await t.switchToIframe(Iframe);

  // Check that entered data is shown
  await t.expect(IframeRoot.textContent).contains("WBC208897");

  // Check that text from template (not in data) is shown
  await t.expect(IframeRoot.textContent).contains("Place, date and signature of authorised person");
});
