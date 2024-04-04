import { IPluginMethodMap, IAgent } from './IAgent.js';
import { IHashCredentialArgs } from './IRevocationList2020.js';
import { CredentialStatus } from './vc-data-model.js';

/**
 * @public
 */
export interface IBitStringStatusListDataArgs {
  bitStringStatusListPath?: string;
  bitStringLength?: string;
  bitStringStatusListVCIssuer: string;

  [x: string]: any;
}

/**
 * @public
 */
export interface IBitStringStatusList extends IPluginMethodMap {
  getBitStringStatusListData(args: IBitStringStatusListDataArgs): Promise<any>;
  getBitStringStatusListVC(bitStringStatusListUrlPath: string): Promise<any>;
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
