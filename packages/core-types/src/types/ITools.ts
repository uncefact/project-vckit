import { IPluginMethodMap } from './IAgent.js';

/**
 * @public
 */
export interface ITools extends IPluginMethodMap {
  computeHash(args: string): Promise<string>;
}
