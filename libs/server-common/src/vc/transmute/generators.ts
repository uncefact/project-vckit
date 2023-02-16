import { DidGeneration } from '@dvp/api-interfaces';
import * as did from '@transmute/did-key.js';

import crypto from 'crypto';

export const generators = {
  didKey: async (type: string, seed?: Buffer): Promise<DidGeneration> => {
    return did.key.generate({
      type,
      accept: 'application/did+ld+json',
      secureRandom: () => {
        if (seed) {
          return seed;
        }
        return crypto.randomBytes(32);
      },
    });
  },
};
