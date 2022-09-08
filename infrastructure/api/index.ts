import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { kmsCmkAlias } from "../kms";

import * as documentDB from "../documentDb";
import * as vpc from "../vpcs";
import { bucketPolicy } from "./policies/s3Policies";
import { lambdaRole } from "./roles/lambdaRole";
import { config } from "./config";

const stack = pulumi.getStack();

const apiDir = "../artifacts/api-build"; // directory for content files

////////////////////////////////////////////////////////////////////////////////
// Log group for api
const apiLogGroup = new aws.cloudwatch.LogGroup(`${stack}-api-log-group`);

////////////////////////////////////////////////////////////////////////////////
// S3 bucket for storage-api
const storageApiBucket = new aws.s3.Bucket(`${stack}-storageApi`, {
  bucket: `${stack}-storage-api`,
});

// Set the access policy for the bucket
new aws.s3.BucketPolicy("storageApiBucketPolicy", {
  bucket: storageApiBucket.bucket,
  policy: pulumi
    .all([storageApiBucket.bucket, lambdaRole.arn])
    .apply(([bucket, arn]: Array<any>) => bucketPolicy(bucket, arn)),
});

////////////////////////////////////////////////////////////////////////////////
// Enviroment variables for Lambda functions

const databaseUrl = pulumi
  .all([
    documentDB.schemaRegistryDocumentDbMasterPassword.result,
    documentDB.schemaRegistryDocumentDbCluster.masterUsername,
    documentDB.schemaRegistryDocumentDbCluster.endpoint,
    documentDB.schemaRegistryDocumentDbCluster.port,
  ])
  .apply(([password, username, endpoint, port]: Array<any>) => {
    const urlParams = new URLSearchParams(config.databaseOptions).toString();
    return `mongodb://${username}:${encodeURIComponent(password)}@${endpoint}:${port}/?${urlParams}`;
  });

const enviromentVariables = {
  variables: {
    BUCKET_NAME: storageApiBucket.bucket,
    S3_REGION: storageApiBucket.region,
    DATABASE_URL: databaseUrl,
    CONFIGFILE_DATABASE_COLLECTION_NAME: config.databaseCollectionName,
    DATABASE_SERVER_SELECTION_TIMEOUT: config.databaseServerSelectionTimeout,
    KMS_MASTER_KEY_ID: kmsCmkAlias.targetKeyArn,
  },
};

////////////////////////////////////////////////////////////////////////////////
// Lambda role policy attachments
new aws.iam.RolePolicyAttachment(`${stack}-storage-api-lambda-execute-attachment`, {
  role: lambdaRole.name,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaExecute,
});

new aws.iam.RolePolicyAttachment(`${stack}-storage-api-lambda-xray-attachment`, {
  role: lambdaRole.name,
  policyArn: aws.iam.ManagedPolicy.AWSXrayWriteOnlyAccess,
});

new aws.iam.RolePolicyAttachment(`${stack}-storage-api-lambda-vpc-execution-attachment`, {
  role: lambdaRole.name,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
});

const kmsLambdaPolicy = new aws.iam.Policy(`${stack}-kms-Lambda-Policy`, {
  policy: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["kms:Encrypt", "kms:Decrypt"],
        Resource: kmsCmkAlias.targetKeyArn,
      },
    ],
  },
});

