import middy from "@middy/core";
import cors from "@middy/http-cors";
import { uploadDocumentAtId } from "./services/documentService";
import jsonBodyParser from "@middy/http-json-body-parser";
import { Number, String, Undefined } from "runtypes";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import {
  CustomError,
  errorHandler,
  ErrorTypes,
} from "../common/utils/customErrors";
import { response } from "../common/utils/response";
import { APIGatewayProxyResult } from "aws-lambda";

const handleCreateAtId = async (event: {
  body: any;
  pathParameters: { id: string | null };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { document, decryptionKey, ttl } = event.body ?? {};
    const { id } = event.pathParameters ?? {};
    if (
      // using object.keys to make sure document is an object, it's a bit dump though
      Object.keys(document ?? {}).length < 1 ||
      !(Number.guard(ttl) || Undefined.guard(ttl)) ||
      !String.guard(id) ||
      !String.guard(decryptionKey)
    ) {
      logger.error(
        ApiLogNamespace.StorageApi,
        `Please provide the ID, the decryption key, the document and a valid TTL ${JSON.stringify(
          {
            ttl,
            id,
            decryptionKey,
            document,
          }
        )}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide the ID, the decryption key, the document and a valid TTL"
      );
    }
    const receipt = await uploadDocumentAtId(document, id, decryptionKey, ttl);

    return response(
      {
        data: {
          documentReceipt: receipt,
        },
      },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handler = middy(handleCreateAtId)
  .use(jsonBodyParser())
  .use(cors());
