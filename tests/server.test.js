import { describe, it, expect, jest } from '@jest/globals';

// Mock the entire MCP SDK
jest.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: jest.fn().mockImplementation(() => ({
    tool: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined)
  }))
}));

jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({}))
}));

// Mock the API client
jest.mock('../src/api-client.js', () => ({
  default: {
    translate: jest.fn(),
    detectLanguage: jest.fn(),
    getSupportedLanguages: jest.fn()
  }
}));

describe('MCP Server', () => {
  describe('Tool registration', () => {
    it('should register all required tools', async () => {
      // Import the server module which will trigger tool registration
      const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
      await import('../src/index.js');
      
      // Check if McpServer was instantiated
      expect(McpServer).toHaveBeenCalled();
      
      // Check if each tool was registered (3 tools)
      const mockServer = McpServer.mock.results[0].value;
      expect(mockServer.tool).toHaveBeenCalledTimes(3);
      
      // Check if each tool was properly registered
      const toolCalls = mockServer.tool.mock.calls;
      const toolNames = toolCalls.map(call => call[0]);
      
      expect(toolNames).toContain('translate');
      expect(toolNames).toContain('detect_language');
      expect(toolNames).toContain('list_supported_languages');
    });
  });
  
  describe('Server startup', () => {
    it('should connect to the transport', async () => {
      // Import the server module
      const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
      
      // Reset the mock to clear previous calls
      McpServer.mockClear();
      
      // Re-import to trigger server startup
      await import('../src/index.js');
      
      // Check if server.connect was called
      const mockServer = McpServer.mock.results[0].value;
      expect(mockServer.connect).toHaveBeenCalled();
    });
  });
});
