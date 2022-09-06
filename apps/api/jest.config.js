module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  collectCoverage: false,
  collectCoverageFrom: ["src/**/**/**/*.{ts,tsx,js,jsx}"],
  coverageDirectory: "<rootDir>/.coverage/",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};
