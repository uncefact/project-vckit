import { EncryptedDataStore } from './identifier/encrypted-data-store.js';
import {
  IAgentPlugin,
  IEncryptAndStoreDataArgs,
  IEncrypteAndStoreDataResult,
  IEncryptedStorage,
  IFetchEncryptedDataArgs,
  IFetchEncryptedDataByCredentialHashArgs,
  IFetchEncryptedDataByCredentialHashResult,
} from '@vckit/core-types';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };
import {
  IEncryptionResults,
  decryptString,
  encryptString,
  generateEncryptionKey,
} from '@govtechsg/oa-encryption';
import { OrPromise, computeEntryHash } from '@veramo/utils';
import { DataSource } from 'typeorm';

/**
 * @public
 */
export class EncryptedStorage implements IAgentPlugin {
  readonly methods: IEncryptedStorage;
  readonly schema = schema.IEncryptedStorage;

  private store: EncryptedDataStore;
  constructor(options: { dbConnection: OrPromise<DataSource> }) {
    this.store = new EncryptedDataStore(options.dbConnection);
    this.methods = {
      encryptAndStoreData: this.encryptAndStoreData.bind(this),
      fetchEncryptedData: this.fetchEncryptedData.bind(this),
      fetchEncryptedDataByCredentialHash:
        this.fetchEncryptedDataByCredentialHash.bind(this),
    };
  }

  async encryptAndStoreData(
    args: IEncryptAndStoreDataArgs
  ): Promise<IEncrypteAndStoreDataResult> {
    const { data } = args;
    console.log('encryptAndStoreData', JSON.stringify(data, null, 2));
    const credentialHash = computeEntryHash(data);
    const key = generateEncryptionKey();

    const encryptedDocument: Omit<IEncryptionResults, 'key'> = encryptString(
      JSON.stringify(data),
      key
    );

    const { id } = await this.store.saveEncryptedData(
      credentialHash,
      key,
      JSON.stringify(encryptedDocument)
    );

    return { id, key };
  }

  async fetchEncryptedData(args: IFetchEncryptedDataArgs): Promise<string> {
    const encryptedData = await this.store.getEncryptedData(args);
    if (!encryptedData) {
      throw new Error('Data not found');
    }

    return encryptedData;
  }

  async fetchEncryptedDataByCredentialHash(
    args: IFetchEncryptedDataByCredentialHashArgs
  ): Promise<IFetchEncryptedDataByCredentialHashResult> {
    const result = await this.store.getEncryptedDataByCredentialHash(
      args.credentialHash
    );
    if (!result) {
      throw new Error('Data not found');
    }

    return result;
  }
}
