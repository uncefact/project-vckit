import AWS, { S3 } from "aws-sdk";
import { config } from "../../config";
import { ApiLogNamespace, logger } from "../utils/logger";
import { CustomError, ErrorTypes } from "../utils/customErrors";

export const s3bucket = new AWS.S3(config.s3);

export const put = (params: S3.Types.PutObjectRequest) =>
  s3bucket.upload(params).promise();

export const get = (params: S3.Types.GetObjectRequest) =>
  s3bucket
    .getObject(params)
    .promise()
    .then((results) => {
      if (results && results.Body) {
        return JSON.parse(results.Body.toString());
      }
      logger.error(
        ApiLogNamespace.S3,
        `No Document Found: ${JSON.stringify({ params })}`
      );
      throw new CustomError(ErrorTypes.NotFound, "No Document Found");
    })
    .catch((err) => {
      // locally the error is slightly different, so we catch it and make it consistent
      logger.error(
        ApiLogNamespace.S3,
        `Error with S3 get: ${JSON.stringify({ params, message: err.message })}`
      );
      if (err.message === "The specified key does not exist.") {
        throw new CustomError(ErrorTypes.NotFound, "No Document Found");
      }
      throw err;
    });

export const getObjectHead = (params: S3.Types.HeadObjectRequest) =>
  s3bucket
    .headObject(params)
    .promise()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      if (err.code !== "NotFound") {
        logger.error(
          ApiLogNamespace.S3,
          `Error with S3 getObjectHead: ${JSON.stringify({
            params,
            message: err.message,
          })}`
        );
        throw err;
      }
      return null;
    });
