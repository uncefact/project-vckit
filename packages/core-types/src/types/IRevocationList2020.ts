import { IPluginMethodMap, IAgent } from './IAgent';
import { Request } from 'express';

export interface IRevocationListDataArgs {
  revocationListPath: string;
  bitStringLength: string;
  req: RequestWithAgent;
  revocationVCIssuer: string;
}

export interface RequestWithAgent extends Request {
  agent?: IAgent;
}

export interface IRevocationStore extends IPluginMethodMap {
  getRevocationData(
    args: IRevocationListDataArgs,
    req: RequestWithAgent
  ): Promise<{ revocationListFullUrlPath: string; indexCounter: number }>;
  getRevocationListVC(revocationListFullUrlPath: string): Promise<any>;
}
