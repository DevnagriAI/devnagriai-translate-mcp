#!/usr/bin/env node

// Import new MCP SDK classes and utilities
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import apiClient from './api-client.js';

// Setup logging that doesn't interfere with MCP protocol
const logger = {
  info: (message) => {
    process.stderr.write(`[devnagri-translation] [info] ${message}\n`);
  },
  error: (message, error) => {
    process.stderr.write(`[devnagri-translation] [error] ${message} ${error ? JSON.stringify(error) : ''}\n`);
  }
};

/**
 * Initialize the MCP Server for Translation Services using the modern McpServer class
 */
const server = new McpServer({
  name: 'Devnagri MCP - Translation Service',
  version: '1.0.0',
  description: 'MCP server for translation services with focus on Indic languages'
});

/**
 * Register Translation Tools using the simplified tool() method
 */

// 1. Translate Tool
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
      logger.info(`Translating from ${source_language} to ${target_language}`);

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
      logger.error(`Translation error:`, error);
      throw error;
    }
  }
);

// 2. Detect Language Tool
server.tool(
  'detect_language',
  {
    text: z.string().describe('The text for language detection')
  },
  async ({ text }) => {
    try {
      logger.info(`Detecting language for text`);

      // Detect the language
      const detection = await apiClient.detectLanguage(text);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(detection, null, 2)
        }]
      };
    } catch (error) {
      logger.error(`Language detection error:`, error);
      throw error;
    }
  }
);

// 3. List Supported Languages Tool
server.tool(
  'list_supported_languages',
  {},
  async () => {
    try {
      logger.info('Listing supported languages');

      // Get the list of supported languages
      const languages = apiClient.getSupportedLanguages();

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(languages, null, 2)
        }]
      };
    } catch (error) {
      logger.error(`Error listing languages:`, error);
      throw error;
    }
  }
);

/**
 * Start the server with stdio transport
 */
async function main() {
  try {
    logger.info('Initializing server...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('Server started and connected successfully');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
main();
