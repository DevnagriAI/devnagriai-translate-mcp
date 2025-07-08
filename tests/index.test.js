/**
 * Unit tests for the Devnagri MCP Server
 */
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { MockServerTransport } from '@modelcontextprotocol/sdk/server/test-utils.js';
import { z } from 'zod';

// Import API client for setting up mocks
import apiClient from '../src/api-client.js';

// Mock the API client
jest.mock('../src/api-client.js', () => ({
  __esModule: true,
  default: {
    translate: jest.fn(),
    detectLanguage: jest.fn(),
    getSupportedLanguages: jest.fn()
  }
}));

// Reference for the server instance
let server;

describe('Devnagri MCP Server', () => {
  let transport;

  beforeEach(async () => {
    // Reset mocks
    jest.resetAllMocks();
    jest.clearAllMocks();
    
    // Reset stdout/stderr to not interfere with tests
    jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    
    // Create a fresh server instance for each test
    server = new McpServer({
      name: 'Test MCP Server',
      version: 'test',
      description: 'Test MCP server'
    });
    
    // Register the translation tool
    server.tool(
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
    
    // Register the detect language tool
    server.tool(
      'detect_language',
      {
        text: z.string().describe('The text for language detection')
      },
      async ({ text }) => {
        try {
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
    
    // Register the list supported languages tool
    server.tool(
      'list_supported_languages',
      {},
      async () => {
        try {
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
    
    // Create a mock transport
    transport = new MockServerTransport();
    await server.connect(transport);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('translate tool', () => {
    it('should handle translation request correctly', async () => {
      // Setup mock response
      apiClient.translate.mockResolvedValue('नमस्ते दुनिया');
      
      // Make a tool call
      const result = await transport.invokeServerTool('translate', {
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi',
        translation_type: 'literal'
      });
      
      // Verify API client was called correctly
      expect(apiClient.translate).toHaveBeenCalledWith(
        'Hello world',
        'en',
        'hi'
      );
      
      // Verify the result
      const content = JSON.parse(result.content[0].text);
      expect(content.translated_text).toBe('नमस्ते दुनिया');
      expect(content.source_language).toBe('en');
      expect(content.target_language).toBe('hi');
      expect(content.translation_type).toBe('literal');
    });

    it('should handle translation errors gracefully', async () => {
      // Setup mock failure
      apiClient.translate.mockRejectedValue(new Error('API error'));
      
      // Attempt tool call and expect it to reject
      await expect(transport.invokeServerTool('translate', {
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi'
      })).rejects.toThrow();
      
      // Verify API client was called
      expect(apiClient.translate).toHaveBeenCalled();
    });

    it('should use default translation_type if not provided', async () => {
      // Setup mock response
      apiClient.translate.mockResolvedValue('नमस्ते दुनिया');
      
      // Make a tool call without specifying translation_type
      const result = await transport.invokeServerTool('translate', {
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi'
      });
      
      // Verify the result uses the default
      const content = JSON.parse(result.content[0].text);
      expect(content.translation_type).toBe('literal');
    });
  });

  describe('detect_language tool', () => {
    it('should handle language detection correctly', async () => {
      // Setup mock response
      apiClient.detectLanguage.mockResolvedValue({
        detected_language: 'hi',
        confidence_score: 0.95,
        supported: true
      });
      
      // Make a tool call
      const result = await transport.invokeServerTool('detect_language', {
        text: 'नमस्ते दुनिया'
      });
      
      // Verify API client was called correctly
      expect(apiClient.detectLanguage).toHaveBeenCalledWith('नमस्ते दुनिया');
      
      // Verify the result
      const content = JSON.parse(result.content[0].text);
      expect(content.detected_language).toBe('hi');
      expect(content.confidence_score).toBe(0.95);
      expect(content.supported).toBe(true);
    });

    it('should handle detection errors gracefully', async () => {
      // Setup mock failure
      apiClient.detectLanguage.mockRejectedValue(new Error('Detection error'));
      
      // Attempt tool call and expect it to reject
      await expect(transport.invokeServerTool('detect_language', {
        text: 'नमस्ते दुनिया'
      })).rejects.toThrow();
      
      // Verify API client was called
      expect(apiClient.detectLanguage).toHaveBeenCalled();
    });
  });

  describe('list_supported_languages tool', () => {
    it('should return the list of supported languages', async () => {
      // Setup mock response
      const mockLanguages = [
        { name: 'Hindi', native_name: 'हिंदी', code: 'hi' },
        { name: 'English', native_name: 'English', code: 'en' }
      ];
      apiClient.getSupportedLanguages.mockReturnValue(mockLanguages);
      
      // Make a tool call
      const result = await transport.invokeServerTool('list_supported_languages', {});
      
      // Verify API client was called
      expect(apiClient.getSupportedLanguages).toHaveBeenCalled();
      
      // Verify the result
      const content = JSON.parse(result.content[0].text);
      expect(content).toEqual(mockLanguages);
    });

    it('should handle errors gracefully', async () => {
      // Setup mock failure
      apiClient.getSupportedLanguages.mockImplementation(() => {
        throw new Error('Language list error');
      });
      
      // Attempt tool call and expect it to reject
      await expect(transport.invokeServerTool('list_supported_languages', {}))
        .rejects.toThrow();
      
      // Verify API client was called
      expect(apiClient.getSupportedLanguages).toHaveBeenCalled();
    });
  });
});
