#!/usr/bin/env node

/**
 * Service Communication Test Script
 * This script verifies that all services can communicate with each other
 */

const axios = require('axios');
const https = require('https');

// Disable SSL verification for testing (not for production)
const agent = new https.Agent({  
  rejectUnauthorized: false
});

async function testService(url, name) {
  try {
    const response = await axios.get(url, { httpsAgent: agent, timeout: 5000 });
    console.log(`✅ ${name}: OK (Status ${response.status})`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    return false;
  }
}

async function testServices() {
  console.log('🔍 Testing GramSetu AI Service Communication');
  console.log('===========================================');
  
  const services = [
    { url: 'http://localhost:3000', name: 'Frontend' },
    { url: 'http://localhost:5000/healthz', name: 'Auth Backend' },
    { url: 'http://localhost:5001/healthz', name: 'Complaint Backend' }
  ];
  
  let allPassed = true;
  
  for (const service of services) {
    const result = await testService(service.url, service.name);
    if (!result) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(43));
  if (allPassed) {
    console.log('🎉 All services are communicating properly!');
  } else {
    console.log('⚠️  Some services are not responding correctly.');
    console.log('   Please check the service logs in the /logs directory.');
  }
}

// Run the test
testServices().catch(error => {
  console.error('Test execution error:', error);
});