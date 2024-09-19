import credentialW3c from '../__tests__/credentialW3c';
import { getAgent } from '../src/vckit/setup';

import { jest } from '@jest/globals';

const JEST_TIMEOUT = 3 * 60 * 1000;
jest.setTimeout(JEST_TIMEOUT);

describe('Browser integration tests', () => {
  describe('shared tests', () => {
    const testContext = {
      getAgent,
      setup: async () => true,
      tearDown: async () => true,
    };
    credentialW3c(testContext);
  });
});
