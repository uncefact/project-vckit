import { IPluginMethodMap } from './IAgent.js'
import { IDataStoreGetVerifiableCredentialArgs } from './IDataStore.js'
import { VerifiableCredential } from './vc-data-model.js'



export interface IQRCodeEndpoint extends IPluginMethodMap {
  /**
   * Gets verifiable credential from the data store
   * @param args - arguments for getting verifiable credential
   * @returns a promise that resolves to the verifiable credential
   */
  dataStoreGetVerifiableCredential(args: IDataStoreGetVerifiableCredentialArgs): Promise<VerifiableCredential>
}