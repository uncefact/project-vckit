import * as aws from "@pulumi/aws";

// Generate Origin Access Identity to access the private s3 bucket.
export const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity("originAccessIdentity", {
  comment: "this is needed to setup s3 polices and make s3 not public.",
});
