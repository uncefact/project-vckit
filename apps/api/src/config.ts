import AWS from "aws-sdk";
import {
  ApiConfigFile,
  CommonConfig,
  ConfigFileApiConfig,
  StorageApiConfig,
  VcApiConfig,
} from "./common/types";

export const network = process.env.NETWORK || "ropsten";

const vcApiConfig: VcApiConfig = {
  issuerKeyCollectionName: process.env.KEY_COLLECTION_NAME || "keyList",
  awsRegion: process.env.AWS_REGION || "ap-southeast-2",
  kmsCustomerMasterKeyId: process.env.KMS_MASTER_KEY_ID || "",
};

// storageApi
if (!process.env.BUCKET_NAME) throw new Error("Please provide a bucket name");
if (!process.env.S3_REGION) throw new Error("Please provide an S3 region");

// configFileApi
if (!process.env.CONFIGFILE_DATABASE_COLLECTION_NAME)
  throw Error("Please provide a config file database collection name");

// common
if (!process.env.DATABASE_URL) throw Error("Please provide a database url");
if (!process.env.DATABASE_SERVER_SELECTION_TIMEOUT)
  throw Error("Please provide a database server selection timeout");

const storageApiConfig: StorageApiConfig = {
  bucketName: process.env.BUCKET_NAME,
  s3: {
    region: process.env.S3_REGION,
    ...(process.env.IS_OFFLINE
      ? {
          s3ForcePathStyle: true,
          accessKeyId: "S3RVER",
          secretAccessKey: "S3RVER",
          endpoint: new AWS.Endpoint("http://localhost:8000"),
        }
      : {}),
  },
};

const configFileApiConfig: ConfigFileApiConfig = {
  collectionName: process.env.CONFIGFILE_DATABASE_COLLECTION_NAME,
};

const commonConfig: CommonConfig = {
  databaseEndpoint: `${process.env.DATABASE_URL}`,
  connectionOptions: {
    ...(!process.env.IS_OFFLINE
      ? {
          tlsCAFile: "./rds-combined-ca-bundle.pem",
        }
      : {}),
    serverSelectionTimeoutMS: parseInt(
      process.env.DATABASE_SERVER_SELECTION_TIMEOUT
    ),
  },
};

export const config: ApiConfigFile = {
  ...commonConfig,
  ...storageApiConfig,
  ...configFileApiConfig,
  ...vcApiConfig,
};
