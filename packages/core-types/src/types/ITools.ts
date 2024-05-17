import { IAgent, IPluginMethodMap } from './IAgent.js';

/**
 * @public
 */
export interface IToolsComputeHashArgs {
  value: string;
}

/**
 * @public
 */
export interface ITools extends IPluginMethodMap {
  computeHash(
    args: IToolsComputeHashArgs,
    context: { agent?: IAgent },
  ): Promise<string>;
}
