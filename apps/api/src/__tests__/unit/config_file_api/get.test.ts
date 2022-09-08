import { ObjectId } from "mongodb";
import { listAllHandler, getConfigHandler } from "../../../config/get";
import * as database from "../../../common/services/database";

const successfulFindResponse = {
  _id: new ObjectId("6298335b3026a750b44d12fb"),
  test: "data",
};

const eventBody = {
  pathParameters: { id: "6298335b3026a750b44d12fb" },
};

const mockedListAllDocuments = jest
  .spyOn(database, "listAllDocuments")
  .mockResolvedValue([successfulFindResponse]);

const mockedGetDocument = jest
  .spyOn(database, "getDocument")
  .mockResolvedValue(successfulFindResponse);

describe("getHandler", () => {
  describe("listAllDocuments", () => {
    it("should return all documents in a collection", async () => {
      const response = await listAllHandler();
      expect(mockedListAllDocuments).toBeCalledTimes(1);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(
        JSON.stringify({ data: { documents: [successfulFindResponse] } })
      );
    });

    it("should return server error when an unexpected error is thrown", async () => {
      mockedListAllDocuments.mockRejectedValueOnce(new Error(""));
      const response = await listAllHandler();
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe(
        JSON.stringify({
          error: {
            code: 500,
            message: "There has been an unexpected error",
          },
        })
      );
    });
  });

  describe("getDocument", () => {
    it("should return a document matching the provided id", async () => {
      const response = await getConfigHandler(eventBody);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(
        JSON.stringify({ data: { document: { test: "data" } } })
      );
    });

    it("should return response if document doesn't exist", async () => {
      mockedGetDocument.mockResolvedValueOnce(null);

      const response = await getConfigHandler(eventBody);

      expect(response.body).toBe(
        JSON.stringify({
          error: {
            code: 400,
            message:
              "Document doesn't exist. Please provide an ID for a document that exists",
          },
        })
      );
    });

    it("should throw badUserInput error if id is missing", async () => {
      const response = await getConfigHandler({ pathParameters: { id: "" } });
      expect(response.statusCode).toBe(400);
      expect(response.body).toBe(
        JSON.stringify({
          error: {
            code: 400,
            message: "Please provide a valid document ID",
          },
        })
      );
    });

    it("should return server error when an unexpected error is thrown", async () => {
      mockedGetDocument.mockRejectedValueOnce(new Error(""));
      const response = await getConfigHandler(eventBody);
      expect(response.statusCode).toBe(500);
      expect(response.body).toBe(
        JSON.stringify({
          error: {
            code: 500,
            message: "There has been an unexpected error",
          },
        })
      );
    });
  });
});
