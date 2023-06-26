module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'jsonld'],
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  rootDir: 'integration-tests',
  testRegex: './*\\.e2e\\.(ts|tsx?)$',
  transform: {
    '^.+\\.m?tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '../../packages/tsconfig.settings.json',
      },
    ],
  },
  transformIgnorePatterns: [],
  testTimeout: 30000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^uuid$': require.resolve('uuid'),
  },
};
