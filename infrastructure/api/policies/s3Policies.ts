// Create an S3 Bucket Policy with private write/list and public read permissions
export function bucketPolicy(bucketName: string, lambdaRole: string) {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: lambdaRole,
        },
        Action: ["s3:PutObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
      {
        Effect: "Allow",
        Principal: {
          AWS: lambdaRole,
        },
        Action: ["s3:ListBucket"],
        Resource: [`arn:aws:s3:::${bucketName}`],
      },
      {
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  });
}
