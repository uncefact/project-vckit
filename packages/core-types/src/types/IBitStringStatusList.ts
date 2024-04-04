import { IPluginMethodMap, IAgent } from './IAgent.js';
import { IHashCredentialArgs } from './IRevocationList2020.js';
import { CredentialStatus } from './vc-data-model.js';

/**
 * @public
 */
export interface IBitstringStatusListDataArgs {
  bitstringStatusListPath?: string;
  bitstringLength?: string;
  bitstringStatusListVCIssuer: string;

  [x: string]: any;
}

/**
 * @public
 */
export interface IBitstringStatusList extends IPluginMethodMap {
  getBitstringStatusListData(args: IBitstringStatusListDataArgs): Promise<any>;
  getBitstringStatusListVC(bitstringStatusListUrlPath: string): Promise<any>;
  checkStatus(
    args: IHashCredentialArgs,
    context: { agent?: IAgent },
  ): Promise<CredentialStatus>;
  revokeCredential(
    args: IHashCredentialArgs,
    context: { agent?: IAgent },
  ): Promise<CredentialStatus>;
  activateCredential(
    args: IHashCredentialArgs,
    context: { agent?: IAgent },
  ): Promise<CredentialStatus>;
}
