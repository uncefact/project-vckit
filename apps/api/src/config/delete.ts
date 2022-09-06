import middy from "@middy/core";
import cors from "@middy/http-cors";
import { APIGatewayProxyResult } from "aws-lambda";
import { deleteDocument } from "../common/services/database";
import {
  ErrorTypes,
  CustomError,
  errorHandler,
} from "../common/utils/customErrors";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import { response } from "../common/utils/response";

export const deleteConfigHandler = async (event: {
  pathParameters: {
    id: string | null;
  };
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
    await deleteDocument(id);

    return response(
      { data: { message: "Document deleted", documentId: id } },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handler = middy(deleteConfigHandler).use(cors());
