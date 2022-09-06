import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { updateDocument } from "../common/services/database";
import {
  ErrorTypes,
  CustomError,
  errorHandler,
} from "../common/utils/customErrors";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import { response } from "../common/utils/response";
import { validateConfigFile } from "./utils/configFile";
import { APIGatewayProxyResult } from "aws-lambda";

export const updateConfigHandler = async (event: {
  body?: { configFile: Record<string, unknown> | null };
  pathParameters: { id: string | null };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters ?? {};
    if (!id) {
      logger.error(
        ApiLogNamespace.ConfigApi,
        `Missing document ID: ${event.body}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide a valid document ID"
      );
    }

    const { configFile } = event.body ?? {};

    if (!configFile) {
      logger.error(
        ApiLogNamespace.ConfigApi,
        `No configFile file provided: ${JSON.stringify(configFile)}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide a config file"
      );
    }

    validateConfigFile(configFile);

    await updateDocument(id, configFile);

    return response(
      {
        data: {
          id,
          message: "Document updated",
        },
      },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handler = middy(updateConfigHandler)
  .use(jsonBodyParser())
  .use(cors());
