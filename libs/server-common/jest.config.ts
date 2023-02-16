/* eslint-disable */
export default {
  displayName: 'server-common',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['../../jest.proxy.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/server-common',
  testMatch: ['**/**/*.spec.{ts, js}', '**/**/*.test.{ts, js}'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
