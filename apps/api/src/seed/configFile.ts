import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { replaceOrCreateDocument } from "../common/services/database";
import {
  ErrorTypes,
  CustomError,
  errorHandler,
} from "../common/utils/customErrors";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import { response } from "../common/utils/response";
import { validateConfigFile } from "../config/utils/configFile";
import { APIGatewayProxyResult } from "aws-lambda";

export const seedConfigHandler = async (event: {
  body?: { configFile: Record<string, unknown> | null };
  pathParameters: { id: string | null };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters ?? {};
    if (!id) {
      logger.error(ApiLogNamespace.Seed, `Missing document ID: ${event.body}`);
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide a valid document ID"
      );
    }

    const { configFile } = event.body ?? {};

    if (!configFile) {
      logger.error(
        ApiLogNamespace.Seed,
        `No configFile file provided: ${JSON.stringify(configFile)}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "Please provide a config file"
      );
    }

    validateConfigFile(configFile);

    await replaceOrCreateDocument(id, configFile);

    return response(
      {
        data: {
          id,
          message: "Database seeded with config file",
        },
      },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handler = middy(seedConfigHandler)
  .use(jsonBodyParser())
  .use(cors());
