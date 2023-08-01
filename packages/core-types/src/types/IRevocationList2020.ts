import { IPluginMethodMap, IAgent } from './IAgent.js';
import { Request } from 'express';
import { CredentialStatus, VerifiableCredential } from './vc-data-model.js';

/**
 * @public
 */
export interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 */
export interface IRevocationListDataArgs {
  revocationListPath?: string;
  bitStringLength?: string;
  revocationVCIssuer: string;

  [x: string]: any;
}

/**
 * @public
 */
export interface IHashCredentialArgs {
  hash: string;
}

/**
 * @public
 */
export interface IRevocationList2020 extends IPluginMethodMap {
  getRevocationData(args: IRevocationListDataArgs): Promise<any>;
  getRevocationListVC(revocationListFullUrlPath: string): Promise<any>;
  checkStatus(
    args: IHashCredentialArgs,
    context: { agent?: IAgent }
  ): Promise<CredentialStatus>;
  revokeCredential(
    args: IHashCredentialArgs,
    context: { agent?: IAgent }
  ): Promise<CredentialStatus>;
  activateCredential(
    args: IHashCredentialArgs,
    context: { agent?: IAgent }
  ): Promise<CredentialStatus>;
}
