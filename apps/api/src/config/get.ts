import middy from "@middy/core";
import cors from "@middy/http-cors";
import { APIGatewayProxyResult } from "aws-lambda";
import { listAllDocuments, getDocument } from "../common/services/database";
import {
  errorHandler,
  CustomError,
  ErrorTypes,
} from "../common/utils/customErrors";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import { response } from "../common/utils/response";
import { removePropertyFromObject } from "../common/utils/formatDocument";

export const listAllHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const documents = await listAllDocuments();

    return response({ data: { documents } }, 200);
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const getConfigHandler = async (event: {
  pathParameters: { id: string | null };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters ?? {};
    if (!id) {
      logger.error(
        ApiLogNamespace.ConfigApi,
        `Bad document ID: ${event.pathParameters}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide a valid document ID"
      );
    }
    const document = await getDocument(id);

    if (!document) {
      logger.error(
        ApiLogNamespace.ConfigApi,
        `A document with the provided ID doesn't exist: ${event.pathParameters}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Document doesn't exist. Please provide an ID for a document that exists"
      );
    }

    return response(
      { data: { document: removePropertyFromObject(document, "_id") } },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const listHandler = middy(listAllHandler).use(cors());

export const getHandler = middy(getConfigHandler).use(cors());
