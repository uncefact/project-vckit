import { MongoClient } from "mongodb";
import { CustomError, ErrorTypes } from "../../common/utils/customErrors";
import { config } from "../../config";
import { ApiLogNamespace, logger } from "../../common/utils/logger";

const LOG_NAME = ApiLogNamespace.VCApi;

let dbConnection: any;

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

export const listAllDocuments = async () => {
  const db = await getDb();
  return db.collection(config.issuerKeyCollectionName).find().toArray();
};

export const addOne = async (document: Record<string, unknown>) => {
  const db = await getDb();

  try {
    return db.collection(config.issuerKeyCollectionName).insertOne(document);
  } catch (err: any) {
    throw new CustomError(
      ErrorTypes.DatabaseError,
      "There has been an error while adding signing key"
    );
  }
};

export const findOne = async (queryObj = {}) => {
  const db = await getDb();
  try {
    return db.collection(config.issuerKeyCollectionName).findOne(queryObj);
  } catch (err: any) {
    logger.error(
      LOG_NAME,
      `Error retrieving query: ${JSON.stringify({
        queryObj: queryObj,
        message: err.message,
      })}`
    );
    throw new CustomError(ErrorTypes.DatabaseError, "Error querying databse");
  }
};
