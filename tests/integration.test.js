/**
 * Integration tests for Devnagri MCP Server
 * 
 * These tests simulate a complete flow from client to server to API.
 * We use a mock HTTP server to simulate the Devnagri API responses.
 */
import { jest, describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import http from 'http';
import { AddressInfo } from 'net';
import axios from 'axios';
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { DirectTransport } from '@modelcontextprotocol/sdk/test-utils.js';
import { z } from 'zod';

// Mock environment setup
process.env.DEVNAGRI_API_KEY = 'test-api-key';

// Create a simple custom API client for integration testing
class TestApiClient {
  constructor(mockApiUrl) {
    this.mockApiUrl = mockApiUrl;
    this.apiKey = 'test-api-key';
  }

  async translate(sourceText, sourceLanguage, targetLanguage) {
    // In an integration test, we'll make a real HTTP request to our mock server
    const params = new URLSearchParams();
    params.append('key', this.apiKey);
    params.append('sentence', sourceText);
    params.append('src_lang', sourceLanguage);
    params.append('dest_lang', targetLanguage);
    
    // Use axios for HTTP requests
    try {
      const response = await axios.post(this.mockApiUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      return response.data.translated_text;
    } catch (error) {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }
  
  async detectLanguage(text) {
    // Simplified mock implementation for testing
    return {
      detected_language: 'hi',
      confidence_score: 0.95,
      supported: true
    };
  }
  
  getSupportedLanguages() {
    // Return a minimal list of supported languages for testing
    return [
      { name: 'Hindi', native_name: 'हिंदी', code: 'hi' },
      { name: 'English', native_name: 'English', code: 'en' }
    ];
  }
}

// We'll use this to track outgoing HTTP requests
let lastRequest = null;

describe('Devnagri MCP Server Integration', () => {
  let mockApiServer;
  let mockApiPort;
  let mcpServer;
  let mcpClient;
  let transport;
  let apiClient;

  beforeAll(async () => {
    // Start a mock API server
    mockApiServer = http.createServer((req, res) => {
      // Store request details for later verification
      lastRequest = {
        method: req.method,
        url: req.url,
        headers: req.headers
      };

      // Collect request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        lastRequest.body = body;

        // Determine response based on request
        if (req.url.includes('/translate')) {
          // Translation endpoint
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            translated_text: 'नमस्ते दुनिया',
            src_lang: 'en',
            dest_lang: 'hi'
          }));
        } else {
          // Unknown endpoint
          res.writeHead(404);
          res.end('Not found');
        }
      });
    });

    // Start the mock server
    mockApiServer.listen(0); // Use 0 to get an available port
    const address = mockApiServer.address();
    mockApiPort = address.port;

    // Create a custom API client that points to our mock server
    const mockApiUrl = `http://localhost:${mockApiPort}/translate`;
    apiClient = new TestApiClient(mockApiUrl);

    // Create a direct transport for testing
    transport = new DirectTransport();

    // Create and connect MCP server
    mcpServer = new McpServer({
      name: 'Test Devnagri MCP Server',
      version: 'test',
      description: 'Test MCP server'
    });

    // Register the tools as in the original server
    mcpServer.tool(
      'translate',
      {
        source_text: z.string().describe('The text to be translated'),
        source_language: z.string().describe('The source language code (e.g., "en")'),
        target_language: z.string().describe('The target language code (e.g., "hi")'),
        translation_type: z.enum(['literal', 'base']).describe('Type of translation requested').default('literal')
      },
      async ({ source_text, source_language, target_language, translation_type = 'literal' }) => {
        try {
          // Get the translation
          const translatedText = await apiClient.translate(
            source_text,
            source_language,
            target_language
          );
          
          const result = {
            translated_text: translatedText,
            source_language,
            target_language,
            translation_type
          };
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      }
    );

    mcpServer.tool(
      'detect_language',
      {
        text: z.string().describe('The text for language detection')
      },
      async ({ text }) => {
        try {
          // Detect the language
          const detection = await apiClient.detectLanguage(text);
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(detection, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      }
    );

    mcpServer.tool(
      'list_supported_languages',
      {},
      async () => {
        try {
          // Get the list of supported languages
          const languages = apiClient.getSupportedLanguages();
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(languages, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      }
    );

    await mcpServer.connect(transport.serverTransport);

    // Create MCP client
    mcpClient = new McpClient();
    await mcpClient.connect(transport.clientTransport);
  });

  afterAll(async () => {
    // Close the mock API server
    mockApiServer.close();
    
    // Disconnect MCP client and server
    await mcpClient.disconnect();
    await mcpServer.disconnect();
  });

  beforeEach(() => {
    // Reset request tracking
    lastRequest = null;
    jest.clearAllMocks();
  });

  describe('translate tool integration', () => {
    it('should translate text through the full MCP pipeline', async () => {
      // Call the translate tool through the MCP client
      const response = await mcpClient.invokeTool('translate', {
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi',
        translation_type: 'literal'
      });

      // Check the response
      const result = JSON.parse(response.content[0].text);
      expect(result.translated_text).toBe('नमस्ते दुनिया');
      expect(result.source_language).toBe('en');
      expect(result.target_language).toBe('hi');
      expect(result.translation_type).toBe('literal');

      // Verify the request was made to the mock API
      expect(lastRequest).not.toBeNull();
      expect(lastRequest.method).toBe('POST');
      expect(lastRequest.url).toContain('/translate');
      
      // Verify the request body contained the correct parameters
      expect(lastRequest.body).toContain('key=test-api-key');
      expect(lastRequest.body).toContain('sentence=Hello%20world');
      expect(lastRequest.body).toContain('src_lang=en');
      expect(lastRequest.body).toContain('dest_lang=hi');
    });

    it('should handle errors in the translation pipeline', async () => {
      // Temporarily modify the mock server to return an error
      const originalListener = mockApiServer.listeners('request')[0];
      mockApiServer.removeAllListeners('request');
      
      mockApiServer.on('request', (req, res) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      });

      // Call the translate tool and expect it to fail
      await expect(mcpClient.invokeTool('translate', {
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi'
      })).rejects.toThrow();

      // Restore the original listener
      mockApiServer.removeAllListeners('request');
      mockApiServer.on('request', originalListener);
    });
  });

  describe('detect_language tool integration', () => {
    it('should detect language through the MCP pipeline', async () => {
      // We'll modify the original detectLanguage method to simulate API interaction
      const originalDetectLanguage = apiClient.detectLanguage;
      apiClient.detectLanguage = jest.fn().mockResolvedValue({
        detected_language: 'hi',
        confidence_score: 0.95,
        supported: true
      });

      // Call the detect_language tool
      const response = await mcpClient.invokeTool('detect_language', {
        text: 'नमस्ते दुनिया'
      });

      // Check the response
      const result = JSON.parse(response.content[0].text);
      expect(result.detected_language).toBe('hi');
      expect(result.confidence_score).toBe(0.95);
      expect(result.supported).toBe(true);

      // Verify the mock was called
      expect(apiClient.detectLanguage).toHaveBeenCalledWith('नमस्ते दुनिया');

      // Restore the original method
      apiClient.detectLanguage = originalDetectLanguage;
    });
  });

  describe('list_supported_languages tool integration', () => {
    it('should list supported languages through the MCP pipeline', async () => {
      // We'll override the getSupportedLanguages method to return a controlled list
      const originalGetLanguages = apiClient.getSupportedLanguages;
      const mockLanguages = [
        { name: 'Hindi', native_name: 'हिंदी', code: 'hi' },
        { name: 'English', native_name: 'English', code: 'en' }
      ];
      
      apiClient.getSupportedLanguages = jest.fn().mockReturnValue(mockLanguages);

      // Call the list_supported_languages tool
      const response = await mcpClient.invokeTool('list_supported_languages', {});

      // Check the response
      const result = JSON.parse(response.content[0].text);
      expect(result).toEqual(mockLanguages);

      // Verify the mock was called
      expect(apiClient.getSupportedLanguages).toHaveBeenCalled();

      // Restore the original method
      apiClient.getSupportedLanguages = originalGetLanguages;
    });
  });
});
