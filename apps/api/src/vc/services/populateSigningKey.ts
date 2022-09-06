import { generateKeyPair, kmsEncrypt } from "./signingKeys";
import { addOne } from "./database";
import createError from "http-errors";
import { ApiLogNamespace, logger } from "../../common/utils/logger";

const LOG_NAME = ApiLogNamespace.VCApi;

export const populateEthrKey = async (keyName = "") => {
  try {
    const { publicKey, privateKey } = await generateKeyPair();

    const encryptedSigningKey = await kmsEncrypt(privateKey);
    const issuerAddress = `did:ethr:${publicKey}#controller`;
    await addOne({
      keyName,
      issuerAddress,
      encryptedSigningKey:
        encryptedSigningKey.CiphertextBlob?.toString("base64"),
    });
    return issuerAddress;
  } catch (err: any) {
    logger.error(
      LOG_NAME,
      `Error populating encrypted signing key: ${JSON.stringify({
        errorMessage: err.message,
      })}`
    );
    throw new createError.InternalServerError(
      "Error populating encrypted signing key"
    );
  }
};
