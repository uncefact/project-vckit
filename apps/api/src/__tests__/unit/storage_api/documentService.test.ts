jest.mock("../../../common/services/s3");
jest.mock("@govtechsg/oa-encryption");

import { encryptString } from "@govtechsg/oa-encryption";
////// Allow jest.spyon() to just direct imports
import * as documentServices from "../../../storage/services/documentService";
import documentWithDocumentStore from "../../../common/fixtures/documentWithDocumentStore.json";
import { get, put, getObjectHead } from "../../../common/services/s3";
import { handler as getHandler } from "../../../storage/get";
import { handler as createHandler } from "../../../storage/create";

const { calculateExpiryTimestamp, uploadDocumentAtId, getDocument } =
  documentServices;

jest.spyOn(Date, "now").mockImplementation(() => 1578897000000);
const mockedPut = put as jest.Mock<ReturnType<typeof put>>;
const mockGet = get as jest.Mock<ReturnType<typeof get>>;
const mockGetObjectHead = getObjectHead as jest.Mock;
const mockedEncryptString = encryptString as jest.Mock<
  ReturnType<typeof encryptString>
>;

const lambdaAuthorizerEvent = {} as any;
const lambdaAuthorizerContext = {} as any;

const document = documentWithDocumentStore;
const documentId = "95f6287d-11f7-42e5-8cc9-aefa25e75448";
const decryptionKey =
  "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5047";

const headObjectSuccessResponse = {
  AcceptRanges: "test",
  LastModified: undefined,
  ContentLength: undefined,
  ETag: "test",
  ContentType: undefined,
  Metadata: {},
};

const documentReceipt = {
  cipherText: "49mfUPGY4NF0U11...",
  iv: "YSI0jD6ajDVKtbFo",
  tag: "Np1N5CdpvDG6vrshNV/diA==",
  type: "OPEN-ATTESTATION-TYPE-1",
  ttl: 1578983401000,
};

describe("calculateExpiryTimestamp", () => {
  it("should return the absolute timestamp given a relative ttl", () => {
    expect(calculateExpiryTimestamp(24 * 60 * 60 * 1000)).toBe(1578983400000);
  });
});

describe("uploadDocument", () => {
  it("should upload a document without any error", async () => {
    mockedPut.mockResolvedValue({
      Location: "string",
      ETag: "string",
      Bucket: "string",
      Key: "string",
    });
    mockedEncryptString.mockReturnValueOnce({
      cipherText: "MOCK_CIPHERTEXT",
      iv: "MOCK_IV",
      tag: "MOCK_TAG",
      key: decryptionKey,
      type: "OPEN-ATTESTATION-TYPE-1",
    });
    const upload = await uploadDocumentAtId(
      document,
      documentId,
      decryptionKey
    );
    expect(upload).toStrictEqual({
      id: documentId,
      key: decryptionKey,
      type: "OPEN-ATTESTATION-TYPE-1",
      ttl: 1581489000000,
    });
  });

  it("should throw an error when documentId is not a valid uuid", async () => {
    await expect(
      uploadDocumentAtId(document, "1234", decryptionKey)
    ).rejects.toThrow("Invalid document id. The document id must be a uuid");
  });

  it("should throw an error when decryptionKey is not a valid AES-GCM decryption key", async () => {
    await expect(
      uploadDocumentAtId(document, documentId, "1234")
    ).rejects.toThrow(
      "Invaild decryptionKey. Please provide a valid AES-GCM decryption key"
    );
  });

  it("should throw an error when ttl exceeds max ttl", async () => {
    await expect(
      uploadDocumentAtId(document, documentId, decryptionKey, 10000000000000)
    ).rejects.toThrow("TTL cannot exceed 90 days");
  });

  it("should throw an error if the ttl is negative", async () => {
    await expect(
      uploadDocumentAtId(document, documentId, decryptionKey, -100)
    ).rejects.toThrow("TTL must be positive");
  });

  it("should upload the document if the documentId doesn't exist", async () => {
    mockGetObjectHead.mockResolvedValueOnce(null);
    mockedEncryptString.mockReturnValue({
      cipherText: "MOCK_CIPHERTEXT",
      iv: "MOCK_IV",
      tag: "MOCK_TAG",
      key: decryptionKey,
      type: "OPEN-ATTESTATION-TYPE-1",
    });
    const upload = await uploadDocumentAtId(
      document,
      documentId,
      decryptionKey
    );
    expect(upload).toStrictEqual({
      id: documentId,
      key: decryptionKey,
      type: "OPEN-ATTESTATION-TYPE-1",
      ttl: 1581489000000,
    });
  });

  it("should throw an error if the documentId exists", async () => {
    mockGetObjectHead.mockResolvedValueOnce(headObjectSuccessResponse);
    mockedEncryptString.mockReturnValue({
      cipherText: "MOCK_CIPHERTEXT",
      iv: "MOCK_IV",
      tag: "MOCK_TAG",
      key: decryptionKey,
      type: "OPEN-ATTESTATION-TYPE-1",
    });
    await expect(
      uploadDocumentAtId(document, documentId, decryptionKey)
    ).rejects.toThrow("Document id already exists");
  });
});

