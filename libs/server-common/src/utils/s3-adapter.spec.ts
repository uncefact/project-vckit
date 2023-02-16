import {
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';

const s3Mock = mockClient(S3Client);

export default function toReadableStream(value: string) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(value);
      controller.close();
    },
  });
}

const mockAwsProviderConfig = {
  bucketName: 'test',
  clientConfig: {
    region: 'test',
  },
};

import { S3Adapter } from './s3-adapter';

const testDocumentId = 'testId';
const testEncryptedDocument = {
  cipherText: 'testCipherText',
  iv: 'testIv',
  tag: 'testTag',
  type: 'testType',
};

describe('S3Adapter', () => {
  const s3StorageClient = new S3Adapter(mockAwsProviderConfig);

  it('should return a document if it exists', async () => {
    s3Mock.on(GetObjectCommand).resolves({
      Body: {
        transformToString: async () =>
          Promise.resolve(JSON.stringify(testEncryptedDocument)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    const encryptedDocument = await s3StorageClient.getDocument(testDocumentId);

    expect(encryptedDocument).toStrictEqual(testEncryptedDocument);
  });

  it('should return null if body is empty', async () => {
    s3Mock.on(GetObjectCommand).resolves({});
    expect(await s3StorageClient.getDocument(testDocumentId)).toBe(null);
  });

  it('should return null if document does not exists', async () => {
    s3Mock
      .on(GetObjectCommand)
      .rejectsOnce(new Error('The specified key does not exist.'));
    expect(await s3StorageClient.getDocument(testDocumentId)).toBe(null);
  });

  it('should return an error if unexpected error is thrown', async () => {
    s3Mock.on(GetObjectCommand).rejects('test');
    await expect(s3StorageClient.getDocument(testDocumentId)).rejects.toThrow();
  });

  describe('isDocumentExists', () => {
    it("should return false if document doesn't exists", async () => {
      s3Mock.on(HeadObjectCommand).rejectsOnce(new Error('not found'));

      const isDocumentExists = await s3StorageClient.isDocumentExists(
        testDocumentId
      );

      expect(isDocumentExists).toBe(false);
    });
    it('should return true if document exists', async () => {
      s3Mock.on(HeadObjectCommand).resolves({});

      const isDocumentExists = await s3StorageClient.isDocumentExists(
        testDocumentId
      );

      expect(isDocumentExists).toBe(true);
    });
  });

  describe('deleteDocument', () => {
    it('should return error if error is thrown', async () => {
      s3Mock.on(DeleteObjectCommand).rejectsOnce({});

      await expect(
        s3StorageClient.deleteDocument(testDocumentId)
      ).rejects.toThrowError();
    });
  });
});
