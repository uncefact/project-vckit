import * as services from "../../../config/utils/configFile";
import * as configFiles from "../../../common/fixtures/databaseSeedData/configFiles.json";

jest.spyOn(services, "validateConfigFile");

describe("validateConfigFile", () => {
  it("should validate a config file", () => {
    services.validateConfigFile(configFiles[0]);
    expect(services.validateConfigFile).toBeCalledWith(configFiles[0]);
  });
  it("should throw error if config file is empty", () => {
    expect(() => services.validateConfigFile({} as any)).toThrow();
  });
  it("should throw error if config file is not an object", () => {
    expect(() => services.validateConfigFile([] as any)).toThrow();
  });
  it("should throw error if invalid config file is provided", () => {
    expect(() =>
      services.validateConfigFile({ test: "configFile" } as any)
    ).toThrow();
  });
});
