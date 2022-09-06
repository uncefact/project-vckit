import { KMS } from "aws-sdk";
import * as crypto from "crypto";
import { addOne, findOne } from "./database";
import { ErrorTypes, CustomError } from "../../common/utils/customErrors";
import { config } from "../../config";
import { ethers } from "ethers";

import { ApiLogNamespace, logger } from "../../common/utils/logger";
const LOG_NAME = ApiLogNamespace.VCApi;

const client = new KMS({ region: config.awsRegion });

export const generateKeyPair = async (): Promise<any> => {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.generateKeys();
  console.log(ecdh.getPrivateKey());
  const privateKey = ethers.utils.hexlify(ecdh.getPrivateKey());
  console.log(privateKey);
  const wallet = new ethers.Wallet(privateKey);
  console.log({
    publicKey: wallet.address,
    privateKey,
  });
  return {
    publicKey: wallet.address,
    privateKey,
  };
};

export const kmsEncrypt = async (privateKey: string) => {
  try {
    return client
      .encrypt({
        KeyId: config.kmsCustomerMasterKeyId,
        Plaintext: privateKey,
      })
      .promise();
  } catch (err) {
    throw err;
  }
};

export const kmsDecrypt = async (issuersKeyDocument: any) => {
  try {
    const decryptedSigningKey = await client
      .decrypt({
        CiphertextBlob: Buffer.from(
          issuersKeyDocument.encryptedSigningKey,
          "base64"
        ),
        KeyId: config.kmsCustomerMasterKeyId,
      })
      .promise();
    return decryptedSigningKey.Plaintext?.toString();
  } catch (err: any) {
    logger.error(
      LOG_NAME,
      `Error decrypting the issuers signing key: ${err.message}`
    );
  }
};

export const insertEncryptedKey = async (
  keyId: string,
  encryptedPrivateKeyBase64: string
) => {
  try {
    await addOne({
      keyId,
      encryptedSigningKey: encryptedPrivateKeyBase64,
    });
  } catch (err: any) {
    logger.error(
      err,
      `Error populating encrypted signing key: ${JSON.stringify({
        errorMessage: err.message,
      })}`
    );
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "Error insertying encrypted key"
    );
  }
};

export const getIssuersSigningKey = async (issuerAddress: string) => {
  const keyDocument = await findOne({ issuerAddress });
  if (!keyDocument) {
    logger.error(LOG_NAME, `Didn't find signing key.`);
    throw new CustomError(
      ErrorTypes.BadUserInputError,
      "No signing keys available for the provided issuer id"
    );
  }
  return kmsDecrypt(keyDocument);
};

export const getIssuersKeyPairByName = async (
  keyName: string
): Promise<{ signingKeyId: string; signingKey: string } | undefined> => {
  const keyDocument = await findOne({ keyName });
  if (!keyDocument) {
    return;
  }
  console.log(keyDocument);
  const signingKey: string | undefined = await kmsDecrypt(keyDocument);
  const signingKeyId = keyDocument.issuerAddress;
  if (!(signingKey && signingKeyId)) {
    throw new CustomError(ErrorTypes.BadUserInputError, "Decryption error");
  }
  return { signingKeyId, signingKey };
};
