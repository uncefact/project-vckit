import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, dataFileCsvCoo, dataFileCsvCooV3 } from "./helper";
import { join } from "path";
import { homedir } from "os";
import { existsSync, readFileSync, unlinkSync } from "fs";

fixture("Data upload").page`http://localhost:3000`;

// Template selector
const Button = Selector("button");
const FillFormTitle = Selector("[data-testid='fill-form-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");

// Form component selector
const documentNumberInput = Selector("[data-testid='document-number-input']");
const documentNameSelect = Selector("[data-testid='document-name-select']");
const downloadCsvDataFileButton = Selector("[data-testid='download-csv-data-schema-button']");
const downloadJsonDataFileButton = Selector("[data-testid='download-json-data-schema-button']");
const fileNameField = Selector("[data-testid='file-name-input']");

// Form fields component selector
const V2COOiDField = Selector("#root_iD");
const V2COOIssueDateTimeField = Selector("#root_issueDateTime");
const V3COOiDField = Selector("#root_credentialSubject_iD");
const V3COOIssueDateTimeField = Selector("#root_credentialSubject_issueDateTime");
const DataFileDropZoneInput = Selector("[data-testid='data-file-dropzone'] input");

function getFileDownloadPath(fileName: string): string {
  return join(homedir(), "Downloads", fileName);
}

// From https://stackoverflow.com/a/57624660/950462
const waitForFileDownload = async (t: TestController, filePath: string): Promise<boolean> => {
  // Timeout after 10 seconds
  for (let i = 0; i < 100; i++) {
    if (existsSync(filePath)) return true;
    await t.wait(100);
  }
  return existsSync(filePath);
};

const deleteDownloadFile = async (filePath: string): Promise<void> => {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
};

test("should upload populate data fields correctly for version 2 document", async (t) => {
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

  // download csv data sample file
  await t.click(downloadCsvDataFileButton);
  const csvFilePath = getFileDownloadPath("sample-data.csv");
  await t.expect(await waitForFileDownload(t, csvFilePath)).eql(true);
  const csvFileContent = readFileSync(csvFilePath, "utf8");
  await t.expect(csvFileContent).contains("iD,issueDateTime");
  await deleteDownloadFile(csvFilePath);

  //download json data sample file
  await t.click(downloadJsonDataFileButton);
  const jsonFilePath = getFileDownloadPath("sample-data.json");
  await t.expect(await waitForFileDownload(t, jsonFilePath)).eql(true);
  const jsonFileContent = JSON.parse(readFileSync(jsonFilePath, "utf8"));
  await t.expect(jsonFileContent.data).contains({ iD: "", issueDateTime: "" });
  await deleteDownloadFile(jsonFilePath);
  // Upload data file
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileCsvCoo]);

  // Validated the content is overwritten by the data file
  await t.expect(documentNameSelect.innerText).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v2-2");
  await t.expect(fileNameField.value).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v2-2");
  await t.expect(V2COOiDField.value).eql("SampleId-1");
  await t.expect(V2COOIssueDateTimeField.value).eql("2015-01-01T00:00:00.000");

  // Check next document
  await t.typeText(documentNumberInput, "3", { replace: true });
  await t.expect(documentNameSelect.innerText).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v2-3");
  await t.expect(fileNameField.value).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v2-3");
  await t.expect(V2COOiDField.value).eql("SampleId-2");
  await t.expect(V2COOIssueDateTimeField.value).eql("2015-01-02T00:00:00.000");
});

test("should upload populate data fields correctly for version 3 document", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust ChAFTA Certificate of Origin v3"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // download csv data sample file
  await t.click(downloadCsvDataFileButton);
  const csvFilePath = getFileDownloadPath("sample-data.csv");
  await t.expect(await waitForFileDownload(t, csvFilePath)).eql(true);
  const csvFileContent = readFileSync(csvFilePath, "utf8");
  await t.expect(csvFileContent).contains("credentialSubject.iD,credentialSubject.issueDateTime");
  await deleteDownloadFile(csvFilePath);

  //download json data sample file
  await t.click(downloadJsonDataFileButton);
  const jsonFilePath = getFileDownloadPath("sample-data.json");
  await t.expect(await waitForFileDownload(t, jsonFilePath)).eql(true);
  const jsonFileContent = JSON.parse(readFileSync(jsonFilePath, "utf8"));
  await t.expect(jsonFileContent.data.credentialSubject).contains({ iD: "", issueDateTime: "" });
  await deleteDownloadFile(jsonFilePath);

  // Upload data file
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileCsvCooV3]);

  // Validated the content is overwritten by the data file
  await t.expect(documentNameSelect.innerText).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v3-2");
  await t.expect(fileNameField.value).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v3-2");
  await t.expect(V3COOiDField.value).eql("SampleId-1");
  await t.expect(V3COOIssueDateTimeField.value).eql("2021-01-01T00:00:00.000");

  // Check next document
  await t.typeText(documentNumberInput, "3", { replace: true });
  await t.expect(documentNameSelect.innerText).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v3-3");
  await t.expect(fileNameField.value).eql("TradeTrust-ChAFTA-Certificate-of-Origin-v3-3");
  await t.expect(V3COOiDField.value).eql("SampleId-2");
  await t.expect(V3COOIssueDateTimeField.value).eql("2021-02-01T00:00:00.000");
});
