import Ajv from "ajv";
import { JsonSchema } from "../types";
import { CustomError, ErrorTypes } from "./customErrors";
import { ApiLogNamespace, logger } from "./logger";

const ajv = new Ajv();

export const validateObject = (
  object: Record<string, unknown>,
  schema: JsonSchema
) => {
  try {
    const validate = ajv.compile(schema);
    const valid = validate(object);
    return { isValid: valid, errors: validate.errors };
  } catch (error: any) {
    logger.error(
      ApiLogNamespace.Server,
      `Error validating object: ${JSON.stringify({
        object,
        schema,
        error,
      })}`
    );
    throw new CustomError(
      ErrorTypes.ServerError,
      "There has been an unexpected error"
    );
  }
};
