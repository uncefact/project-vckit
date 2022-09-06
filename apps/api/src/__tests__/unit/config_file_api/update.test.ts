import { updateConfigHandler } from "../../../config/update";
import * as databaseService from "../../../common/services/database";
import * as configFileService from "../../../config/utils/configFile";

const updateDocumentMock = jest.spyOn(databaseService, "updateDocument");

const validateConfigFilesMock = jest.spyOn(
  configFileService,
  "validateConfigFile"
);

const documentId = "6298335b3026a750b44d12fb";
const configFile = { test: "data" };
const event = {
  pathParameters: { id: documentId },
  body: { configFile },
};

describe("update config file", () => {
  it("should replace existing config file with the provided config file", async () => {
    updateDocumentMock.mockResolvedValueOnce("" as any);
    validateConfigFilesMock.mockImplementationOnce(() => "");

    const response = await updateConfigHandler(event);

    expect(validateConfigFilesMock).toBeCalledTimes(1);
    expect(validateConfigFilesMock).toBeCalledWith(configFile);
    expect(updateDocumentMock).toBeCalledTimes(1);
    expect(updateDocumentMock).toBeCalledWith(documentId, configFile);
    expect(response.body).toBe(
      JSON.stringify({
        data: {
          id: documentId,
          message: "Document updated",
        },
      })
    );
  });

  it("should throw an error if id is empty", async () => {
    const response = await updateConfigHandler({
      pathParameters: { id: null as any },
      body: { configFile: { test: "configFile" } },
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(
      JSON.stringify({
        error: { code: 400, message: "Please provide a valid document ID" },
      })
    );
  });

  it("should throw an error if event.body is empty", async () => {
    const response = await updateConfigHandler({
      pathParameters: { id: documentId },
      body: null,
    } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(
      JSON.stringify({
        error: { code: 400, message: "Please provide a config file" },
      })
    );
  });

  it("should return server error when unknown error is thrown", async () => {
    validateConfigFilesMock.mockImplementationOnce(() => {
      throw new Error("");
    });
    const response = await updateConfigHandler(event);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(
      JSON.stringify({
        error: { code: 500, message: "There has been an unexpected error" },
      })
    );
  });
});
