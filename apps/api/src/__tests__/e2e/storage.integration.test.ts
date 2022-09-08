/* istanbul ignore file */
import fetch, { Response } from "node-fetch";
import ropstenDocument from "../../common/fixtures/documentWithDocumentStore.json";
import {
  thatIsRetrievedDocument,
  thatIsRetrievedDocumentWithTtl,
  thatIsUploadResponse,
} from "../../testHelpers/matchers";
import {
  DEFAULT_TTL_IN_MICROSECONDS,
  MAX_TTL_IN_MICROSECONDS,
} from "../../storage/services/documentService";
import { v4 as uuid } from "uuid";
import { decryptString } from "@govtechsg/oa-encryption";

////////////////////////////////////////////////////////////
// Needs to be refactored, leaving for reference

const API_ENDPOINT =
  process.env.DEV_ENDPOINT || "https://api-ropsten.tradetrust.io/storage";
const TIME_SKEW_ALLOWANCE = 5000;

const handleResponse = async (res: Response) => {
  if (res.ok) return res.json();
  else throw new Error(await res.text());
};
const post = (uri: string, data?: any) => {
  return fetch(uri, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
};
const get = (uri: string) => {
  return fetch(uri, {
    method: "GET",
  }).then(handleResponse);
};

describe("storage endpoint test", () => {
  it("should store, retrieve and decrypt the document", async () => {
    const uploadResponse = await post(`${API_ENDPOINT}`, {
      document: ropstenDocument,
    });
    const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
    expect(getResponse).toMatchObject(thatIsRetrievedDocumentWithTtl);

    const decryptedDocument = JSON.parse(
      decryptString({
        tag: getResponse.document.tag,
        cipherText: getResponse.document.cipherText,
        iv: getResponse.document.iv,
        key: uploadResponse.key,
        type: "OPEN-ATTESTATION-TYPE-1",
      })
    );
    expect(decryptedDocument).toStrictEqual(ropstenDocument);
  });
  describe("post / - upload document at any path", () => {
    it("should upload a new document when no placeholder object is there", async () => {
      const uploadResponse = await post(`${API_ENDPOINT}`, {
        document: ropstenDocument,
      });
      expect(uploadResponse).toEqual(thatIsUploadResponse);
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse).toMatchObject(thatIsRetrievedDocumentWithTtl);
    });
    it("should throw error when document verification failed", async () => {
      await expect(
        post(`${API_ENDPOINT}`, {
          document: { foo: "bar" },
        })
      ).rejects.toThrow("Document is not valid");
    });

    it("should allow user to specify ttl", async () => {
      const ttl = 20000;
      const uploadResponse = await post(`${API_ENDPOINT}`, {
        document: ropstenDocument,
        ttl,
      });
      expect(uploadResponse).toMatchObject(thatIsUploadResponse);
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse.document.ttl).toBeLessThan(
        Date.now() + ttl + TIME_SKEW_ALLOWANCE
      );
      expect(getResponse).toMatchObject(thatIsRetrievedDocumentWithTtl);
    });

    it("should default ttl value to DEFAULT_TTL_IN_MICROSECONDS", async () => {
      const uploadResponse = await post(`${API_ENDPOINT}`, {
        document: ropstenDocument,
      });
      expect(uploadResponse).toMatchObject(thatIsUploadResponse);
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse.document.ttl).toBeLessThan(
        Date.now() + DEFAULT_TTL_IN_MICROSECONDS + TIME_SKEW_ALLOWANCE
      );
      expect(getResponse).toMatchObject(thatIsRetrievedDocumentWithTtl);
    });
    it("should throw error when ttl value > MAX_TTL_IN_MICROSECONDS", async () => {
      const ttl = MAX_TTL_IN_MICROSECONDS + 1;
      await expect(
        post(`${API_ENDPOINT}`, {
          document: ropstenDocument,
          ttl,
        })
      ).rejects.toThrow("Ttl cannot exceed 90 days");
    });
  });

  describe("post /:id - upload document at a specific path", () => {
    it("should upload document", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const uploadResponse = await post(`${API_ENDPOINT}/${queueNumber}`, {
        document: ropstenDocument,
      });
      expect(uploadResponse).toEqual(thatIsUploadResponse);
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse).toMatchObject(thatIsRetrievedDocument);
    });

    it("should throw error when you try to upload to a document that has already been uploaded", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const uploadResponse = await post(`${API_ENDPOINT}/${queueNumber}`, {
        document: ropstenDocument,
      });
      expect(uploadResponse).toEqual(thatIsUploadResponse);
      await expect(
        post(`${API_ENDPOINT}/${queueNumber}`, {
          document: ropstenDocument,
        })
      ).rejects.toThrow("Unauthorised Access");
    });

    it("should throw error when you try to upload to a uuid that is not queue number", async () => {
      await expect(
        post(`${API_ENDPOINT}/${uuid()}`, {
          document: ropstenDocument,
        })
      ).rejects.toThrow("Access Denied");
    });
    it("should throw error when document verification failed", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      await expect(
        post(`${API_ENDPOINT}/${queueNumber}`, {
          document: { foo: "bar" },
        })
      ).rejects.toThrow("Document is not valid");
    });

    it("should allow user to specify ttl", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const ttl = 20000;
      const uploadResponse = await post(`${API_ENDPOINT}/${queueNumber}`, {
        document: ropstenDocument,
        ttl,
      });
      expect(uploadResponse).toMatchObject(thatIsUploadResponse);
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse.document.ttl).toBeLessThan(
        Date.now() + ttl + TIME_SKEW_ALLOWANCE
      );
      expect(getResponse).toMatchObject(thatIsRetrievedDocumentWithTtl);
    });

    it("should default ttl value to DEFAULT_TTL_IN_MICROSECONDS", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const uploadResponse = await post(`${API_ENDPOINT}/${queueNumber}`, {
        document: ropstenDocument,
      });
      expect(uploadResponse).toMatchObject(thatIsUploadResponse);
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse.document.ttl).toBeLessThan(
        Date.now() + DEFAULT_TTL_IN_MICROSECONDS + TIME_SKEW_ALLOWANCE
      );
      expect(getResponse).toMatchObject(thatIsRetrievedDocumentWithTtl);
    });

    it("should throw error when ttl value > MAX_TTL_IN_MICROSECONDS", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const ttl = MAX_TTL_IN_MICROSECONDS + 1;
      await expect(
        post(`${API_ENDPOINT}/${queueNumber}`, {
          document: ropstenDocument,
          ttl,
        })
      ).rejects.toThrow("Ttl cannot exceed 90 days");
    });
  });

  describe("get /:id - get specific document", () => {
    it("should throw error when you try to get a document that is a queue number", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      await expect(get(`${API_ENDPOINT}/${queueNumber}`)).rejects.toThrow(
        "No Document Found"
      );
    });
    it("should cleanup if cleanup flag is specified", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const uploadResponse = await post(`${API_ENDPOINT}/${queueNumber}`, {
        document: ropstenDocument,
      });
      const getResponse = await get(
        `${API_ENDPOINT}/${uploadResponse.id}?cleanup=true`
      );
      expect(getResponse).toMatchObject(thatIsRetrievedDocument);

      await expect(get(`${API_ENDPOINT}/${queueNumber}`)).rejects.toThrow(
        "Access Denied"
      );
    });
    it("should not cleanup if cleanup flag is not specified", async () => {
      const { id: queueNumber } = await get(`${API_ENDPOINT}/queue`);
      const uploadResponse = await post(`${API_ENDPOINT}/${queueNumber}`, {
        document: ropstenDocument,
      });
      const getResponse = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse).toMatchObject(thatIsRetrievedDocument);
      const getResponse2 = await get(`${API_ENDPOINT}/${uploadResponse.id}`);
      expect(getResponse2).toMatchObject(getResponse);
    });
  });
});
