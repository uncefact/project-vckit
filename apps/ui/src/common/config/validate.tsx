import Joi from "@hapi/joi";
import { ConfigFile } from "../../types";

const configFileSchema = Joi.object({
  network: Joi.string().allow("homestead", "ropsten", "rinkeby", "local").only().required(),
  wallet: Joi.alternatives(
    Joi.string().required(),
    Joi.object().keys({
      type: Joi.string().allow("AWS_KMS").required(),
      accessKeyId: Joi.string().required(),
      region: Joi.string().required(),
      kmsKeyId: Joi.string().required(),
    }),
    Joi.object().keys({
      type: Joi.string().allow("ENCRYPTED_JSON").required(),
      encryptedJson: Joi.string().required(),
    })
  ).required(),
  forms: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().allow("TRANSFERABLE_RECORD", "VERIFIABLE_DOCUMENT").only().required(),
        defaults: Joi.object().required(),
        schema: Joi.object().required(),
        attachments: Joi.object({
          allow: Joi.boolean().required(),
          accept: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        }),
        headers: Joi.array().optional(),
        uiSchema: Joi.object(),
        extension: Joi.string(),
        fileName: Joi.string(),
      })
    )
    .required(),
  documentStorage: Joi.object({
    apiKey: Joi.string(),
    url: Joi.string().required(),
  }),
});

export const validateConfigFile = configFileSchema.validate;
export const assertConfigFile = (value: ConfigFile): void => Joi.assert(value, configFileSchema);
