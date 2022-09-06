import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";
import { ApiLogNamespace, logger } from "../common/utils/logger";

const LOG_NAME = ApiLogNamespace.VCApi;

//NOT IMPLEMENTED YET
const _handleStatus = async (event: {
  body: { credentialId: any; credentialStatus: any };
}) => {
  const { credentialId } = event.body ?? {};
  if (!credentialId) {
    const errStr =
      "The credential to modify should be in the 'credentialId' field";
    logger.error(LOG_NAME, errStr);
    throw new createError.BadRequest(errStr);
  }
  throw new createError.BadRequest("Status checks not yet implemented!");
};

export const handleStatus = middy(_handleStatus)
  .use(jsonBodyParser())
  .use(cors())
  .use(httpErrorHandler());
