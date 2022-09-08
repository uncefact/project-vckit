import { ErrorResponse, SuccessfulResponse } from "../types";
import { lambdaResponse } from "./lambdaResponse";

export const response = async (
  responseBody: SuccessfulResponse | ErrorResponse,
  statusCode: number
) => lambdaResponse(responseBody, statusCode);
