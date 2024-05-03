import { IPluginMethodMap } from './IAgent.js';

/**
 * @public
 */
export interface ITools extends IPluginMethodMap {
  encryptHash(args: string): Promise<string>;
}
