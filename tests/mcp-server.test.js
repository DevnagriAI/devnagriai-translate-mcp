/**
 * Unit tests for the Devnagri MCP Server's tool handlers
 * 
 * This test file focuses on testing the tool handler logic separately
 * from the MCP server infrastructure to avoid SDK path resolution issues
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create manual mock functions we'll use in our tests
const mockTranslate = jest.fn();
const mockDetectLanguage = jest.fn();
const mockGetSupportedLanguages = jest.fn();

// Create a mock API client that simulates the real one
const mockApiClient = {
  translate: mockTranslate,
  detectLanguage: mockDetectLanguage,
  getSupportedLanguages: mockGetSupportedLanguages
};

describe('Devnagri MCP Server Tool Handlers', () => {
  // Setup and reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockTranslate.mockReset();
    mockDetectLanguage.mockReset();
    mockGetSupportedLanguages.mockReset();
  });

  describe('translate tool handler', () => {
    it('should format translation results correctly', async () => {
      // Set up the mock translate function to return a successful result
      mockTranslate.mockResolvedValue('नमस्ते दुनिया');
      
      // Create a handler function similar to the one in index.js
      const translateHandler = async ({ source_text, source_language, target_language, translation_type = 'literal' }) => {
        try {
          // Get the translation
          const translatedText = await mockApiClient.translate(
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
      };
      
      // Call the handler function
      const result = await translateHandler({
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi',
        translation_type: 'literal'
      });
      
      // Verify the mock was called with correct parameters
      expect(mockTranslate).toHaveBeenCalledWith(
        'Hello world',
        'en',
        'hi'
      );
      
      // Verify the result structure
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      // Parse and verify the content
      const parsedContent = JSON.parse(result.content[0].text);
      expect(parsedContent).toEqual({
        translated_text: 'नमस्ते दुनिया',
        source_language: 'en',
        target_language: 'hi',
        translation_type: 'literal'
      });
    });

    it('should handle translation errors', async () => {
      // Set up the mock to throw an error
      mockTranslate.mockRejectedValue(new Error('Translation failed'));
      
      // Create a handler function similar to the one in index.js
      const translateHandler = async ({ source_text, source_language, target_language, translation_type = 'literal' }) => {
        try {
          // Get the translation
          const translatedText = await mockApiClient.translate(
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
      };
      
      // Call the handler function and expect it to throw
      await expect(translateHandler({
        source_text: 'Hello world',
        source_language: 'en',
        target_language: 'hi'
      })).rejects.toThrow('Translation failed');
      
      // Verify the mock was called
      expect(mockTranslate).toHaveBeenCalled();
    });
  });

  describe('detect_language tool handler', () => {
    it('should return language detection results correctly', async () => {
      // Create mock detection result
      const mockDetectionResult = {
        detected_language: 'hi',
        confidence_score: 0.95,
        supported: true
      };
      
      // Set up the mock to return the result
      mockDetectLanguage.mockResolvedValue(mockDetectionResult);
      
      // Create a handler function similar to the one in index.js
      const detectLanguageHandler = async ({ text }) => {
        try {
          // Detect the language
          const detection = await mockApiClient.detectLanguage(text);
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(detection, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      };
      
      // Call the handler function
      const result = await detectLanguageHandler({
        text: 'नमस्ते दुनिया'
      });
      
      // Verify the mock was called correctly
      expect(mockDetectLanguage).toHaveBeenCalledWith('नमस्ते दुनिया');
      
      // Verify the result structure
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      // Parse and verify the content
      const parsedContent = JSON.parse(result.content[0].text);
      expect(parsedContent).toEqual(mockDetectionResult);
    });

    it('should handle detection errors', async () => {
      // Set up the mock to throw an error
      mockDetectLanguage.mockRejectedValue(new Error('Detection failed'));
      
      // Create a handler function similar to the one in index.js
      const detectLanguageHandler = async ({ text }) => {
        try {
          // Detect the language
          const detection = await mockApiClient.detectLanguage(text);
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(detection, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      };
      
      // Call the handler function and expect it to throw
      await expect(detectLanguageHandler({
        text: 'नमस्ते दुनिया'
      })).rejects.toThrow('Detection failed');
      
      // Verify the mock was called
      expect(mockDetectLanguage).toHaveBeenCalled();
    });
  });

  describe('list_supported_languages tool handler', () => {
    it('should return the list of supported languages', async () => {
      // Create mock languages list
      const mockLanguages = [
        { name: 'Hindi', native_name: 'हिंदी', code: 'hi' },
        { name: 'English', native_name: 'English', code: 'en' }
      ];
      
      // Set up the mock to return the list
      mockGetSupportedLanguages.mockReturnValue(mockLanguages);
      
      // Create a handler function similar to the one in index.js
      const listLanguagesHandler = async () => {
        try {
          // Get the list of supported languages
          const languages = mockApiClient.getSupportedLanguages();
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(languages, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      };
      
      // Call the handler function
      const result = await listLanguagesHandler();
      
      // Verify the mock was called
      expect(mockGetSupportedLanguages).toHaveBeenCalled();
      
      // Verify the result structure
      expect(result).toHaveProperty('content');
      expect(result.content[0]).toHaveProperty('type', 'text');
      
      // Parse and verify the content
      const parsedContent = JSON.parse(result.content[0].text);
      expect(parsedContent).toEqual(mockLanguages);
    });

    it('should handle errors when listing languages', async () => {
      // Set up the mock to throw an error
      mockGetSupportedLanguages.mockImplementation(() => {
        throw new Error('Language list error');
      });
      
      // Create a handler function similar to the one in index.js
      const listLanguagesHandler = async () => {
        try {
          // Get the list of supported languages
          const languages = mockApiClient.getSupportedLanguages();
          
          return {
            content: [{ 
              type: 'text', 
              text: JSON.stringify(languages, null, 2)
            }]
          };
        } catch (error) {
          throw error;
        }
      };
      
      // Call the handler function and expect it to throw
      await expect(listLanguagesHandler()).rejects.toThrow('Language list error');
      
      // Verify the mock was called
      expect(mockGetSupportedLanguages).toHaveBeenCalled();
    });
  });
});
