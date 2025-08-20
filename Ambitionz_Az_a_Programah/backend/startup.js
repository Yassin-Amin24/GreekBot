#!/usr/bin/env node

// Startup script for Azure deployment
console.log('Starting GreekBot application...');

// Check environment variables
const requiredEnvVars = ['OPENAI_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('Warning: Missing environment variables:', missingVars.join(', '));
  console.warn('Application will run with limited functionality');
}

// Check optional environment variables
const optionalEnvVars = ['COSMOS_ENDPOINT', 'COSMOS_KEY', 'COSMOS_DATABASE', 'COSMOS_CONTAINER'];
const missingOptionalVars = optionalEnvVars.filter(varName => !process.env[varName]);

if (missingOptionalVars.length > 0) {
  console.log('Info: Missing optional environment variables:', missingOptionalVars.join(', '));
  console.log('Database functionality will be disabled');
}

// Set default port if not provided
if (!process.env.PORT) {
  process.env.PORT = 8080;
  console.log('Using default port:', process.env.PORT);
}

// Start the application
try {
  require('./server.js');
  console.log('GreekBot application started successfully');
} catch (error) {
  console.error('Failed to start GreekBot application:', error);
  process.exit(1);
}
