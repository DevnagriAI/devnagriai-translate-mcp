import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import apiClient from './api-client.js';

/**
 * Initialize the MCP Server for Translation Services
 */
const server = new McpServer(
  {
    name: "Translation Service",
    version: "1.0.0",
    description: "MCP server for translation services with focus on Indic languages"
  },
  {
    capabilities: {
      logging: {},
    },
  }
);

/**
 * Tool: translate
 * Translates text from source language to target language
 */
server.tool(
  "translate",
  {
    source_text: z.string().min(1).describe("The text to be translated"),
    source_language: z.string().min(2).max(7).describe("The source language code (e.g., 'en')"),
    target_language: z.string().min(2).max(7).describe("The target language code (e.g., 'hi')"),
    translation_type: z.enum(["literal", "base"]).default("literal").describe("Type of translation requested")
  },
  async ({ source_text, source_language, target_language, translation_type }) => {
    try {
      console.log(`Translating from ${source_language} to ${target_language}: ${source_text}`);
      
      // Get the translation
      const translatedText = await apiClient.translate(
        source_text,
        source_language,
        target_language
      );
      
      // For 'base' translations, we would implement additional processing 
      // to optimize for LLM understanding. This is a simplification.
      // In a production environment, you might have different API endpoints or post-processing
      const result = {
        translated_text: translatedText,
        source_language,
        target_language,
        translation_type
      };
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(result, null, 2)
        }],
      };
    } catch (error) {
      console.error(`Translation error: ${error.message}`);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: error.message }, null, 2)
        }],
      };
    }
  }
);

/**
 * Tool: detect_language
 * Detects the language of the provided text
 */
server.tool(
  "detect_language",
  {
    text: z.string().min(1).describe("The text for language detection")
  },
  async ({ text }) => {
    try {
      console.log(`Detecting language for: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
      
      // Detect the language
      const detection = await apiClient.detectLanguage(text);
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(detection, null, 2)
        }],
      };
    } catch (error) {
      console.error(`Language detection error: ${error.message}`);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: error.message }, null, 2)
        }],
      };
    }
  }
);

/**
 * Tool: list_supported_languages
 * Returns a list of all supported languages for translation
 */
server.tool(
  "list_supported_languages",
  {},
  async () => {
    try {
      console.log("Listing supported languages");
      
      // Get the list of supported languages
      const languages = apiClient.getSupportedLanguages();
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify(languages, null, 2)
        }],
      };
    } catch (error) {
      console.error(`Error listing languages: ${error.message}`);
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ error: error.message }, null, 2)
        }],
      };
    }
  }
);

/**
 * Start the server with stdio transport
 */
async function main() {
  try {
    console.log("Starting Translation Service MCP Server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Server ready and waiting for requests");
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

main();
