export default {
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
    '!**/bin/**'
  ],
  // Only run the api-client and mcp-server tests since those don't have SDK dependencies
  testMatch: ['**/tests/api-client.test.js', '**/tests/mcp-server.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
};
