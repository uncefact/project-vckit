import * as pulumi from "@pulumi/pulumi";
import { Components } from "gs-pulumi-library";

import { auditLogBucket } from "./auditLogBucket";

const stack = pulumi.getStack();

//
// Create `trustbridgeVpc` and S3 Bucket for VPC Flowlogs
const flowlogBucket = new Components.aws.S3Bucket(`${stack}-trustbridgevpc-flowlogs`, {
  description: "S3 Bucket for `vckitWebsite` static website contents.",
  bucketName: `${stack}-trustbridgevpc-flowlogs`,
  logBucket: auditLogBucket.bucket,
  logBucketPrefix: `s3/trustbridgevpc-flowlogs/`,
  forceDestroy: true,
});

const trustbridgeVpc = new Components.aws.Vpc(`${stack}-trustbridgeVpc`, {
  vpcName: `${stack}-trustbridgeVpc`,
  description: "VPC for the TrustBridge W3C API / UI",
  flowlogBucket: flowlogBucket.bucket,
});

export const trustbridgeVpcDefaultSecurityGroupId = trustbridgeVpc.vpcDefaultSecurityGroupId();
export const trustbridgeVpcId = trustbridgeVpc.vpcId();
export const trustbridgeVpcPrivateSubnetIds = trustbridgeVpc.privateSubnetIds();
export const trustbridgeVpcPublicSubnetIds = trustbridgeVpc.publicSubnetIds();
