/**
 * Jest setup file for Devnagri MCP server tests
 */
import { jest, beforeAll, afterAll } from '@jest/globals';

// Set test environment variables
process.env.DEVNAGRI_API_KEY = 'test-api-key';

// Add extra jest matchers if needed
// Example: expect.extend({ ... });

// In Jest's ESM mode, we need to use beforeAll for timeout setting
beforeAll(() => {
  // Increase timeout for integration tests
  jest.setTimeout(10000);
});

// Mute console during tests but keep a reference to restore if needed
const originalConsole = { ...console };

// Silence console during tests to keep output clean
console.error = jest.fn();

// Global test teardown
afterAll(() => {
  // Clean up any global state or mocks
  jest.clearAllMocks();
  
  // Restore console if needed
  // console.error = originalConsole.error;
});
