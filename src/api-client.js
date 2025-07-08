import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DEVNAGRI_API_URL = 'https://api.devnagri.com/machine-translation/v2/translate';
const API_KEY = process.env.DEVNAGRI_API_KEY;

/**
 * @class DevnagriApiClient
 * @description Client for interacting with the Devnagri Translation API
 */
class DevnagriApiClient {
  /**
   * Translates text from source language to target language
   * @param {string} sourceText - Text to translate
   * @param {string} sourceLanguage - Source language code (e.g., 'en')
   * @param {string} targetLanguage - Target language code (e.g., 'hi')
   * @returns {Promise<string>} - Translated text
   * @throws {Error} - If translation fails
   */
  async translate(sourceText, sourceLanguage, targetLanguage) {
    try {
      // Using URLSearchParams instead of FormData for better Node.js compatibility
      const params = new URLSearchParams();
      params.append('key', API_KEY);
      params.append('sentence', sourceText);
      params.append('src_lang', sourceLanguage);
      params.append('dest_lang', targetLanguage);

      const response = await axios.post(DEVNAGRI_API_URL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status !== 200) {
        throw new Error(`Translation failed: ${response.data.msg || 'Unknown error'}`);
      }

      return response.data.translated_text;
    } catch (error) {
      console.error('Translation error:', error.message);
      throw new Error(`Failed to translate text: ${error.message}`);
    }
  }

  /**
   * Simple language detection based on character set analysis
   * Note: This is a simplified implementation. In a production environment,
   * you might want to use a dedicated language detection service.
   * @param {string} text - Text to detect language for
   * @returns {Promise<Object>} - Detected language information
   */
  async detectLanguage(text) {
    // This is a simplified language detection function
    // In a real implementation, you would use a proper language detection API

    // Map of script patterns to language codes
    const scriptPatterns = [
      { pattern: /[\u0900-\u097F]/g, code: 'hi', name: 'Hindi' },
      { pattern: /[\u0A80-\u0AFF]/g, code: 'gu', name: 'Gujarati' },
      { pattern: /[\u0B00-\u0B7F]/g, code: 'or', name: 'Odia' },
      { pattern: /[\u0B80-\u0BFF]/g, code: 'ta', name: 'Tamil' },
      { pattern: /[\u0C00-\u0C7F]/g, code: 'te', name: 'Telugu' },
      { pattern: /[\u0C80-\u0CFF]/g, code: 'kn', name: 'Kannada' },
      { pattern: /[\u0D00-\u0D7F]/g, code: 'ml', name: 'Malayalam' },
      { pattern: /[\u0A00-\u0A7F]/g, code: 'pa', name: 'Punjabi' },
      { pattern: /[\u0980-\u09FF]/g, code: 'bn', name: 'Bengali' },
      { pattern: /[\u0600-\u06FF]/g, code: 'ar', name: 'Arabic' },
      { pattern: /[\u0F00-\u0FFF]/g, code: 'bo', name: 'Tibetan' },
      { pattern: /[\u0400-\u04FF]/g, code: 'ru', name: 'Russian' },
      { pattern: /[\u0590-\u05FF]/g, code: 'he', name: 'Hebrew' },
      { pattern: /[\u4E00-\u9FFF]/g, code: 'zh-CN', name: 'Chinese' },
      { pattern: /[\u3040-\u309F]/g, code: 'ja', name: 'Japanese' },
      { pattern: /[\uAC00-\uD7AF]/g, code: 'ko', name: 'Korean' },
      { pattern: /[A-Za-z]/g, code: 'en', name: 'English' }
    ];

    // Count occurrences of each script
    const scriptCounts = scriptPatterns.map(({ pattern, code, name }) => {
      const matches = text.match(pattern);
      return {
        code,
        name,
        count: matches ? matches.length : 0
      };
    });

    // Find the script with the highest count
    scriptCounts.sort((a, b) => b.count - a.count);
    const detectedLanguage = scriptCounts[0];

    // Verify if the supported languages list includes this language
    const supportedLanguages = this.getSupportedLanguages();
    const isSupported = supportedLanguages.some(lang => lang.code === detectedLanguage.code);

    return {
      detected_language: detectedLanguage.code,
      confidence_score: detectedLanguage.count / text.length,
      supported: isSupported
    };
  }

  /**
   * Get list of supported languages
   * @returns {Array} - Array of supported languages with name, native name, and code
   */
  getSupportedLanguages() {
    return [
      { name: 'Hindi', native_name: 'हिंदी', code: 'hi' },
      { name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ', code: 'pa' },
      { name: 'Tamil', native_name: 'தமிழ்', code: 'ta' },
      { name: 'Gujarati', native_name: 'ગુજરાતી', code: 'gu' },
      { name: 'Kannada', native_name: 'ಕನ್ನಡ', code: 'kn' },
      { name: 'Bengali', native_name: 'বাংলা', code: 'bn' },
      { name: 'Marathi', native_name: 'मराठी', code: 'mr' },
      { name: 'Telugu', native_name: 'తెలుగు', code: 'te' },
      { name: 'English', native_name: 'English', code: 'en' },
      { name: 'Malayalam', native_name: 'മലയാളം', code: 'ml' },
      { name: 'Assamese', native_name: 'অসমীয়া', code: 'as' },
      { name: 'Odia', native_name: 'ଓଡ଼ିଆ', code: 'or' },
      { name: 'French', native_name: 'français', code: 'fr' },
      { name: 'Arabic', native_name: 'عربى', code: 'ar' },
      { name: 'German', native_name: 'Deutsche', code: 'de' },
      { name: 'Spanish', native_name: 'Español', code: 'es' },
      { name: 'Japanese', native_name: '日本人', code: 'ja' },
      { name: 'Italian', native_name: 'italiano', code: 'it' },
      { name: 'Dutch', native_name: 'Nederlands', code: 'nl' },
      { name: 'Portuguese', native_name: 'Português', code: 'pt' },
      { name: 'Vietnamese', native_name: 'Tiếng Việt', code: 'vi' },
      { name: 'Indonesian', native_name: 'Bahasa Indonesia', code: 'id' },
      { name: 'Urdu', native_name: 'اردو', code: 'ur' },
      { name: 'Chinese (Simplified)', native_name: '简体中文', code: 'zh-CN' },
      { name: 'Chinese (Traditional)', native_name: '中國傳統的', code: 'zh-TW' },
      { name: 'Kashmiri', native_name: 'कॉशुर', code: 'ksm' },
      { name: 'Konkani', native_name: 'कोंकणी', code: 'gom' },
      { name: 'Manipuri', native_name: 'ꯃꯅꯤꯄꯨꯔꯤꯗꯥ ꯂꯩꯕꯥ꯫', code: 'mni-Mtei' },
      { name: 'Nepali', native_name: 'नेपाली', code: 'ne' },
      { name: 'Sanskrit', native_name: 'संस्कृत', code: 'sa' },
      { name: 'Sindhi', native_name: 'سنڌي', code: 'sd' },
      { name: 'Bodo', native_name: 'बड़ो', code: 'bodo' },
      { name: 'Santhali', native_name: 'ᱥᱟᱱᱛᱟᱲᱤ', code: 'snthl' },
      { name: 'Maithili', native_name: 'मैथिली', code: 'mai' },
      { name: 'Dogri', native_name: 'डोगरी', code: 'doi' },
      { name: 'Malay', native_name: 'Melayu', code: 'ms' },
      { name: 'Filipino', native_name: 'Filipino', code: 'tl' }
    ];
  }
}

export default new DevnagriApiClient();
