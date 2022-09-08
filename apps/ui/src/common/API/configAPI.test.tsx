import axios from "axios";
import { getConfigFile } from "./configFileAPI";
import { VCKIT_API, CONFIG_FILE_ROUTE } from "../../appConfig";

jest.mock("../../appConfig", () => ({
  VCKIT_API: "api.vckit-test.com",
  CONFIG_FILE_ROUTE: "config-file",
}));

const mockedAxiosGet = jest.spyOn(axios, "get");

describe("configFileAPI", () => {
  const configFileId = "testID";

  it("should return a config file for a given id", async () => {
    mockedAxiosGet.mockResolvedValueOnce({ data: { data: { test: "ConfigFile" } } });

    const configFile = await getConfigFile(configFileId);

    expect(configFile).toStrictEqual({ test: "ConfigFile" });
    expect(mockedAxiosGet).toBeCalledWith(`${VCKIT_API}/${CONFIG_FILE_ROUTE}/${configFileId}`);
  });

  it("should throw an error if no config file is found", async () => {
    mockedAxiosGet.mockRejectedValueOnce(new Error());

    expect(getConfigFile(configFileId)).rejects.toThrow();
  });
});
