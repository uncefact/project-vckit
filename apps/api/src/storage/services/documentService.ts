import { encryptString } from "@govtechsg/oa-encryption";
import { config } from "../../config";
import { get, put, getObjectHead } from "../../common/services/s3";
import { ApiLogNamespace, logger } from "../../common/utils/logger";
import { validate } from "uuid";
import { CustomError, ErrorTypes } from "../../common/utils/customErrors";
import { decryptionKeyMatcher } from "../../common/utils/matchers";

export const DEFAULT_TTL_IN_MICROSECONDS = 30 * 24 * 60 * 60 * 1000; // 30 Days
export const MAX_TTL_IN_MICROSECONDS = 90 * 24 * 60 * 60 * 1000; // 90 Days

const putDocument = async (document: Record<string, unknown>, id: string) => {
  const params = {
    Bucket: config.bucketName,
    Key: id,
    Body: JSON.stringify({ document }),
  };
  return put(params).then(() => ({ id: params.Key }));
};

export const getDocument = async (id: string) => {
  const params = {
    Bucket: config.bucketName,
    Key: id,
  };
  const document = await get(params);
  if (
    !document ||
    document.document.ttl < Date.now() // if the document has expired, tell the user that it doesn't exist
  ) {
    logger.error(
      ApiLogNamespace.StorageApi,
      `No document found: ${JSON.stringify({ document })}`
    );
    throw new CustomError(ErrorTypes.NotFound, "No Document Found");
  }
  return document;
};

export const calculateExpiryTimestamp = (ttlInMicroseconds: number) =>
  Date.now() + ttlInMicroseconds;

export const uploadDocumentAtId = async (
  document: Record<string, unknown>,
  documentId: string,
  decryptionKey: string,
  ttlInMicroseconds = DEFAULT_TTL_IN_MICROSECONDS
) => {
  if (!validate(documentId)) {
    logger.error(
      ApiLogNamespace.StorageApi,
      `Invalid document id. The document id must be a uuid: ${JSON.stringify({
        documentId: documentId,
      })}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Invalid document id. The document id must be a uuid"
    );
  }

  if (ttlInMicroseconds > MAX_TTL_IN_MICROSECONDS) {
    logger.error(
      ApiLogNamespace.StorageApi,
      `TTL cannot exceed 90 days: ${JSON.stringify({
        ttl: ttlInMicroseconds,
      })}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "TTL cannot exceed 90 days"
    );
  }

  if (Date.now() >= ttlInMicroseconds + Date.now()) {
    logger.error(
      ApiLogNamespace.StorageApi,
      `TTL must be positive: ${JSON.stringify({
        ttl: ttlInMicroseconds,
      })}`
    );
    throw new CustomError(ErrorTypes.BadUserInputError, "TTL must be positive");
  }

  // Check if the documentId exists
  if (
    await getObjectHead({
      Bucket: config.bucketName,
      Key: documentId,
    })
  ) {
    logger.error(
      ApiLogNamespace.StorageApi,
      `Document id already exists: ${JSON.stringify({
        documentId: documentId,
      })}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Document id already exists"
    );
  }

  if (!decryptionKeyMatcher.test(decryptionKey)) {
    logger.error(
      ApiLogNamespace.StorageApi,
      `Invaild decryptionKey. Please provide a valid AES-GCM decryption key: ${JSON.stringify(
        {
          decryptionKey,
        }
      )}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Invaild decryptionKey. Please provide a valid AES-GCM decryption key"
    );
  }

  const encryptedString = encryptString(
    JSON.stringify(document),
    decryptionKey
  );

  const { cipherText, iv, tag, key, type } = encryptedString;

  const ttl = calculateExpiryTimestamp(ttlInMicroseconds);
  const { id } = await putDocument(
    {
      cipherText,
      iv,
      tag,
      type,
      ttl,
    },
    documentId
  );
  return {
    id,
    key,
    type,
    ttl,
  };
};
