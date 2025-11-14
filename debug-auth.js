// Debug script to test authentication flow
import { createClient } from '@insforge/sdk';

// Initialize client with debugging
const client = createClient({ 
  baseUrl: process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app'
});

console.log('Initializing authentication test...');

// Test basic connectivity
fetch('https://89gp4et3.us-east.insforge.app')
  .then(response => {
    console.log('Basic connectivity test - Status:', response.status);
    console.log('Status text:', response.statusText);
    return response.text();
  })
  .then(data => {
    console.log('Response length:', data.length);
  })
  .catch(error => {
    console.error('Basic connectivity test failed:', error);
  });

// Test SDK initialization
console.log('SDK Base URL:', client.auth.client.baseUrl);

// Test authentication with fake credentials to see the error response
client.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'testpassword'
})
.then(result => {
  console.log('Authentication test result:', result);
})
.catch(error => {
  console.error('Authentication test error:', error);
});

// Test OAuth flow initialization
client.auth.signInWithOAuth({
  provider: 'google',
  redirectTo: 'http://localhost:3000/auth/callback/google',
  skipBrowserRedirect: true
})
.then(result => {
  console.log('OAuth initialization result:', result);
})
.catch(error => {
  console.error('OAuth initialization error:', error);
});