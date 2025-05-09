# Translation Service MCP Server

A Model Context Protocol (MCP) server for translation services with a focus on Indic languages. This server bridges LLMs and AI applications with the Devnagri translation API, allowing for high-quality translations.

## Features

- Translation between 35+ languages, with special support for Indic languages
- Language detection
- Support for both literal and base translations
- Implements MCP standard for seamless integration with compatible AI clients

## Architecture

The server consists of the following components:

1. **MCP Server Core**: Implements the MCP protocol for communication with clients
2. **Tool Handlers**: Implements the functional logic for each tool
3. **API Client**: Manages communication with the Devnagri translation API
4. **Validation Layer**: Validates incoming requests using Zod

### Available Tools

- `translate`: Translates text from one language to another
- `detect_language`: Detects the language of provided text
- `list_supported_languages`: Lists all supported languages

## Prerequisites

- Node.js (LTS version)
- NPM or Yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd translation-mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following content:

```
DEVNAGRI_API_KEY=your_api_key_here
```

## Usage

### Running the Server

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Connecting to the Server

This MCP server can be used with any MCP client. For example, using the MCP CLI client:

```bash
mcp-client --transport stdio -- node src/index.js
```

## API Reference

### Tool: translate

Translates text from source language to target language.

**Parameters**:
- `source_text` (string, required): The text to be translated
- `source_language` (string, required): The source language code (e.g., "en")
- `target_language` (string, required): The target language code (e.g., "hi")
- `translation_type` (string, optional): Type of translation requested ("literal" or "base", defaults to "literal")

**Returns**:
- JSON object containing:
  - `translated_text` (string): The translated text
  - `source_language` (string): The source language code
  - `target_language` (string): The target language code
  - `translation_type` (string): The type of translation provided

### Tool: detect_language

Detects the language of the provided text.

**Parameters**:
- `text` (string, required): The text for language detection

**Returns**:
- JSON object containing:
  - `detected_language` (string): The detected language code
  - `confidence_score` (number): Confidence level of detection
  - `supported` (boolean): Whether this language is supported for translation

### Tool: list_supported_languages

Returns a list of all supported languages for translation.

**Parameters**:
- None

**Returns**:
- JSON array of language objects, each containing:
  - `name` (string): The language name
  - `native_name` (string): The name of the language in its native script
  - `code` (string): The language code

## Testing

Run tests:

```bash
npm test
```

## License

MIT
