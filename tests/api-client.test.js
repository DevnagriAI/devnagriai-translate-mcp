/**
 * Unit tests for the Devnagri API Client
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import apiClient from '../src/api-client.js';

// Mock the axios module
jest.mock('axios', () => {
  return {
    post: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {
          translated_text: 'नमस्ते दुनिया',
          src_lang: 'en',
          dest_lang: 'hi'
        }
      });
    })
  };
});

// Mock dotenv to prevent loading real env variables during tests
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('Devnagri API Client', () => {
  // Setup test environment
  beforeEach(() => {
    // Mock environment variables
    process.env.DEVNAGRI_API_KEY = 'test-api-key';
  });

  // Test the detectLanguage method
  describe('detectLanguage()', () => {
    it('should detect Hindi language', async () => {
      const hindiText = 'नमस्ते दुनिया';
      const result = await apiClient.detectLanguage(hindiText);
      
      expect(result.detected_language).toBe('hi');
      expect(result.supported).toBe(true);
      expect(result.confidence_score).toBeGreaterThan(0);
    });

    it('should detect English language', async () => {
      const englishText = 'Hello world';
      const result = await apiClient.detectLanguage(englishText);
      
      expect(result.detected_language).toBe('en');
      expect(result.supported).toBe(true);
      expect(result.confidence_score).toBeGreaterThan(0);
    });

    it('should handle mixed language text', async () => {
      const mixedText = 'Hello नमस्ते';
      const result = await apiClient.detectLanguage(mixedText);
      
      // The result should be either 'en' or 'hi' depending on which has more characters
      expect(['en', 'hi']).toContain(result.detected_language);
      expect(result.supported).toBe(true);
      expect(result.confidence_score).toBeGreaterThan(0);
    });
  });

  // Test the getSupportedLanguages method
  describe('getSupportedLanguages()', () => {
    it('should return a list of supported languages', () => {
      const languages = apiClient.getSupportedLanguages();
      
      // Verify the structure and content
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(30); // The API supports 35+ languages
      
      // Check for essential languages
      const hasHindi = languages.some(lang => lang.code === 'hi');
      const hasEnglish = languages.some(lang => lang.code === 'en');
      
      expect(hasHindi).toBe(true);
      expect(hasEnglish).toBe(true);
      
      // Check the structure of a language entry
      const language = languages[0];
      expect(language).toHaveProperty('name');
      expect(language).toHaveProperty('native_name');
      expect(language).toHaveProperty('code');
    });
  });
});
