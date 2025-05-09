// Import testing library
import { describe, it, expect, jest } from '@jest/globals';
import apiClient from '../src/api-client.js';

jest.mock('axios');
jest.mock('form-data');
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mock environment variables
process.env.DEVNAGRI_API_KEY = 'test_api_key';

describe('DevnagriApiClient', () => {
  describe('translate', () => {
    it('should translate text correctly', async () => {
      const mockAxios = (await import('axios')).default;
      mockAxios.post.mockResolvedValue({
        data: {
          code: 200,
          msg: 'success',
          key: ['नमस्ते दुनिया']
        }
      });

      const result = await apiClient.translate('Hello world', 'en', 'hi');
      expect(result).toBe('नमस्ते दुनिया');
      expect(mockAxios.post).toHaveBeenCalled();
    });

    it('should handle translation errors', async () => {
      const mockAxios = (await import('axios')).default;
      mockAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.translate('Hello world', 'en', 'hi')).rejects.toThrow('Failed to translate text');
    });
  });

  describe('detectLanguage', () => {
    it('should detect English text', async () => {
      const result = await apiClient.detectLanguage('Hello world');
      expect(result.detected_language).toBe('en');
      expect(result.supported).toBe(true);
    });

    it('should detect Hindi text', async () => {
      const result = await apiClient.detectLanguage('नमस्ते दुनिया');
      expect(result.detected_language).toBe('hi');
      expect(result.supported).toBe(true);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return a list of supported languages', () => {
      const languages = apiClient.getSupportedLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages[0]).toHaveProperty('name');
      expect(languages[0]).toHaveProperty('native_name');
      expect(languages[0]).toHaveProperty('code');
    });
  });
});
