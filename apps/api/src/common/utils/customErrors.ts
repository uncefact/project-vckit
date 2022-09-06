import { response } from "./response";
import { ApiLogNamespace, Logger } from "./logger";

export enum ErrorTypes {
  DatabaseError = "DatabaseError",
  BadUserInputError = "BadUserInputError",
  NotFound = "NotFound",
  ServerError = "ServerError",
}

export class CustomError extends Error {
  type: ErrorTypes;
  errors: string[] | undefined;

  constructor(type: ErrorTypes, message: string, errors?: string[]) {
    super(message);
    this.message = message;
    this.type = type;
    this.errors = errors;
  }
}

const serverError = {
  error: { code: 500, message: "There has been an unexpected error" },
};

export const errorHandler = async (
  err: CustomError | Error,
  logger: Logger
) => {
  if (err instanceof CustomError) {
    switch (err.type) {
      case ErrorTypes.BadUserInputError:
        return response(
          { error: { code: 400, message: err.message, errors: err.errors } },
          400
        );
      case ErrorTypes.NotFound:
        return response(
          { error: { code: 404, message: err.message, errors: err.errors } },
          404
        );
      case ErrorTypes.DatabaseError:
      case ErrorTypes.ServerError:
        return response(serverError, 500);
    }
  }
  logger.error(
    ApiLogNamespace.Server,
    `There has been an unexpected error ${err.message}`
  );
  return response(serverError, 500);
};
