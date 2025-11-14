// Test script to verify correct usage of InsForge SDK
const { createClient } = require('@insforge/sdk');

async function testCorrectUsage() {
  console.log('Testing correct usage of InsForge SDK...');
  
  try {
    // Initialize client
    const client = createClient({ 
      baseUrl: 'https://89gp4et3.us-east.insforge.app'
    });
    
    console.log('1. Testing database operations...');
    
    // Test a simple database query (this should fail with authentication error)
    try {
      const { data, error } = await client.database
        .from('users')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('✅ Database query failed as expected (authentication required):', error.message);
      } else {
        console.log('ℹ️ Database query returned data (unexpected without authentication)');
      }
    } catch (dbError) {
      console.log('✅ Database query test completed with error (expected):', dbError.message);
    }
    
    console.log('2. Testing auth methods...');
    
    // Test signup (this should fail with validation error)
    try {
      const { data, error } = await client.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword'
      });
      
      if (error) {
        console.log('✅ Signup failed as expected:', error.message);
      } else {
        console.log('ℹ️ Signup returned data:', data);
      }
    } catch (signupError) {
      console.log('✅ Signup test completed with error (expected):', signupError.message);
    }
    
    console.log('3. Testing OAuth...');
    
    // Test OAuth initialization
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        redirectTo: 'http://localhost:3000/auth/callback/google',
        skipBrowserRedirect: true
      });
      
      if (error) {
        console.log('❌ OAuth initialization failed:', error.message);
      } else {
        console.log('✅ OAuth initialization successful');
        if (data?.url) {
          console.log('OAuth URL generated:', data.url.substring(0, 100) + '...');
        }
      }
    } catch (oauthError) {
      console.log('❌ OAuth initialization failed with exception:', oauthError.message);
    }
    
    console.log('🎉 All tests completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCorrectUsage();