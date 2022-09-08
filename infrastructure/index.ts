import * as auditLogBucket from "./auditLogBucket";
import * as documentDb from "./documentDb";
import * as kms from "./kms";
import * as storageApi from "./api";
import * as vpcs from "./vpcs";
import * as staticWebsites from "./staticWebsites";

export = async () => {
  // Reference all other modules here
  return {
    auditLogBucket: auditLogBucket,
    documentDb: documentDb,
    kms: kms,
    staticWebsites: staticWebsites,
    storageApi: storageApi,
    vpcs: vpcs,
  };
};
