process.env.BUCKET_NAME = "document-storage-api";
process.env.S3_REGION = "ap-southeast-2";
process.env.DATABASE_URL = "test";
process.env.CONFIGFILE_DATABASE_COLLECTION_NAME = "test";
process.env.DATABASE_SERVER_SELECTION_TIMEOUT = 1000;

process.env.API_ENDPOINT = process.env.VCKIT_API_DOMAIN || "https://api.morgatron.click"
if (process.env.IS_OFFLINE === "true") {
  process.env.STORAGE_ENDPOINT = "http://localhost:5010/dev";
  process.env.API_ENDPOINT = "http://localhost:5010/dev";
}

jest.setTimeout(25000); // verify endpoint is a bit slow can take up to 10 seconds