new aws.iam.RolePolicyAttachment(`${stack}-api-kms-policy-attachment`, {
  role: lambdaRole.name,
  policyArn: kmsLambdaPolicy.arn,
});
////////////////////////////////////////////////////////////////////////////////
// Lambda functions for api/storage
const storageCreateLambda = new aws.lambda.Function(`${stack}-storage-create-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.createHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
  timeout: 15,
});

const storageGetLambda = new aws.lambda.Function(`${stack}-storage-get-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.getHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

////////////////////////////////////////////////////////////////////////////////
// Lambda functions for storage-api/configApi

const configCreateLambda = new aws.lambda.Function(`${stack}-config-create-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.createConfigHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

const configListAllLambda = new aws.lambda.Function(`${stack}-config-list-all-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.listAllHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

const configGetConfigLambda = new aws.lambda.Function(`${stack}-config-get-config-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.getConfigHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

const configDeleteConfigLambda = new aws.lambda.Function(`${stack}-config-delete-config-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.deleteConfigHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

const configUpdateConfigLambda = new aws.lambda.Function(`${stack}-config-update-config-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.updateConfigHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

const seedConfigFileLambda = new aws.lambda.Function(`${stack}-seed-config-file-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.seedConfigHandler",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

////////////////////////////////////////////////////////////////////////////////
// Lambda for vc-api
const issueLambda = new aws.lambda.Function(`${stack}-issue-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.handleIssue",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
  timeout: 30,
});
// Lambda for vc-api
const verifyLambda = new aws.lambda.Function(`${stack}-verify-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.FileArchive(apiDir),
  handler: "index.handleVerify",
  runtime: "nodejs14.x",
  environment: { ...enviromentVariables },
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
  timeout: 15,
});

////////////////////////////////////////////////////////////////////////////////
// Lambda for options

const apiOptionsLambda = new aws.lambda.Function(`${stack}-api-options-lambda`, {
  role: lambdaRole.arn,
  code: new pulumi.asset.AssetArchive({
    "index.js": new pulumi.asset.StringAsset(`exports.handler = async () => {
    return {
      statusCode: 200,
      body: "",
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  };`),
  }),
  handler: "index.handler",
  runtime: "nodejs14.x",
  tracingConfig: {
    mode: "Active",
  },
  vpcConfig: {
    subnetIds: vpc.trustbridgeVpcPrivateSubnetIds,
    securityGroupIds: [vpc.trustbridgeVpcDefaultSecurityGroupId],
  },
});

////////////////////////////////////////////////////////////////////////////////
// ApiGateway for api
const apiGateway = new awsx.apigateway.API(`${stack}-api`, {
  restApiArgs: {
    endpointConfiguration: {
      types: "EDGE",
    },
  },
  routes: [
    {
      path: "/{id}",
      method: "POST",
      eventHandler: storageCreateLambda,
    },
    {
      path: "/{id}",
      method: "GET",
      eventHandler: storageGetLambda,
    },
    {
      path: "/{id}",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
    {
      path: "/config-file",
      method: "GET",
      eventHandler: configListAllLambda,
    },
    {
      path: "/config-file",
      method: "POST",
      eventHandler: configCreateLambda,
    },
    {
      path: "/config-file",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
    {
      path: "/config-file/{id}",
      method: "GET",
      eventHandler: configGetConfigLambda,
    },
    {
      path: "/config-file/{id}",
      method: "DELETE",
      eventHandler: configDeleteConfigLambda,
    },
    {
      path: "/config-file/{id}",
      method: "PUT",
      eventHandler: configUpdateConfigLambda,
    },
    {
      path: "/seed/config-files/{id}",
      method: "PUT",
      eventHandler: seedConfigFileLambda,
    },
    {
      path: "/config-file/{id}",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
    {
      path: "/seed/config-files/{id}",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
    {
      path: "/credentials/{issuerId}/issue",
      method: "POST",
      eventHandler: issueLambda,
    },
    {
      path: "/credentials/{issuerId}/issue",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
    {
      path: "/credentials/issue",
      method: "POST",
      eventHandler: issueLambda,
    },
    {
      path: "/credentials/issue",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
    {
      path: "/credentials/verify",
      method: "POST",
      eventHandler: verifyLambda,
    },
    {
      path: "/credentials/verify",
      method: "OPTIONS",
      eventHandler: apiOptionsLambda,
    },
  ],
  stageName: `${stack}-api`,
  stageArgs: {
    xrayTracingEnabled: true,
    accessLogSettings: {
      destinationArn: apiLogGroup.arn,
      format: JSON.stringify({
        requestId: "$context.requestId",
        ip: "$context.identity.sourceIp",
        caller: "$context.identity.caller",
        user: "$context.identity.user",
        requestTime: "$context.requestTime",
        httpMethod: "$context.httpMethod",
        resourcePath: "$context.resourcePath",
        status: "$context.status",
        protocol: "$context.protocol",
      }),
    },
  },
});

new aws.apigateway.MethodSettings("all", {
  restApi: apiGateway.restAPI.id,
  stageName: apiGateway.stage.stageName,
  methodPath: "*/*",
  settings: {
    metricsEnabled: true,
    loggingLevel: "INFO",
  },
});

////////////////////////////////////////////////////////////////////////////////
// Custom domain name for api

const provider = new aws.Provider(`${stack}-provider-us-east-1`, { region: "us-east-1" });

// Get ssl certificate
const sslCertificate = pulumi.output(
  aws.acm.getCertificate(
    {
      domain: config.dvpApiDomain,
      statuses: ["ISSUED"],
    },
    { provider: provider }
  )
);

// Get hosted zone
const hostedZoneId = aws.route53.getZone({ name: config.targetDomain }, {}).then((zone) => zone.zoneId);

// Register custom domain name with ApiGateway
const apiDomainName = new aws.apigateway.DomainName(`${stack}-api-domain-name`, {
  certificateArn: sslCertificate.arn,
  domainName: config.dvpApiDomain,
});

// Create dns record
new aws.route53.Record(`${stack}-api-dns`, {
  zoneId: hostedZoneId,
  type: "A",
  name: config.dvpApiDomain,
  aliases: [
    {
      name: apiDomainName.cloudfrontDomainName,
      evaluateTargetHealth: true,
      zoneId: apiDomainName.cloudfrontZoneId,
    },
  ],
});

// Map stage name to custom domain
new aws.apigateway.BasePathMapping(`${stack}-api-domain-mapping`, {
  restApi: apiGateway.restAPI.id,
  stageName: apiGateway.stage.stageName,
  domainName: apiDomainName.domainName,
});

export const storageApiBucketUrl = storageApiBucket.websiteEndpoint;
export const apigatewayUrl = `https://${config.dvpApiDomain}`;
