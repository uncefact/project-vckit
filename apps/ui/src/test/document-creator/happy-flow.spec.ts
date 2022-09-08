import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, dataFileJsonCoo, dataFileJsonEbl, dataFileCsvEbl } from "./helper";

fixture("Happy flow").page`http://localhost:3000`;

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const Button = Selector("button");
const ProgressBar = Selector("[data-testid='progress-bar']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const FormIdField = Selector("#root_iD");
const FormExporterNameField = Selector("#root_supplyChainConsignment_exporter_name");
const EblBeneficiaryField = Selector("[data-testid='transferable-record-beneficiary-input']");
const EblHolderField = Selector("[data-testid='transferable-record-holder-input']");
const EblNumberField = Selector("input#root_blNumber");
const EblFileNameField = Selector("[data-testid='file-name-input']");
const EblDocumentNameSelect = Selector("[data-testid='document-name-select']");
const EblDocumentNumberInput = Selector("[data-testid='document-number-input']");
const DataFileDropZoneInput = Selector("[data-testid='data-file-dropzone'] input");

test("should issue the documents on local blockchain correctly", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

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

  // Validated the content is overwritten by the data file
  await t.expect(FormIdField.value).eql("wfa.org.au:coo:WBC208897");
  await t.expect(FormExporterNameField.value).eql("TREASURY WINE ESTATES VINTNERS LIMITED");

  // Submit
  await t.click(SubmitButton);

  // Pending confirmation of issued documents
  await t.expect(Selector("[data-testid='processing-loader']").exists).ok();

  await t.wait(6000); // cater to ci latency, so it does not break the subsequent tests, try not use everywhere

  // Check that download exists
  await t.expect(Selector("[data-testid='file-name']").exists).ok();
  await t.expect(Selector("[data-testid='download-file-button']").exists).ok();
  await t.expect(Selector("[data-testid='download-all-button']").exists).ok();

  // Issue transferable record
  await t.click(Button.withText("Create Another Document"));
  await t.click(Button.withText("TradeTrust Bill of Lading v2"));

  // Fill in form
  await t.typeText(EblBeneficiaryField, "0x6FFeD6E6591b808130a9b248fEA32101b5220eca");
  await t.typeText(EblHolderField, "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e");
  await t.typeText(EblNumberField, "MY-BL-NUMBER");

  // Test data upload json file
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileJsonEbl]);

  // Validate the content is overwritten by the data file
  await t.expect(EblFileNameField.value).eql("bill-123");
  await t.expect(EblDocumentNameSelect.innerText).eql("bill-123");
  await t.expect(EblBeneficiaryField.value).eql("0xa61b056da0084a5f391ec137583073096880c2e3");
  await t.expect(EblHolderField.value).eql("0xa61b056da0084a5f391ec137583073096880c2e3");
  await t.expect(EblNumberField.value).eql("123");

  // Test data upload csv file
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileCsvEbl]);

  // Validate the content is overwritten by the data file
  await t.expect(EblFileNameField.value).eql("bill-<blNumber 1>");
  await t.expect(EblDocumentNameSelect.innerText).eql("bill-<blNumber 1>");
  await t.expect(EblBeneficiaryField.value).eql("<beneficiary address 1>");
  await t.expect(EblHolderField.value).eql("<holder address 1>");
  await t.expect(EblNumberField.value).eql("<blNumber 1>");

  await t.typeText(EblDocumentNumberInput, "3", { replace: true });
  await t.expect(EblFileNameField.value).eql("bill-<blNumber 2>");
  await t.expect(EblDocumentNameSelect.innerText).eql("bill-<blNumber 2>");
  await t.expect(EblBeneficiaryField.value).eql("<beneficiary address 2>");
  await t.expect(EblHolderField.value).eql("<holder address 2>");
  await t.expect(EblNumberField.value).eql("<blNumber 2>");

  // Submit
  await t.click(SubmitButton);

  // Check that EBL is created
  await t.expect(Selector("div").withText("bill-123-local.tt").exists).ok();
  await t.expect(Selector("div").withText("bill-<blNumber 1>-local.tt").exists).ok();
  await t.expect(Selector("div").withText("bill-<blNumber 2>-local.tt").exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();
});
