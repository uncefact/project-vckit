import { utils } from "@govtechsg/open-attestation";
import { generateEncryptionKey } from "@govtechsg/oa-encryption";
import axios, { AxiosResponse } from "axios";
import { v4 as uuid } from "uuid";
import { DocumentStorage, WrappedDocument } from "../../types";
import { decodeQrCode } from "../utils/utils";

interface Headers {
  "Content-Type": string;
  "x-api-key": string;
}

export const getHeaders = (documentStorage: DocumentStorage): Headers => {
  const headers = {
    "Content-Type": "application/json",
  } as Headers;

  const apiKey = "x-api-key";

  if (documentStorage.apiKey) headers[apiKey] = documentStorage.apiKey;

  return headers;
};

export const getQueueNumber = async (documentStorage: DocumentStorage): Promise<AxiosResponse> => {
  const url = `${documentStorage.url}/queue`;
  return axios.get(url, { headers: { ...getHeaders(documentStorage) } });
};

export const uploadToStorage = async (
  doc: WrappedDocument,
  documentStorage: DocumentStorage
): Promise<AxiosResponse> => {
  const { links } = utils.isRawV3Document(doc.rawDocument) ? doc.rawDocument.credentialSubject : doc.rawDocument;
  const qrCodeObj = decodeQrCode(links.self.href);
  const uri = qrCodeObj.payload.uri;

  return axios.post(
    uri,
    {
      document: doc.wrappedDocument,
      decryptionKey: qrCodeObj.payload.key,
    },
    { headers: { ...getHeaders(documentStorage) } }
  );
};

export interface QueueData {
  data: {
    id: string;
    key: string;
  };
}

/**
 * Generates ID and encryption key client side.
 *
 * @returns QueueData
 */
export const generateIdAndKey = (): QueueData => ({
  data: {
    id: uuid(),
    key: generateEncryptionKey(),
  },
});
