/* eslint-disable */
export default {
  displayName: 'vc-ui',
  preset: '../../jest.preset.js',
  setupFiles: ['./jest.setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/vc-ui',
  moduleNameMapper: {
    '^react-pdf': 'react-pdf/dist/umd/entry.jest',
  },
};
