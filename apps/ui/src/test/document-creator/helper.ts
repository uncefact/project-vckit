import { Selector, t } from "testcafe";

const PasswordField = Selector("[data-testid='password-field']");
const ButtonLogin = Selector("[data-testid='login-button']");
const ConfigFileDropZoneInput = Selector("[data-testid='config-file-dropzone'] input");
// fixtures

export const configLocal = "./../src/test/fixtures/config/test/sample-config-local.json";
export const configLocalErrorDocumentIssue = "./../src/test/fixtures/config/test/config-invalid-issuer.json";
export const configLocalWalletless = "./../src/test/fixtures/config/test/config-empty-wallet.json";
export const configRopsten = "./../src/test/fixtures/config/v2/sample-config-ropsten.json";
export const dataFileJsonEblMissingFields =
  "./../src/test/fixtures/data-file/v2/sample-data-file-ebl-error-missing-fields.json";
export const dataFileJsonCoo = "./../src/test/fixtures/data-file/v2/sample-data-file-coo.json";
export const dataFileJsonEbl = "./../src/test/fixtures/data-file/v2/sample-data-file-ebl.json";
export const dataFileCsvEbl = "./../src/test/fixtures/data-file/v2/sample-data-file-ebl.csv";
export const dataFileCsvCoo = "./../src/test/fixtures/data-file/v2/sample-data-file-coo.csv";
export const dataFileCsvCooV3 = "./../src/test/fixtures/data-file/v3/sample-data-file-coo-v3.csv";
export const samplePdf = "./../src/test/fixtures/sample-file.pdf";
export const samplePdf6Mb = "./../src/test/fixtures/sample-file-6MB.pdf";
export const documentRevoked = "./../src/test/fixtures/sample-files/v2/wrapped/wrapped-document-local-revokable.json";

export const loadConfigFile = async (configFile: string): Promise<void> => {
  await t.setFilesToUpload(ConfigFileDropZoneInput, [configFile]);
};

export const enterPassword = async (password: string): Promise<void> => {
  await t.typeText(PasswordField, password);
  await t.click(ButtonLogin);
};

export const deletePassword = async (): Promise<void> => {
  await t.selectText(PasswordField).pressKey("delete");
};
