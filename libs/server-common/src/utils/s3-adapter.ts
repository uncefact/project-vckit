import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  EncryptedDocument,
  S3Config,
  StorageClient,
} from '@dvp/api-interfaces';
import { logger } from './logger';

export class S3Adapter implements StorageClient {
  private s3Client: S3Client;
  private bucket: string;
  private documentStorePath: string;

  constructor(providerConfig: S3Config) {
    this.bucket = providerConfig.bucketName;
    this.s3Client = new S3Client(providerConfig.clientConfig);
    this.documentStorePath = 'documents/';
  }

  getDocumentStorePath() {
    return this.documentStorePath;
  }

  async isDocumentExists(documentId: string) {
    const params = {
      Bucket: this.bucket,
      Key: `${this.documentStorePath}${documentId}`,
    };
    try {
      await this.s3Client.send(new HeadObjectCommand(params));
      return true;
    } catch (err) {
      logger.debug(
        "[S3Adapter.isDocumentExists] document doesn't exist for %s: %s",
        documentId,
        err
      );
      return false;
    }
  }

  async getDocument(documentId: string) {
    const params = {
      Bucket: this.bucket,
      Key: `${this.documentStorePath}${documentId}`,
    };
    try {
      const encryptedDocument = await this.s3Client.send(
        new GetObjectCommand(params)
      );

      if (encryptedDocument?.Body) {
        return JSON.parse(await encryptedDocument.Body.transformToString()) as {
          document: EncryptedDocument;
        };
      }
      return null;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        err?.message === 'The specified key does not exist.'
      ) {
        return null;
      }
      throw err;
    }
  }

  async uploadDocument(document: string, documentId: string) {
    const params: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${this.documentStorePath}${documentId}`,
      Body: document,
    };
    await this.s3Client.send(new PutObjectCommand(params));
    return documentId;
  }

  async deleteDocument(documentId: string) {
    const params: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: `${this.documentStorePath}${documentId}`,
    };
    await this.s3Client.send(new DeleteObjectCommand(params));
  }
}
