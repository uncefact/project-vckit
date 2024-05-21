import { defaults } from 'jest-config';

export default {
  rootDir: './',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  collectCoverage: false,
  collectCoverageFrom: [
    'packages/**/src/**/*.ts',
    '!**/examples/**',
    '!packages/cli/**',
    '!**/types/**',
    '!**/build/**',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov', 'json'],
  coverageProvider: 'v8',
  coverageDirectory: './coverage',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/packages/credential-ld/',
    '<rootDir>/packages/vckit-oa-renderers/',
    '<rootDir>/packages/credential-oa/',
  ],
  testEnvironment: 'node',
  automock: false,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.m?tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './packages/tsconfig.settings.json',
      },
    ],
  },
};
