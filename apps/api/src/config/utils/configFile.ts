import { ErrorTypes, CustomError } from "../../common/utils/customErrors";
import { ApiLogNamespace, logger } from "../../common/utils/logger";
import { validateObject } from "../../common/utils/validate";
import * as configFileSchema from "../../common/fixtures/schemas/configFile.json";

export const validateConfigFile = (
  configFile: Record<string, unknown>
): void => {
  if (
    !configFile ||
    typeof configFile != "object" ||
    Object.keys(configFile).length < 1
  ) {
    logger.error(
      ApiLogNamespace.ConfigApi,
      `Invalid config file provided: ${configFile}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Config file must be an object and contain data"
    );
  }
  try {
    const { isValid, errors } = validateObject(configFile, configFileSchema);
    if (!isValid) {
      logger.error(
        ApiLogNamespace.ConfigApi,
        `Config file schema validation failed: ${JSON.stringify({
          configFile,
          configFileSchema,
          errors,
        })}`
      );
      throw new CustomError(
        ErrorTypes.BadUserInputError,
        `Invalid config file: ${JSON.stringify(errors)})}`
      );
    }
  } catch (err: any) {
    throw err;
  }
};
