import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Components } from "gs-pulumi-library";

import { auditLogBucket } from "./auditLogBucket";
import { kmsCmkAlias } from "./kms";
import { originAccessIdentity } from "./originAccessIdentity";

const config = {
  hostedZoneDomain: process.env.TARGET_DOMAIN,
  dvpDomain: process.env.VCKIT_DOMAIN,
  dvpApp: process.env.APP_NAME,
  dvpEnv: process.env.ENV,
};

if (!(config.hostedZoneDomain && config.dvpDomain && config.dvpApp && config.dvpEnv)) {
  throw new pulumi.RunError(`Missing one or more of the required environment variables: TARGET_DOMAIN, VCKIT_DOMAIN, APP_NAME, ENV"`);
}

//
// Create S3 Bucket and Cloudfront Distribution for `dvpWebsite`
const dvpWebsiteS3Bucket = new Components.aws.S3Bucket("dvpWebsiteS3Bucket", {
  description: "S3 Bucket for `dvpWebsite` static website contents.",
  bucketName: config.dvpDomain,
  /**
   * NOTE on argument `kmsMasterKeyId` -
   * Cloudfront cannot by default access S3 objects encrypted with SSE-KMS. To do so requires setting up Cloudfront Lambda@Edge.
   * See: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
   * Therefore - for the moment we omit the `kmsMasterKeyId` and thus default to using standard SSE-S3 encryption on this bucket.
   * TODO - clarify requirements with client.
   */
  // kmsMasterKeyId: kmsCmkAlias.targetKeyId,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `s3/${config.dvpDomain}/`,
  pathToBucketContents: "../artifacts/dvp-website-build",
  website: { indexDocument: "index.html", errorDocument: "index.html" },
  forceDestroy: true,
});
const dvpWebsite = new Components.aws.CloudfrontWebsite("dvpWebsite", {
  description: "Static website for dvpWebsite SPA. Stored on S3. Served via Cloudfront",

  s3Bucket: dvpWebsiteS3Bucket.bucket,

  hostedZoneDomain: config.hostedZoneDomain,
  targetDomain: config.dvpDomain,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `cloudfront/${config.dvpDomain}/`,
  originAccessIdentity: originAccessIdentity,
});

export const dvpWebsiteBucketName = dvpWebsiteS3Bucket.bucketName();
export const dvpWebsiteCloudfrontAliases = dvpWebsite.cloudfrontAliases();
