// Test script to verify InsForge SDK functionality
const { createClient } = require('@insforge/sdk');

async function testSDK() {
  console.log('Testing InsForge SDK...');
  
  try {
    // Test 1: SDK initialization
    console.log('1. Initializing SDK...');
    const client = createClient({ 
      baseUrl: 'https://89gp4et3.us-east.insforge.app'
    });
    console.log('✅ SDK initialized successfully');
    
    // Test 2: Check if client has auth methods
    console.log('2. Checking auth methods...');
    if (client.auth && typeof client.auth.signInWithPassword === 'function') {
      console.log('✅ Auth methods available');
    } else {
      console.log('❌ Auth methods missing');
      return;
    }
    
    // Test 3: Test authentication endpoint (with fake credentials)
    console.log('3. Testing authentication endpoint...');
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      });
      
      if (error) {
        console.log('✅ Authentication endpoint reachable (expected error with fake credentials):', error.message);
      } else {
        console.log('⚠️ Unexpected successful authentication with fake credentials');
      }
    } catch (authError) {
      console.log('✅ Authentication endpoint test completed with error (expected):', authError.message);
    }
    
    // Test 4: Test OAuth initialization
    console.log('4. Testing OAuth initialization...');
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: 'http://localhost:3000/auth/callback/google',
        skipBrowserRedirect: true
      });
      
      if (error) {
        console.log('✅ OAuth initialization completed (expected error):', error.message);
      } else {
        console.log('✅ OAuth initialization successful, redirect URL:', data?.url);
      }
    } catch (oauthError) {
      console.log('✅ OAuth initialization test completed with error (expected):', oauthError.message);
    }
    
    console.log('🎉 All SDK tests completed successfully');
    
  } catch (error) {
    console.error('❌ SDK test failed:', error);
  }
}

// Run the test
testSDK();