import { IAgentPlugin, ITools } from '@vckit/core-types';
import { sha256 } from 'multiformats/hashes/sha2';
import { base58btc } from 'multiformats/bases/base58';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };

export class MultibaseEncodedSHA256 implements IAgentPlugin {
  readonly methods: ITools;
  readonly schema = schema.ITools;

  constructor() {
    this.methods = {
      computeHash: this.computeHash.bind(this),
    };
  }

  async computeHash(value: string): Promise<string> {
    if (!value || typeof value !== 'string') {
      throw new Error('Value is invalid');
    }

    const bytes = new TextEncoder().encode(value);
    const hash = await sha256.digest(bytes);
    const multibasedHash = base58btc.encode(hash.bytes);
    return multibasedHash;
  }
}
