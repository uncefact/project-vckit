import { IPluginMethodMap, IAgent } from './IAgent';
import { Request } from 'express';

/**
 * @public
 */
export interface IRevocationListDataArgs {
  revocationListPath: string;
  bitStringLength: string;
  req: RequestWithAgent;
  revocationVCIssuer: string;
}

/**
 * @public
 */
export interface RequestWithAgent extends Request {
  agent?: IAgent;
}

/**
 * @public
 */
export interface IRevocationStore extends IPluginMethodMap {
  getRevocationData(
    args: IRevocationListDataArgs,
    req: RequestWithAgent
  ): Promise<{ revocationListFullUrlPath: string; indexCounter: number }>;
  getRevocationListVC(revocationListFullUrlPath: string): Promise<any>;
}
