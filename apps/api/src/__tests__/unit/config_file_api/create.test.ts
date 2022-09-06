import { createConfigHandler } from "../../../config/create";
import * as databaseService from "../../../common/services/database";
import * as configFileServices from "../../../config/utils/configFile";
import { configFile } from "../../../common/fixtures/configFile";

const successfulInsertResponse = {
  acknowledged: true,
  insertedCount: 1,
  insertedIds: { "0": "62c7604f65634dcc8f29e8f3" },
};

const mockedValidateConfigFile = jest.spyOn(
  configFileServices,
  "validateConfigFile"
);

const configFiles = [configFile];

const eventBody = { body: { configFiles } };

const mockedinsertDocuments = jest
  .spyOn(databaseService, "insertDocuments")
  .mockResolvedValue(successfulInsertResponse as any);

describe("storeConfigFiles", () => {
  it("should store a config file", async () => {
    const response = await createConfigHandler(eventBody);
    expect(mockedValidateConfigFile).toBeCalledWith(configFile);
    expect(mockedValidateConfigFile).toBeCalledTimes(1);
    expect(mockedinsertDocuments).toBeCalledWith(configFiles);
    expect(mockedinsertDocuments).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        data: {
          message: "Documents saved",
          savedDocuments: successfulInsertResponse.insertedIds,
        },
      })
    );
  });

  it("should throw an error if invalid config file is provided", async () => {
    const response = await createConfigHandler({
      body: { configFiles: [{ ...configFile, test: "property" }] },
    } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message: `Invalid config file: ${JSON.stringify([
            {
              instancePath: "",
              schemaPath: "#/additionalProperties",
              keyword: "additionalProperties",
              params: { additionalProperty: "test" },
              message: "must NOT have additional properties",
            },
          ])})}`,
        },
      })
    );
  });

  it("should throw an error if event.body is empty", async () => {
    const response = await createConfigHandler({ body: null } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "You need to provide at least one config file and it must be in an array",
        },
      })
    );
  });

  it("should throw an error if event.body.configFiles list is empty", async () => {
    const response = await createConfigHandler({
      body: { configFiles: [] },
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "You need to provide at least one config file and it must be in an array",
        },
      })
    );
  });

  it("should throw an error if event.body.configFiles doesn't contain objects", async () => {
    const response = await createConfigHandler({
      body: {
        configFiles: [configFile, "notAnObject"],
      },
    } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message: "Config file must be an object and contain data",
        },
      })
    );
  });

  it("should throw an error if event.body.configFiles contains an empty object", async () => {
    const response = await createConfigHandler({
      body: {
        configFiles: [configFile, {}],
      },
    } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message: "Config file must be an object and contain data",
        },
      })
    );
  });

  it("should throw an error if event.body.configFiles is an object", async () => {
    const response = await createConfigHandler({
      body: {
        configFiles: {},
      },
    } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "You need to provide at least one config file and it must be in an array",
        },
      })
    );
  });

  it("should return server error when unknown error is thrown", async () => {
    mockedValidateConfigFile.mockImplementationOnce(() => {
      throw new Error("");
    });
    const response = await createConfigHandler(eventBody);
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 500,
          message: "There has been an unexpected error",
        },
      })
    );
  });
});
