import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const stack = pulumi.getStack();

if (!process.env.AWS_ACCOUNT_ID) {
  throw new Error("Please provide an aws account id");
}

const accountId = process.env.AWS_ACCOUNT_ID;

export const kmsCmk = new aws.kms.Key(`${stack}-CMK`, {
  enableKeyRotation: true, // Enable as desired
  description: `KMS Customer Managed Key for stack: ${stack}`,
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "Enable IAM User Permissions",
        Effect: "Allow",
        Principal: {
          AWS: [accountId],
        },
        Action: "kms:*",
        Resource: "*",
      },
      {
        Sid: "Allow VPC Flow Logs to use the key",
        Effect: "Allow",
        Principal: {
          Service: ["delivery.logs.amazonaws.com", "logs.amazonaws.com", "vpc-flow-logs.amazonaws.com"],
        },
        Action: ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"],
        Resource: "*",
      },
    ],
  }),
});

export const kmsCmkAlias = new aws.kms.Alias(`${stack}-CMK-alias`, {
  name: `alias/${stack}-CMK`,
  targetKeyId: kmsCmk.keyId,
});
