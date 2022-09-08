import middy from "@middy/core";
import cors from "@middy/http-cors";
import jsonBodyParser from "@middy/http-json-body-parser";
import {
  ErrorTypes,
  CustomError,
  errorHandler,
} from "../common/utils/customErrors";
import { issue as OAIssue } from "./backends/openAttestation";
import { ApiLogNamespace, logger } from "../common/utils/logger";
import { response } from "../common/utils/response";
import {
  getIssuersSigningKey,
  getIssuersKeyPairByName,
} from "./services/signingKeys";
import { populateEthrKey } from "./services/populateSigningKey";

const LOG_NAME = ApiLogNamespace.VCApi;

type KeyPair = { signingKeyId: string; signingKey: string };
const resolveSigningKey = async (issuerId: string): Promise<KeyPair> => {
  let signingKeyId: string | undefined;
  let signingKey: string | undefined;
  const decodedIssuerId = decodeURIComponent(issuerId);

  if (decodedIssuerId.startsWith("did:")) {
    signingKeyId = decodedIssuerId;
    signingKey = await getIssuersSigningKey(decodedIssuerId);
  } else if (decodedIssuerId === "new") {
    signingKeyId = await populateEthrKey("new");
    logger.error(LOG_NAME, `\n\nNew Issuer Made: ${signingKeyId}`);
    signingKey = await getIssuersSigningKey(signingKeyId);
  } else {
    const keyPair = await getIssuersKeyPairByName(issuerId);
    if (keyPair) {
      ({ signingKeyId, signingKey } = keyPair);
    } else if (decodedIssuerId == "test") {
      signingKeyId = await populateEthrKey("test");
      logger.error(LOG_NAME, `\n\nNew Test Issuer Made: ${signingKeyId}`);
      signingKey = await getIssuersSigningKey(signingKeyId);
    }
  }
  if (!(signingKeyId && signingKey)) {
    logger.error(LOG_NAME, "Resolving issuer failed");
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "No matching issuer key found"
    );
  }
  logger.error(LOG_NAME, `\n\nIssuer resolved: ${signingKeyId}`);
  return { signingKeyId, signingKey };
};

const _handleIssue = async (event: {
  body: { credential: any; options: any };
  pathParameters: { issuerId: string };
}) => {
  try {
    const { credential } = event.body ?? {};
    const { issuerId } = event.pathParameters ?? { issuerId: "default" };

    if (!credential) {
      logger.info(LOG_NAME, "No credential found");
      return {
        statusCode: 400,
        body: "Please provide a credential to be issued under the 'credential' property",
      };
    }
    // Retrieve signing key
    const { signingKeyId, signingKey } =
      (await resolveSigningKey(issuerId)) ?? {};

    //Sign
    try {
      //Catch implementation specific errors. Options say how to sign:
      //at least keyId (goes to verificationMethod), private key(or signer).
      //Implementation should give an error if key type is not supported.
      const signedDocument = await OAIssue(
        credential,
        signingKeyId,
        signingKey
      );
      return response(signedDocument, 201);
    } catch (e: any) {
      logger.error(LOG_NAME, "Failed signing document.");
      if (e.validationErrors) {
        logger.error(LOG_NAME, "Validation errors found");
      }
      return response(e, 400);
    }
  } catch (err: any) {
    logger.error(LOG_NAME, "Unhandled error in issue");
    return errorHandler(err, logger);
  }
};
export const handleIssue = middy(_handleIssue)
  .use(jsonBodyParser())
  .use(cors());
