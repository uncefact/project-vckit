import { IAgent } from '@uncefact/vckit-core-types';
import { Request } from 'express';

/**
 * @public
 */
export interface RequestWithAgent extends Request {
  agent?: IAgent;
}
