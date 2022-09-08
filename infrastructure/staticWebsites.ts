import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Components } from "gs-pulumi-library";

import { auditLogBucket } from "./auditLogBucket";
import { kmsCmkAlias } from "./kms";
import { originAccessIdentity } from "./originAccessIdentity";

const config = {
  hostedZoneDomain: process.env.TARGET_DOMAIN,
  vckitDomain: process.env.VCKIT_DOMAIN,
  vckitApp: process.env.APP_NAME,
  vckitEnv: process.env.ENV,
};

if (!(config.hostedZoneDomain && config.vckitDomain && config.vckitApp && config.vckitEnv)) {
  throw new pulumi.RunError(`Missing one or more of the required environment variables: TARGET_DOMAIN, VCKIT_DOMAIN, APP_NAME, ENV"`);
}

//
// Create S3 Bucket and Cloudfront Distribution for `vckitWebsite`
const vckitWebsiteS3Bucket = new Components.aws.S3Bucket("vckitWebsiteS3Bucket", {
  description: "S3 Bucket for `vckitWebsite` static website contents.",
  bucketName: config.vckitDomain,
  /**
   * NOTE on argument `kmsMasterKeyId` -
   * Cloudfront cannot by default access S3 objects encrypted with SSE-KMS. To do so requires setting up Cloudfront Lambda@Edge.
   * See: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
   * Therefore - for the moment we omit the `kmsMasterKeyId` and thus default to using standard SSE-S3 encryption on this bucket.
   * TODO - clarify requirements with client.
   */
  // kmsMasterKeyId: kmsCmkAlias.targetKeyId,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `s3/${config.vckitDomain}/`,
  pathToBucketContents: "../artifacts/vckit-website-build",
  website: { indexDocument: "index.html", errorDocument: "index.html" },
  forceDestroy: true,
});
const vckitWebsite = new Components.aws.CloudfrontWebsite("vckitWebsite", {
  description: "Static website for vckitWebsite SPA. Stored on S3. Served via Cloudfront",

  s3Bucket: vckitWebsiteS3Bucket.bucket,

  hostedZoneDomain: config.hostedZoneDomain,
  targetDomain: config.vckitDomain,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `cloudfront/${config.vckitDomain}/`,
  originAccessIdentity: originAccessIdentity,
});

export const vckitWebsiteBucketName = vckitWebsiteS3Bucket.bucketName();
export const vckitWebsiteCloudfrontAliases = vckitWebsite.cloudfrontAliases();
