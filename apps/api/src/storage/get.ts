import middy from "@middy/core";
import cors from "@middy/http-cors";
import { getDocument } from "./services/documentService";
import { APIGatewayProxyResult } from "aws-lambda";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import {
  CustomError,
  errorHandler,
  ErrorTypes,
} from "../common/utils/customErrors";
import { response } from "../common/utils/response";

const handleGet = async (event: {
  pathParameters: { id: string | null };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters ?? {};
    if (!id) {
      logger.error(
        ApiLogNamespace.StorageApi,
        "Please provide ID of document to retrieve"
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide ID of document to retrieve"
      );
    }
    const { document } = await getDocument(id);

    return response(
      {
        data: {
          document,
        },
      },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handler = middy(handleGet).use(cors());
