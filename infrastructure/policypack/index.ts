import { PolicyPack } from "@pulumi/policy";

import { Policies } from "gs-pulumi-library";

new PolicyPack("gs-aws-policies", {
  enforcementLevel: "mandatory",
  policies: [
    // API Gateway Policies
    Policies.aws.ApiGateway.apiGatewayEndpointType,

    // Cloudfront Policies
    Policies.aws.Cloudfront.cloudfrontAccesslogsEnabled,
    Policies.aws.Cloudfront.cloudFrontOriginAccessIdentityEnabled,

    // KMS Policies
    Policies.aws.Kms.cmkBackingKeyRotationEnabled,

    // Lambda Policies
    Policies.aws.Lambda.lambdaInsideVpc,

    // Storage Policies
    { ...Policies.aws.S3.s3BucketLoggingEnabled, enforcementLevel: "advisory" }, // Override default `enforcementLevel`
    {
      ...Policies.aws.S3.s3BucketServiceSideEncryptionEnabled,
      enforcementLevel: "advisory",
    }, // Override default `enforcementLevel`

    // VPC Policies
    Policies.aws.Vpc.vpcFlowLogsEnabled,
    Policies.aws.Vpc.vpcDefaultSecurityGroupClosed,
  ],
});
