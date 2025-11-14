#!/usr/bin/env node

/**
 * Environment Setup Script for GramSetu AI
 * This script helps verify and set up the required environment variables
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'PINECONE_API_KEY',
  'PINECONE_ENVIRONMENT',
  'PINECONE_INDEX'
];

// Optional environment variables (with defaults)
const optionalEnvVars = {
  'PORT': '5000',
  'NODE_ENV': 'development',
  'REACT_APP_INSFORGE_URL': 'https://89gp4et3.us-east.insforge.app'
};

console.log('🔍 GramSetu AI Environment Setup');
console.log('==============================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with the required configuration.');
  process.exit(1);
}

console.log('✅ .env file found');

// Check required environment variables
let allRequiredVarsPresent = true;
console.log('\n🔐 Checking required environment variables...\n');

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: Set`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
    allRequiredVarsPresent = false;
  }
});

if (!allRequiredVarsPresent) {
  console.log('\n❌ Some required environment variables are missing.');
  console.log('Please ensure all required variables are set in your .env file.');
  process.exit(1);
}

// Set optional environment variables with defaults
console.log('\n⚙️  Setting optional environment variables...\n');

Object.entries(optionalEnvVars).forEach(([envVar, defaultValue]) => {
  if (!process.env[envVar]) {
    process.env[envVar] = defaultValue;
    console.log(`✅ ${envVar}: Set to default value "${defaultValue}"`);
  } else {
    console.log(`✅ ${envVar}: Already set`);
  }
});

console.log('\n🧪 Testing service connections...\n');

// Test database connection
async function testDatabaseConnection() {
  try {
    // For PostgreSQL
    if (process.env.DATABASE_URL.includes('postgresql')) {
      console.log('✅ Database URL format: Valid (PostgreSQL)');
      // Note: Actual connection test would require pg package
    } else {
      console.log('⚠️  Database URL format: Not PostgreSQL (may still work)');
    }
  } catch (error) {
    console.log(`❌ Database connection test failed: ${error.message}`);
  }
}

// Test OpenAI API key format
function testOpenAIKey() {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (key && key.startsWith('sk-')) {
      console.log('✅ OpenAI API key format: Valid');
    } else {
      console.log('❌ OpenAI API key format: Invalid');
    }
  } catch (error) {
    console.log(`❌ OpenAI key test failed: ${error.message}`);
  }
}

// Test Pinecone configuration
function testPineconeConfig() {
  try {
    const hasApiKey = !!process.env.PINECONE_API_KEY;
    const hasEnvironment = !!process.env.PINECONE_ENVIRONMENT;
    const hasIndex = !!process.env.PINECONE_INDEX;
    
    console.log(`✅ Pinecone API key: ${hasApiKey ? 'Set' : 'Missing'}`);
    console.log(`✅ Pinecone environment: ${hasEnvironment ? 'Set' : 'Missing'}`);
    console.log(`✅ Pinecone index: ${hasIndex ? 'Set' : 'Missing'}`);
    
    if (!hasApiKey || !hasEnvironment || !hasIndex) {
      console.log('❌ Pinecone configuration: Incomplete');
    } else {
      console.log('✅ Pinecone configuration: Complete');
    }
  } catch (error) {
    console.log(`❌ Pinecone config test failed: ${error.message}`);
  }
}

// Run tests
testDatabaseConnection();
testOpenAIKey();
testPineconeConfig();

console.log('\n🎉 Environment setup verification complete!');
console.log('\n📝 Next steps:');
console.log('1. Start the authentication backend: cd replit-backend && npm run dev');
console.log('2. Start the complaint backend: cd services && python app.py');
console.log('3. Start the frontend: npm start');