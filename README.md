# @devnagriai/devnagriai-translate-mcp

A JavaScript-based Model Context Protocol (MCP) server providing translation, language detection, and supported language listing via Devnagri AI APIs, with a focus on Indic languages.

## Features

- **Text Translation** between 35+ languages (including all major Indic languages)
- **Language Detection** for any input text
- **Supported Languages Listing**
- **MCP Protocol**: Ready for AI tool integration
- **Robust Error Handling and Validation**
- **Extensive Test Suite**

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [API Key Procurement](#api-key-procurement)
- [Installation](#installation)
  - [NPX (Recommended)](#npx-recommended)
  - [Manual Installation](#manual-installation)
- [Usage](#usage)
  - [Direct Integration](#direct-integration)
  - [Running the Server](#running-the-server)
- [MCP Tools](#mcp-tools)
  - [Tool: translate](#tool-translate)
  - [Tool: detect_language](#tool-detect_language)
  - [Tool: list_supported_languages](#tool-list_supported_languages)
- [Configuration](#configuration)
- [Testing](#testing)
- [Contributing](#contributing)
- [Support](#support)
- [Security](#security)
- [License](#license)

## Quick Start

```bash
npx @devnagriai/devnagriai-translate-mcp API_KEY="your_devnagri_api_key"
```

## API Key Procurement

To use the Devnagri Translation API, you need an API key. Follow these steps:

1. **Sign Up**
   - Go to [Devnagri Dashboard](https://app.devnagri.com/) and sign up for a free account.

2. **Access API Hub**
   - After logging in, navigate to the **API Hub** section from the sidebar menu.

3. **Select the Translation API**
   - Click on **Get API Key**.
   - Click **Create**.
   - Enter a name for the API key.
   - Click **Save**.
   

4. **Copy API Key**
   - Copy the generated API key. Keep it secure and do not share it publicly.

## Installation

### NPX (Recommended)

The simplest way to use this MCP server is through npx, which allows you to run it without installing:

```bash
npx @devnagriai/devnagriai-translate-mcp API_KEY="your_devnagri_api_key"
```

This is ideal for integration with AI tools like Claude, GPT, Windsurf, and Cursor.

### Manual Installation

If you prefer to install the server locally:

1. Clone the repository:

```bash
git clone https://github.com/DevnagriAI/devnagriai-translate-mcp.git
cd devnagriai-translate-mcp
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following content:

```
DEVNAGRI_API_KEY=your_devnagri_api_key
```

## Usage

### Direct Integration

For local/private use or development, add the server to your MCP config:

```json
{
  "mcpServers": {
    "devnagri-translation": {
      "command": "npx",
      "args": [
        "@devnagriai/devnagriai-translate-mcp",
        "API_KEY=\"your_devnagri_api_key\""
      ]
    }
  }
}
```

### Running the Server

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

This MCP server can be used with any MCP client. For example, using the MCP CLI client:

```bash
mcp-client --transport stdio -- node src/index.js
```

### Integration with AI Tools

#### Windsurf

In `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "devnagri-translation": {
    "command": "npx",
    "args": [
      "@devnagriai/devnagriai-translate-mcp",
      "API_KEY=\"your_devnagri_api_key\""
    ]
  }
}
```

#### Cursor

In Cursor's settings:

```json
{
  "tools": {
    "devnagri-translation": {
      "command": "npx",
      "args": [
        "@devnagriai/devnagriai-translate-mcp",
        "API_KEY=\"your_devnagri_api_key\""
      ],
      "transport": "stdio"
    }
  }
}
```

#### Claude

In Claude Desktop App:

1. Go to Settings > Extensions
2. Click "Add Custom Extension"
3. Select "Add from local server"
4. Enter the following details:
   - Name: Devnagri Translation Service
   - Command: `npx @devnagriai/devnagriai-translate-mcp API_KEY="your_devnagri_api_key"`
   - Transport: stdio

Or use this configuration:

```json
{
  "devnagri-translation": {
    "command": "npx",
    "args": [
      "@devnagriai/devnagriai-translate-mcp",
      "API_KEY=\"your_devnagri_api_key\""
    ],
    "transport": "stdio"
  }
}
```

## MCP Tools

The following tools are exposed via this MCP server:

| Tool Name                | Description                                 |
|--------------------------|---------------------------------------------|
| `translate`              | Translate text between supported languages  |
| `detect_language`        | Detect the language of given text           |
| `list_supported_languages` | List all available languages               |

Refer to `examples/mcp_config_example.json` for sample tool configuration.

### Tool: translate

Translates text from source language to target language.

**Parameters**:
- `source_text` (string, required): The text to be translated
- `source_language` (string, required): The source language code (e.g., "en")
- `target_language` (string, required): The target language code (e.g., "hi")
- `translation_type` (string, optional): Type of translation requested ("literal" or "base", defaults to "literal")

**Returns**:
```json
{
  "translated_text": "नमस्ते, आप कैसे हैं?",
  "source_language": "en",
  "target_language": "hi",
  "translation_type": "literal"
}
```

### Tool: detect_language

Detects the language of the provided text.

**Parameters**:
- `text` (string, required): The text for language detection

**Returns**:
```json
{
  "detected_language": "en",
  "confidence_score": 0.98,
  "supported": true
}
```

### Tool: list_supported_languages

Returns a list of all supported languages for translation.

**Parameters**:
- None

**Returns**:
```json
[
  {
    "name": "English",
    "native_name": "English",
    "code": "en"
  },
  {
    "name": "Hindi",
    "native_name": "हिन्दी",
    "code": "hi"
  },
  // ... more languages
]
```

## Configuration

- **API Key**: Required. Pass as an environment variable or command-line argument: `API_KEY="your_devnagri_api_key"`
- **Port**: Defaults to 8080 (can be configured via MCP protocol parameters)
- **.env Support**: You may place your API key in a `.env` file for local development.

## Testing

Run the test suite with:

```bash
npm test
```

Test coverage includes unit and integration tests for all MCP tools and API client logic.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request describing your changes

## Support

- For API issues, contact [Devnagri Support](https://devnagri.com/contact-us/)
- For MCP server issues, open a GitHub issue in this repository

## Security

- **Never share your API key publicly**
- Rotate API keys periodically via the Devnagri dashboard

## License

MIT