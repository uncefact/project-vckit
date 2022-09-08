import { MongoClient, ObjectId } from "mongodb";
import { config } from "../../../config";
import * as databaseService from "../../../common/services/database";

let database: any;
const mockedFindOne = jest.fn();
const mockedToArray = jest.fn();
const mockedInsertMany = jest.fn();
const mockedDeleteOne = jest.fn();
const mockedUpdateOne = jest.fn();
const mockedReplaceOne = jest.fn();
const mockedFind = jest.fn(() => ({ toArray: mockedToArray }));

const mockedCollection = {
  collection: jest.fn(() => ({
    insertMany: mockedInsertMany,
    find: mockedFind,
    findOne: mockedFindOne,
    updateOne: mockedUpdateOne,
    deleteOne: mockedDeleteOne,
    replaceOne: mockedReplaceOne,
  })),
};

const mockedDbObject = {
  db: jest.fn(() => mockedCollection),
};

const mockedMongoClient = jest.spyOn(MongoClient, "connect");
mockedMongoClient.mockImplementation(() => mockedDbObject);

describe("database", () => {
  describe("databaseClient", () => {
    beforeEach(async () => {
      return import("../../../common/services/database").then((module) => {
        database = module;
        jest.resetModules();
      });
    });

    it("should connect to the database", async () => {
      const client = await database.getDb();
      expect(mockedMongoClient).toBeCalledWith(
        config.databaseEndpoint,
        config.connectionOptions
      );
      expect(mockedMongoClient).toBeCalledTimes(1);
      expect(mockedDbObject.db).toBeCalledTimes(1);
      expect(client).toMatchObject(mockedCollection);
    });

    it("should throw an error if the database endpoint is missing", async () => {
      config.databaseEndpoint = "";
      await expect(database.getDb()).rejects.toThrow();
    });

    describe("persistentDatabaseClient", () => {
      it("should return a client if the connection already exists", async () => {
        await databaseService.getDb();
        const client = await databaseService.getDb();
        expect(mockedDbObject.db).toBeCalledTimes(1);
        expect(client).toMatchObject(mockedCollection);
      });
    });

    describe("insertDocuments", () => {
      config.databaseEndpoint = `${process.env.DATABASE_URL}`;
      beforeEach(() => {
        jest.resetModules();
        return import("../../../common/services/database").then((module) => {
          database = module;
          jest
            .spyOn(database, "getDb")
            .mockImplementation(() => mockedCollection);
        });
      });

      it("should insert a document", async () => {
        await database.insertDocuments([{ test: "object" }]);
        expect(mockedCollection.collection).toBeCalledTimes(1);
        expect(mockedCollection.collection).toBeCalledWith(
          config.collectionName
        );
        expect(mockedInsertMany).toBeCalledTimes(1);
        expect(mockedInsertMany).toBeCalledWith([{ test: "object" }]);
      });
    });

    describe("listAllDocuments", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        return import("../../../common/services/database").then((module) => {
          database = module;
          jest.resetModules();
          jest
            .spyOn(database, "getDb")
            .mockImplementation(() => mockedCollection);
        });
      });

      it("should list all documents in a collection", async () => {
        mockedToArray.mockReturnValueOnce([
          { test1: "document1", test2: "document1" },
        ]);
        const documents = await database.listAllDocuments();
        expect(mockedCollection.collection).toBeCalledTimes(1);
        expect(mockedCollection.collection).toBeCalledWith(
          config.collectionName
        );
        expect(mockedFind).toBeCalledTimes(1);
        expect(mockedToArray).toBeCalledTimes(1);
        expect(documents).toEqual([{ test1: "document1", test2: "document1" }]);
      });
    });

    describe("findDocument", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        return import("../../../common/services/database").then((module) => {
          database = module;
          jest.resetModules();
          jest
            .spyOn(database, "getDb")
            .mockImplementation(() => mockedCollection);
        });
      });

      it("should retrieve a document from a collection", async () => {
        mockedFindOne.mockReturnValueOnce({ test: "document" });
        const document = await database.getDocument("6298335b3026a750b44d12fb");
        expect(mockedCollection.collection).toBeCalledTimes(1);
        expect(mockedCollection.collection).toBeCalledWith(
          config.collectionName
        );
        expect(mockedFindOne).toBeCalledTimes(1);
        expect(document).toEqual({ test: "document" });
      });

      it("should throw an error if the object id is invalid", async () => {
        await expect(database.getDocument("badId")).rejects.toThrow();
      });
    });

    describe("updateDocument", () => {
      beforeEach(() => {
        return import("../../../common/services/database").then((module) => {
          database = module;
          jest.resetModules();
          jest
            .spyOn(database, "getDb")
            .mockImplementation(() => mockedCollection);
        });
      });

      it("should replace a document if it exists", async () => {
        mockedUpdateOne.mockResolvedValueOnce("Updated");
        const updateDocument = await databaseService.updateDocument(
          "6298335b3026a750b44d12fb",
          { test: "document" }
        );
        expect(mockedUpdateOne).toBeCalledTimes(1);
        expect(mockedUpdateOne).toBeCalledWith(
          { _id: new ObjectId("6298335b3026a750b44d12fb") },
          { $set: { test: "document" } }
        );
        expect(updateDocument).toBe("Updated");
      });

      it("should throw an error if error when replacing the document", async () => {
        mockedUpdateOne.mockRejectedValueOnce(new Error(""));
        await expect(
          database.updateDocument("6298335b3026a750b44d12fb", {
            test: "document",
          })
        ).rejects.toThrow();
      });
    });

    describe("deleteDocument", () => {
      beforeEach(() => {
        return import("../../../common/services/database").then((module) => {
          database = module;
          jest.resetModules();
          jest
            .spyOn(database, "getDb")
            .mockImplementation(() => mockedCollection);
        });
      });

      it("should delete a document if it exists", async () => {
        mockedDeleteOne.mockResolvedValueOnce("Deleted");
        const deleteDocument = await databaseService.deleteDocument(
          "6298335b3026a750b44d12fb"
        );
        expect(mockedDeleteOne).toBeCalledTimes(1);
        expect(mockedDeleteOne).toBeCalledWith({
          _id: new ObjectId("6298335b3026a750b44d12fb"),
        });
        expect(deleteDocument).toBe("Deleted");
      });

      it("should throw an error if error when deleting the document", async () => {
        mockedDeleteOne.mockRejectedValueOnce(new Error(""));
        await expect(
          database.deleteDocument("6298335b3026a750b44d12fb")
        ).rejects.toThrow();
      });
    });

    describe("replaceOrCreateDocument", () => {
      beforeEach(() => {
        return import("../../../common/services/database").then((module) => {
          database = module;
          jest.resetModules();
          jest
            .spyOn(database, "getDb")
            .mockImplementation(() => mockedCollection);
        });
      });

      it("should replace or create a document", async () => {
        mockedReplaceOne.mockResolvedValueOnce("Replaced");
        const replacedDocument = await databaseService.replaceOrCreateDocument(
          "6298335b3026a750b44d12fb",
          { test: "document" }
        );
        expect(mockedReplaceOne).toBeCalledTimes(1);
        expect(mockedReplaceOne).toBeCalledWith(
          { _id: new ObjectId("6298335b3026a750b44d12fb") },
          { test: "document" },
          { upsert: true }
        );
        expect(replacedDocument).toBe("Replaced");
      });

      it("should throw an error if error when replacing or creating the document", async () => {
        mockedReplaceOne.mockRejectedValueOnce(new Error(""));
        await expect(
          database.replaceOrCreateDocument("6298335b3026a750b44d12fb", {
            test: "document",
          })
        ).rejects.toThrow();
      });
    });
  });
});
