import { IPluginMethodMap } from './IAgent';

/**
 * @public
 */
export interface IEncryptAndStoreDataArgs {
  data: any;
}

/**
 * @public
 */
export interface IEncrypteAndStoreDataResult {
  id: string;
  key: string;
}

/**
 * @public
 */
export interface IFetchEncryptedDataArgs {
  id?: string;
}

/**
 * @public
 */
export interface IFetchEncryptedDataByCredentialHashArgs {
  credentialHash: string;
}

/**
 * @public
 */
export interface IFetchEncryptedDataByCredentialHashResult {
  encryptedData: string;
  encryptedDataId: string;
  decryptedKey: string;
}

/**
 * @public
 */
export interface IEncryptedStorage extends IPluginMethodMap {
  encryptAndStoreData(
    args: IEncryptAndStoreDataArgs
  ): Promise<IEncrypteAndStoreDataResult>;

  fetchEncryptedData(args: IFetchEncryptedDataArgs): Promise<string>;

  fetchEncryptedDataByCredentialHash(
    args: IFetchEncryptedDataByCredentialHashArgs
  ): Promise<IFetchEncryptedDataByCredentialHashResult>;
}
