# Using Devnagri MCP - Translation Service with AI Tools

This guide explains how to connect and use the Devnagri MCP Translation Service with various AI tools and editors.

## Table of Contents

1. [Introduction](#introduction)
2. [General Setup](#general-setup)
3. [Using with Claude](#using-with-claude)
4. [Using with OpenAI (GPT)](#using-with-openai-gpt)
5. [Using with Windsurf](#using-with-windsurf)
6. [Using with Cursor](#using-with-cursor)
7. [Using with Other MCP-Compatible Tools](#using-with-other-mcp-compatible-tools)
8. [Troubleshooting](#troubleshooting)

## Introduction

The Devnagri MCP - Translation Service provides high-quality translation capabilities for 35+ languages with special support for Indic languages. By connecting this MCP server to AI tools, you enable them to perform accurate translations directly within their interface.

## General Setup

### Using NPX (Recommended)

The Devnagri MCP Translation Service can be run directly using npx without installing or cloning the repository:

```bash
npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"
```

This is the simplest way to run the server and the recommended approach for integration with AI tools.

### Manual Setup

Alternatively, you can set up and run the server manually:

1. Clone the repository and navigate to the directory:
   ```bash
   git clone <repository-url>
   cd devnagri-mcp-translation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file with your Devnagri API key:
   ```
   DEVNAGRI_API_KEY=your_api_key_here
   ```

4. Start the MCP server:
   ```bash
   npm start
   ```

5. The server will start and listen for connections via stdio.

## Using with Claude

### Claude Desktop App

1. Open the Claude Desktop app
2. Go to Settings > Extensions
3. Click "Add Custom Extension"
4. Select "Add from local server"
5. Enter the following details:
   - Name: Devnagri MCP - Translation Service
   - Command: `npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"`
   - Transport: stdio
6. Click "Add Extension"
7. Start a new conversation in Claude
8. Type a query like: "Translate 'Hello, how are you?' to Hindi using the Devnagri translation service"

### Claude Web Interface (with Browser Extensions)

Some browser extensions enable Claude to connect to local MCP servers:

1. Install an MCP-compatible browser extension
2. Follow the extension's instructions to add the Devnagri MCP server
3. Configure it to point to the npx command: `npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"`
4. Use Claude web interface with prompts like: "Translate this text to Tamil using the Devnagri translation service: 'Welcome to our website'"

## Using with OpenAI (GPT)

### Using GPT with MCP-compatible Browser Extensions

1. Install an MCP-compatible browser extension for GPT
2. Configure the extension to connect to your local MCP server
3. Add the Devnagri Translation Service with the command:
   ```
   npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"
   ```
4. In ChatGPT, you can now use prompts like: "Use the Devnagri translation service to translate 'Good morning' to Bengali"

### Using with OpenAI API and Custom Integrations

If you're building an application using OpenAI's API:

1. Set up an MCP client in your application that connects to the Devnagri MCP server
2. Configure your application to send MCP tool calls to this server
3. In your API requests to OpenAI, include information about the available translation tools

## Using with Windsurf

Windsurf has native support for MCP:

1. Open Windsurf
2. Go to Settings > Extensions or Tools
3. Add a new MCP server with the following configuration:
   - Name: Devnagri MCP - Translation Service
   - Command: `npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"`
   - Transport: stdio
4. Save the configuration
5. Use Windsurf with prompts like: "Use Devnagri to translate this text to Gujarati: 'Thank you for your help'"

## Using with Cursor

Cursor IDE has built-in support for MCP servers:

1. Open Cursor
2. Go to Settings > AI > Tools or Extensions
3. Add a new MCP server:
   - Name: Devnagri MCP - Translation Service
   - Command: `npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"`
   - Transport Type: stdio
4. Save the settings
5. In the Cursor AI prompt, you can now request: "Translate 'Hello World' to Hindi using the Devnagri translation service"

## Using with Other MCP-Compatible Tools

For other tools that support the MCP protocol:

1. Locate the tool's extension or plugin settings
2. Add a new MCP server or extension
3. Configure it to use the command:
   ```
   npx devnagri-mcp-translation API_KEY="your_devnagri_api_key"
   ```
4. Set the transport type to "stdio"

## Example Usage Prompts

Once connected to your AI tool of choice, you can use the following prompts:

1. Basic translation:
   ```
   Translate "Hello, welcome to our service" to Hindi using the Devnagri translation service.
   ```

2. Detect language:
   ```
   What language is this text using the Devnagri detection tool: "नमस्ते दुनिया"
   ```

3. List supported languages:
   ```
   Show me the list of languages supported by the Devnagri translation service.
   ```

## Troubleshooting

### Server Connection Issues

If the AI tool cannot connect to the MCP server:

1. Ensure the server is running (`npm start`)
2. Check the command path is correct
3. Verify the transport type is set to "stdio"
4. Look for error messages in the terminal where the server is running

### Translation Errors

If you receive translation errors:

1. Verify your Devnagri API key is correct in the `.env` file
2. Check that the source and target languages are supported
3. Ensure the text to be translated doesn't contain invalid characters
4. Check the server console for detailed error messages

### Permission Issues

If you encounter permission issues:

1. Ensure you have read/write permissions for the directory
2. Try running the server with elevated permissions if necessary
3. Check file path configurations in your AI tool

## Support

For additional help, please raise an issue in the GitHub repository or contact the maintainers directly.
