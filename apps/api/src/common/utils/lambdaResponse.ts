import { LambdaResponse } from "../types";

export const lambdaResponse: LambdaResponse = (responseBody, statusCode) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(responseBody),
  };
};
