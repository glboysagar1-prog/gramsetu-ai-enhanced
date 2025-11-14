#!/usr/bin/env node

/**
 * Preview Script for GramSetu AI
 * This script checks if services are running and provides preview URLs
 */

const http = require('http');
const https = require('https');

// Function to check if a service is running
function checkService(port, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      resolve({ name, port, status: 'running', statusCode: res.statusCode });
    });

    req.on('error', (e) => {
      resolve({ name, port, status: 'not running', error: e.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ name, port, status: 'not running', error: 'timeout' });
    });

    req.end();
  });
}

// Function to display preview information
async function showPreview() {
  console.log('🔍 GramSetu AI Preview');
  console.log('=====================');
  console.log('');

  // Check services
  const services = [
    { name: 'Frontend', port: 5002 },
    { name: 'Auth Backend', port: 5000 },
    { name: 'Complaint Backend', port: 5001 }
  ];

  console.log('Checking services...');
  console.log('');

  const results = await Promise.all(
    services.map(service => checkService(service.port, service.name))
  );

  let allRunning = true;

  results.forEach(result => {
    if (result.status === 'running') {
      console.log(`✅ ${result.name}: Running on http://localhost:${result.port}`);
    } else {
      console.log(`❌ ${result.name}: Not running (${result.error || 'Not accessible'})`);
      allRunning = false;
    }
  });

  console.log('');
  console.log('=====================');

  if (allRunning) {
    console.log('🎉 All services are running!');
    console.log('');
    console.log('🔗 Preview URLs:');
    console.log('   Frontend: http://localhost:5002');
    console.log('   Auth API: http://localhost:5000/api');
    console.log('   Complaint API: http://localhost:5001/api');
    console.log('');
    console.log('📱 Open http://localhost:5002 in your browser to view the application');
  } else {
    console.log('⚠️  Some services are not running');
    console.log('');
    console.log('To start all services, run:');
    console.log('   ./start-all.sh');
    console.log('');
    console.log('Or start services individually:');
    console.log('   Frontend: npm start');
    console.log('   Auth Backend: cd replit-backend && npm run dev');
    console.log('   Complaint Backend: cd services && python app.py');
  }
}

// Run the preview check
showPreview().catch(error => {
  console.error('Preview check failed:', error);
});