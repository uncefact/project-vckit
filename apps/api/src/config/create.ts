import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { validateConfigFile } from "./utils/configFile";
import {
  ErrorTypes,
  CustomError,
  errorHandler,
} from "../common/utils/customErrors";
import { insertDocuments } from "../common/services/database";
import { response } from "../common/utils/response";
import { logger, ApiLogNamespace } from "../common/utils/logger";
import { APIGatewayProxyResult } from "aws-lambda";

export const createConfigHandler = async (event: {
  body?: {
    configFiles: Record<string, unknown>[] | null;
  };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { configFiles } = event.body ?? {};

    if (!configFiles || !Array.isArray(configFiles) || configFiles.length < 1) {
      logger.error(
        ApiLogNamespace.ConfigApi,
        `No config file provided or config file is not in an array: ${JSON.stringify(
          configFiles
        )}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        "You need to provide at least one config file and it must be in an array"
      );
    }

    configFiles.forEach((config: Record<string, unknown>) =>
      validateConfigFile(config)
    );

    const savedConfigFiles = await insertDocuments(configFiles);

    return response(
      {
        data: {
          message: "Documents saved",
          savedDocuments: savedConfigFiles.insertedIds,
        },
      },
      200
    );
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handler = middy(createConfigHandler)
  .use(jsonBodyParser())
  .use(cors());
