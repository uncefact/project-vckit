# E2E Testing Package

The e2e testing package is used to test the end-to-end functionality and compatibility of VCKit packages.

## Usage

To run the e2e tests, run the following command from the root of the repository:

```bash
pnpm test:e2e
```

## Writing Tests

The test cases are writte in `__tests__` directory. Each test case is a file with the following structure:

```typescript
// __tests__/testCaseName.ts
type ConfiguredAgent = TAgent<IDIDManager & IKeyManager & IResolver & ICredentialIssuer>;

export default (testContext: { getAgent: () => ConfiguredAgent; setup: (options?: IAgentOptions) => Promise<boolean>; tearDown: () => Promise<boolean> }) => {
  describe('Test case', () => {
    let agent: ConfiguredAgent;

    beforeAll(async () => {
      await testContext.setup();
      agent = testContext.getAgent();
    });

    afterAll(async () => {
      await testContext.tearDown();
    });
  });

  // test cases
};
```
