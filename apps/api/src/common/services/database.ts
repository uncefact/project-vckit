import { MongoClient, Db, ObjectId } from "mongodb";
import { config } from "../../config";
import { CustomError, ErrorTypes } from "../utils/customErrors";
import { ApiLogNamespace, logger } from "../utils/logger";

let dbConnection: Db | undefined;

export const getDb = async () => {
  if (!dbConnection) {
    try {
      const client = await MongoClient.connect(
        config.databaseEndpoint,
        config.connectionOptions
      );
      dbConnection = client.db();
    } catch (err: any) {
      logger.error(
        ApiLogNamespace.Server,
        `Database connection error: ${err.message}`
      );
      throw new CustomError(
        ErrorTypes.DatabaseError,
        "There has been an error connecting to the database"
      );
    }
  }
  return dbConnection;
};

export const insertDocuments = async (documents: Record<string, unknown>[]) => {
  const db = await getDb();
  return db.collection(config.collectionName).insertMany(documents);
};

export const listAllDocuments = async () => {
  const db = await getDb();
  return db.collection(config.collectionName).find().toArray();
};

export const getDocument = async (documentId: string) => {
  const db = await getDb();
  try {
    return await db
      .collection(config.collectionName)
      .findOne(new ObjectId(documentId));
  } catch {
    logger.error(
      ApiLogNamespace.ConfigApi,
      `Invalid document Id: ${documentId}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Invalid document ID. Please provide a valid document ID"
    );
  }
};

export const deleteDocument = async (documentId: string) => {
  const db = await getDb();
  try {
    return await db
      .collection(config.collectionName)
      .deleteOne({ _id: new ObjectId(documentId) });
  } catch {
    logger.error(
      ApiLogNamespace.ConfigApi,
      `Invalid document ID or document doesn't exist: ${documentId}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Invalid document ID. Please provide a valid document ID"
    );
  }
};

export const updateDocument = async (
  documentId: string,
  document: Record<string, unknown>
) => {
  const db = await getDb();
  try {
    return await db
      .collection(config.collectionName)
      .updateOne({ _id: new ObjectId(documentId) }, { $set: document });
  } catch (err) {
    logger.error(
      ApiLogNamespace.ConfigApi,
      `Error replacing the document: ${JSON.stringify({
        documentId,
        document,
      })}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Error replacing the document for the given document ID"
    );
  }
};

export const replaceOrCreateDocument = async (
  documentId: string,
  document: Record<string, unknown>
) => {
  const db = await getDb();
  try {
    return await db
      .collection(config.collectionName)
      .replaceOne(
        { _id: new ObjectId(documentId) },
        { ...document },
        { upsert: true }
      );
  } catch (err) {
    logger.error(
      ApiLogNamespace.ConfigApi,
      `Error replacing the document: ${JSON.stringify({
        documentId,
        document,
      })}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Error replacing the document for the given document ID"
    );
  }
};
