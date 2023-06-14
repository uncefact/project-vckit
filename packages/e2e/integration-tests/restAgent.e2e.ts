import credentialW3c from '../__tests__/credentialW3c.js';
import { getRestAgent, setup, tearDown } from '../src/vckit/setup.js';

describe('REST integration tests', () => {
  describe('shared tests', () => {
    const testContext = { getAgent: getRestAgent, setup, tearDown };
    credentialW3c(testContext);
  });
});
