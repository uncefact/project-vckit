import { RunError } from "@pulumi/pulumi";

if (
  !(
    process.env.CONFIGFILE_DATABASE_COLLECTION_NAME &&
    process.env.DATABASE_SERVER_SELECTION_TIMEOUT &&
    process.env.TARGET_DOMAIN &&
    process.env.VCKIT_API_DOMAIN
  )
) {
  throw new RunError(
    `Missing one or more of the required environment variables: CONFIGFILE_DATABASE_COLLECTION_NAME, DATABASE_SERVER_SELECTION_TIMEOUT, TARGET_DOMAIN, VCKIT_API_DOMAIN"}`
  );
}

export const config = {
  targetDomain: process.env.TARGET_DOMAIN,
  vckitApiDomain: process.env.VCKIT_API_DOMAIN,
  databaseCollectionName: process.env.CONFIGFILE_DATABASE_COLLECTION_NAME,
  databaseServerSelectionTimeout: process.env.DATABASE_SERVER_SELECTION_TIMEOUT,
  databaseOptions: {
    tls: "true",
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: "false",
  },
};
