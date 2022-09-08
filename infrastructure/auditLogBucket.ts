import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Components } from "gs-pulumi-library";

import { kmsCmkAlias } from "./kms";
import { originAccessIdentity } from "./originAccessIdentity";

const config = {
  vckitStack: pulumi.getStack(),
  vckitApp: process.env.APP_NAME,
  vckitEnv: process.env.ENV,
};

//
// Create S3 Bucket for audit logs
// NB - SSE-KMS is not supported for s3 access logging
// (https://aws.amazon.com/premiumsupport/knowledge-center/s3-server-access-log-not-delivered/)
export const auditLogBucket = new Components.aws.S3Bucket(`${config.vckitStack}-audit-logs`, {
  description: `S3 Bucket for ${config.vckitStack} audit logs.`,
  bucketName: `${config.vckitStack}-audit-logs`,
  logBucket: "none",
  forceDestroy: true,
});

const auditLogBucketPolicy = new aws.s3.BucketPolicy(`auditLog-bucketPolicy`, {
  bucket: auditLogBucket.bucket.bucket, // refer to the bucket created earlier
  policy: pulumi.all([auditLogBucket.bucket.arn, originAccessIdentity.iamArn]).apply(([bucketArn, iamArn]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: ["logging.s3.amazonaws.com"], // S3 Logging Service
            AWS: [iamArn], // Cloudfront originAccessIdentity
          },
          Action: ["s3:PutObject"],
          Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
        },
      ],
    })
  ),
});
