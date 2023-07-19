import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { EncryptedData } from '../entities/encrypted-data.js';
import { getConnectedDb } from '../utils.js';
import { CredentialEncryptedData } from '../entities/credential-encrypted-data.js';
import { IFetchEncryptedDataByCredentialHashResult } from '@vckit/core-types';

/**
 * @public
 */
export class EncryptedDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async saveEncryptedData(
    credentialHash: string,
    decryptedKey: string,
    data: string
  ): Promise<EncryptedData> {
    const encryptedData = new EncryptedData();
    encryptedData.data = data;

    const db = await getConnectedDb(this.dbConnection);
    const result = await db.getRepository(EncryptedData).save(encryptedData);

    const credentialEncryptedData = new CredentialEncryptedData();
    credentialEncryptedData.credentialHash = credentialHash;
    credentialEncryptedData.encryptedDataId = result.id;
    credentialEncryptedData.decryptedKey = decryptedKey;
    console.log('credentialEncryptedData', credentialEncryptedData);

    await db
      .getRepository(CredentialEncryptedData)
      .save(credentialEncryptedData);

    return result;
  }

  async getEncryptedData(args: { id?: string }): Promise<string | undefined> {
    const db = await getConnectedDb(this.dbConnection);
    const encryptedData = await db.getRepository(EncryptedData).findOneBy(args);
    return encryptedData?.data;
  }

  async getEncryptedDataByCredentialHash(
    credentialHash: string
  ): Promise<IFetchEncryptedDataByCredentialHashResult | undefined> {
    const db = await getConnectedDb(this.dbConnection);
    const credentialEncryptedData = await db
      .getRepository(CredentialEncryptedData)
      .findOneBy({ credentialHash });
    if (!credentialEncryptedData) {
      return undefined;
    }

    const encryptedData = await this.getEncryptedData({
      id: credentialEncryptedData.encryptedDataId,
    });

    if (!encryptedData) {
      return undefined;
    }

    return {
      encryptedData,
      encryptedDataId: credentialEncryptedData.encryptedDataId,
      decryptedKey: credentialEncryptedData.decryptedKey,
    };
  }
}
