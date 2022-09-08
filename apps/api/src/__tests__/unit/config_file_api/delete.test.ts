import { deleteConfigHandler } from "../../../config/delete";
import * as databaseService from "../../../common/services/database";

const deleteDocumentMock = jest.spyOn(databaseService, "deleteDocument");

const documentId = "6298335b3026a750b44d12fb";
const deleteDocumentEvent = { pathParameters: { id: documentId } };

describe("delete handler", () => {
  it("should delete a config file", async () => {
    deleteDocumentMock.mockResolvedValueOnce("" as any);

    const response = await deleteConfigHandler(deleteDocumentEvent);
    expect(deleteDocumentMock).toBeCalledTimes(1);
    expect(deleteDocumentMock).toBeCalledWith(documentId);
    expect(response.body).toBe(
      JSON.stringify({ data: { message: "Document deleted", documentId } })
    );
  });

  it("should throw error if id is missing", async () => {
    const response = await deleteConfigHandler({
      pathParameters: { id: null },
    } as any);
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(
      JSON.stringify({
        error: { code: 400, message: "Please provide a valid document ID" },
      })
    );
  });

  it("should return server error when unknown error is thrown", async () => {
    deleteDocumentMock.mockRejectedValueOnce(new Error(""));
    const response = await deleteConfigHandler(deleteDocumentEvent);
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(
      JSON.stringify({
        error: { code: 500, message: "There has been an unexpected error" },
      })
    );
  });
});
