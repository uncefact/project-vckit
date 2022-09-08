import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import { verify as OAVerify } from "./backends/openAttestation/verify";
import { APIGatewayProxyResult } from "aws-lambda";
import { errorHandler } from "../common/utils/customErrors";
import { response } from "../common/utils/response";
import { ApiLogNamespace, logger } from "../common/utils/logger";
const LOG_NAME = ApiLogNamespace.VCApi;

const _handleVerify = async (event: {
  body: { verifiableCredential: any; options: any };
}): Promise<APIGatewayProxyResult> => {
  try {
    const { verifiableCredential, options } = event.body ?? {};
    if (!verifiableCredential) {
      return {
        statusCode: 400,
        body: "Please provide the VC to verify in the verifiableCredential property",
      };
    }
    const result = await OAVerify(verifiableCredential, options);
    logger.info(LOG_NAME, `verification result: ${JSON.stringify(result)}`);

    let statusCode;
    if (result.errors.length > 0) {
      statusCode = 400;
      //VC-API Spec doesn't specify body of error response,
      //just that it should be 400.
      logger.info(LOG_NAME, "Found errors in doc");
    } else {
      statusCode = 200;
      logger.info(LOG_NAME, "No errors");
    }
    return response({ data: result }, statusCode);
  } catch (err: any) {
    return errorHandler(err, logger);
  }
};

export const handleVerify = middy(_handleVerify)
  .use(jsonBodyParser())
  .use(cors());
