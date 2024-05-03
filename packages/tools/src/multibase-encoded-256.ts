import { IAgentPlugin, ITools } from '@vckit/core-types';
import { computeHash } from './hash/computeHash.js';

import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

export class MultibaseEncodedSHA256 implements IAgentPlugin {
  readonly methods: ITools;
  readonly schema = schema.ITools;

  constructor() {
    this.methods = {
      encryptHash: this.encryptHash.bind(this),
    };
  }

  async encryptHash(args: string): Promise<string> {
    const data = await computeHash(args);
    return data;
  }
}