describe("get document", () => {
  it("should return a document", async () => {
    mockGet.mockResolvedValue({
      document: documentReceipt,
    });
    const encryptedDocument = await getDocument("valid_uuid");
    expect(encryptedDocument).toStrictEqual({
      document: documentReceipt,
    });
  });

  it("should throw an error if the document doesn't exist", async () => {
    mockGet.mockRejectedValue(new Error("No Document Found"));
    await expect(getDocument("invalid_uuid")).rejects.toThrow(
      "No Document Found"
    );
  });

  it("should throw an error if the document has expired", async () => {
    mockGet.mockResolvedValue({
      document: {
        cipherText: "49mfUPGY4NF0U11...",
        iv: "YSI0jD6ajDVKtbFo",
        tag: "Np1N5CdpvDG6vrshNV/diA==",
        type: "OPEN-ATTESTATION-TYPE-1",
        ttl: 1578896000000,
      },
    });
    await expect(getDocument("document_uuid")).rejects.toThrow(
      "No Document Found"
    );
  });
});

describe("get handler", () => {
  it("should return a 200 status", async () => {
    jest.spyOn(documentServices, "getDocument").mockResolvedValueOnce({
      document: {
        cipherText: "49mfUPGY4NF0U11...",
        iv: "YSI0jD6ajDVKtbFo",
        tag: "Np1N5CdpvDG6vrshNV/diA==",
        type: "OPEN-ATTESTATION-TYPE-1",
        ttl: 1578983401000,
      },
    });
    const getDoc = await getHandler(
      { ...lambdaAuthorizerEvent, pathParameters: { id: "testId" } },
      lambdaAuthorizerContext
    );
    expect(getDoc.statusCode).toBe(200);
  });

  it("should throw error when id is missing", async () => {
    const mockGetDocument = await getHandler(
      { ...lambdaAuthorizerEvent, pathParameters: null },
      lambdaAuthorizerContext
    );
    expect(mockGetDocument.body).toBe(
      JSON.stringify({
        error: {
          code: 400,
          message: "Please provide ID of document to retrieve",
        },
      })
    );
  });
});

describe("create handler", () => {
  it("should return a 200 status", async () => {
    jest.spyOn(documentServices, "uploadDocumentAtId").mockResolvedValueOnce({
      id: "95f6287d-11f7-42e5-8cc9-aefa25e754de",
      key: "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5047",
      type: "OPEN-ATTESTATION-TYPE-1",
      ttl: 1655323259289,
    });
    const uploadDoc = await createHandler(
      {
        body: {
          document: { provide: "some_data" },
          decryptionKey:
            "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5047",
        },
        pathParameters: { id: "95f6287d-11f7-42e5-8cc9-aefa25e754de" },
      },
      lambdaAuthorizerContext
    );
    expect(uploadDoc.statusCode).toBe(200);
    expect(uploadDoc.body).toStrictEqual(
      JSON.stringify({
        data: {
          documentReceipt: {
            id: "95f6287d-11f7-42e5-8cc9-aefa25e754de",
            key: "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5047",
            type: "OPEN-ATTESTATION-TYPE-1",
            ttl: 1655323259289,
          },
        },
      })
    );
  });

  it("should throw error when document is missing", async () => {
    const uploadDoc = await createHandler(
      {
        body: {
          document: {},
          decryptionKey:
            "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5047",
        },
        pathParameters: { id: "95f6287d-11f7-42e5-8cc9-aefa25e754de" },
      },
      lambdaAuthorizerContext
    );
    expect(uploadDoc.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "Please provide the ID, the decryption key, the document and a valid TTL",
        },
      })
    );
  });

  it("should throw error when request body is undefined", async () => {
    const uploadDoc = await createHandler(
      {
        body: undefined,
        pathParameters: { id: "95f6287d-11f7-42e5-8cc9-aefa25e754de" },
      },
      lambdaAuthorizerContext
    );
    expect(uploadDoc.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "Please provide the ID, the decryption key, the document and a valid TTL",
        },
      })
    );
  });

  it("should throw error when decryptionKey is missing", async () => {
    const uploadDoc = await createHandler(
      {
        body: {
          document: { provide: "some_data" },
        },
        pathParameters: { id: "95f6287d-11f7-42e5-8cc9-aefa25e754de" },
      },
      lambdaAuthorizerContext
    );
    expect(uploadDoc.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "Please provide the ID, the decryption key, the document and a valid TTL",
        },
      })
    );
  });

  it("should throw error when ttl is string", async () => {
    const uploadDoc = await createHandler(
      {
        body: {
          document: { provide: "some_data" },
          ttl: "test_ttl",
          decryptionKey:
            "e0df31f6ec9f1f92c6543added90416c86f40d20025661b91b2f3ee9589f5047",
        },
        pathParameters: { id: "95f6287d-11f7-42e5-8cc9-aefa25e754de" },
      },
      lambdaAuthorizerContext
    );
    expect(uploadDoc.body).toStrictEqual(
      JSON.stringify({
        error: {
          code: 400,
          message:
            "Please provide the ID, the decryption key, the document and a valid TTL",
        },
      })
    );
  });
});
