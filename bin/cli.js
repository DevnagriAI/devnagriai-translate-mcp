#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Process command line arguments
const args = process.argv.slice(2);
let apiKey = null;

// Check for API key in arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('API_KEY=')) {
    apiKey = arg.split('=')[1].replace(/"/g, '');
    break;
  }
}

// If no API key in args, check for environment variable
if (!apiKey) {
  apiKey = process.env.DEVNAGRI_API_KEY;
}

// If still no API key, check for .env file in current directory
if (!apiKey) {
  try {
    dotenv.config();
    apiKey = process.env.DEVNAGRI_API_KEY;
  } catch (err) {
    // Ignore error if .env file doesn't exist
  }
}

// If no API key is available, inform the user
if (!apiKey) {
  console.log('⚠️ Warning: No Devnagri API key found!');
  console.log('Please provide an API key in one of the following ways:');
  console.log('1. As a command line argument: npx devnagri-mcp-translation API_KEY="your_api_key"');
  console.log('2. As an environment variable: DEVNAGRI_API_KEY=your_api_key npx devnagri-mcp-translation');
  console.log('3. In a .env file in your current directory');
  process.exit(1);
}

// Create a temporary .env file or update the existing one
const envFilePath = join(dirname(__dirname), '.env');
fs.writeFileSync(envFilePath, `DEVNAGRI_API_KEY=${apiKey}\n`);

// Path to the main server file
const serverPath = join(dirname(__dirname), 'src', 'index.js');

console.log('🚀 Starting Devnagri MCP - Translation Service');
console.log('✅ API key configured successfully');

// Run the server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, DEVNAGRI_API_KEY: apiKey }
});

// Handle server exit
server.on('close', (code) => {
  // Clean up the temporary .env file
  try {
    fs.unlinkSync(envFilePath);
  } catch (err) {
    // Ignore deletion errors
  }
  
  if (code !== 0) {
    console.log(`⚠️ Server process exited with code ${code}`);
  }
  process.exit(code);
});

// Handle terminal signals
process.on('SIGINT', () => {
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});
