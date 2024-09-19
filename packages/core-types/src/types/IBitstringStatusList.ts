import { StatusEntry } from 'credential-status';
import { IPluginMethodMap, IAgent } from './IAgent.js';
import {
  CredentialStatus,
  IssuerType,
  VerifiableCredential,
} from './vc-data-model.js';

/**
 * @public
 */
export enum StatusPurposeType {
  revocation = 'revocation',
  suspension = 'suspension',
  message = 'message',
}

/**
 * @public
 */
export interface IBitstringStatusListArgs {
  bitstringDomainURL: string;
  statusPurpose: StatusPurposeType;
  bitStringLength: number;
  bitstringStatusIssuer: string;
  statusSize?: number;
  statusMessages?: { status: string; message?: string }[];
  statusReference?: string;

  [x: string]: any;
}

/**
 * @public
 */
export interface ISetBitstringStatusArgs {
  statusListCredential: string;
  statusListVCIssuer: string;
  statusPurpose: string;
  index: number;
  status: boolean;
}

/**
 * @public
 */
export type IIssueBitstringStatusListArgs = Omit<
  IBitstringStatusListArgs,
  'bitstringDomainURL'
>;

/**
 * @public
 */
export type IVerifiableCredentialJSONOrJWT =
  | string
  | { credentialStatus: StatusEntry; issuer: IssuerType };

/**
 * @public
 */
export type ICheckBitstringStatusArgs = {
  verifiableCredential: IVerifiableCredentialJSONOrJWT;
};

/**
 * @public
 */
export interface IBitstringStatusList extends IPluginMethodMap {
  issueBitstringStatusList(
    args: IIssueBitstringStatusListArgs,
    context: {
      agent?: IAgent;
    },
  ): Promise<any>;
  checkBitstringStatus(
    args: ICheckBitstringStatusArgs,
    context: { agent?: IAgent },
  ): Promise<CredentialStatus>;
  setBitstringStatus(
    args: ISetBitstringStatusArgs,
    context: { agent?: IAgent },
  ): Promise<any>;
  getBitstringStatusListVC(id: number): Promise<any>;
}

/**
 * @public
 */
export interface IBitstringStatusListEntry {
  id: string;
  type: string;
  statusPurpose: StatusPurposeType;
  statusListIndex: number;
  statusListCredential: string;
}
