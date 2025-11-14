# Authentication Troubleshooting Guide

This document provides troubleshooting steps for resolving network errors with both regular login and Google OAuth in the GramSetu AI application.

## 📋 Common Issues and Solutions

### 1. Network Connectivity Issues

#### Symptoms:
- "Network error. Please try again later" message
- Login button shows error immediately
- Google OAuth fails with network error

#### Solutions:
1. **Check Internet Connection**
   - Ensure you have a stable internet connection
   - Try accessing other websites to verify connectivity

2. **Check Backend Accessibility**
   ```bash
   curl -I https://89gp4et3.us-east.insforge.app
   ```
   You should receive a 200 OK response.

3. **Check Firewall/Proxy Settings**
   - Corporate networks may block certain connections
   - Try using a different network (mobile hotspot)

4. **Clear Browser Cache**
   - Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies

### 2. Environment Configuration Issues

#### Symptoms:
- Authentication fails consistently
- No error messages in browser console

#### Solutions:
1. **Verify Environment Variables**
   Check that `.env.local` contains:
   ```
   REACT_APP_INSFORGE_URL=https://89gp4et3.us-east.insforge.app
   REACT_APP_GOOGLE_CLIENT_ID=58577006087-lnlbas9p1u5388fj9oicehr11osl78ab.apps.googleusercontent.com
   ```

2. **Restart Development Server**
   ```bash
   npm start
   ```

3. **Check for Typos**
   - Verify the InsForge URL is correct
   - Verify the Google Client ID is correct

### 3. Google OAuth Configuration Issues

#### Symptoms:
- Google login redirects but fails to authenticate
- "Google authentication failed" error message

#### Solutions:
1. **Verify Google Client ID**
   - Ensure the Google Client ID is correctly configured in the Google Cloud Console
   - Check that the redirect URI is set to: `https://gramsetu-89lg3uz12-sagars-projects-ca23f511.vercel.app/auth/callback/google`

2. **Check Google OAuth Consent Screen**
   - Ensure the OAuth consent screen is properly configured
   - Verify that the application is properly verified

3. **Test with Different Google Account**
   - Try logging in with a different Google account
   - Ensure the account has the necessary permissions

### 4. Browser-Specific Issues

#### Symptoms:
- Authentication works in one browser but not another
- Specific error messages in browser console

#### Solutions:
1. **Try Different Browser**
   - Test with Chrome, Firefox, Safari, or Edge

2. **Disable Browser Extensions**
   - Ad blockers or privacy extensions may interfere with authentication

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Check the Console tab for error messages
   - Look for CORS errors or network failures

## 🔧 Advanced Troubleshooting

### 1. Enable Detailed Logging

Add the following to your browser console to enable detailed logging:
```javascript
localStorage.setItem('debug', 'insforge:*');
```

### 2. Test InsForge SDK Directly

You can test the InsForge SDK directly in the browser console:
```javascript
// Create client
const client = createClient({ 
  baseUrl: 'https://89gp4et3.us-east.insforge.app'
});

// Test authentication
client.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'testpassword'
}).then(console.log).catch(console.error);
```

### 3. Check Network Requests

In the browser Developer Tools:
1. Go to the Network tab
2. Attempt to log in
3. Look for failed requests to the InsForge backend
4. Check request/response headers and bodies

## 🛠️ Code-Level Fixes

### 1. Update Error Handling

The application has been updated with improved error handling:
- More detailed error messages
- Better network error detection
- Improved Google OAuth callback handling

### 2. Verify SDK Version

Check that you're using the correct version of the InsForge SDK:
```bash
npm list @insforge/sdk
```

If needed, update to the latest version:
```bash
npm install @insforge/sdk@latest
```

## 📞 Support Resources

### 1. InsForge Documentation
- https://docs.insforge.com
- SDK documentation and examples

### 2. Community Support
- GitHub issues
- Discord community
- Stack Overflow

### 3. Direct Contact
- support@insforge.com
- Contact form on the InsForge website

## 🔄 Recent Changes

The following changes have been made to improve authentication reliability:

1. **Enhanced Error Handling**
   - Added detailed logging for authentication failures
   - Improved error messages for network issues
   - Better handling of Google OAuth errors

2. **Updated Components**
   - AuthContext.js: Improved error handling and logging
   - Login.js: Better error display and handling
   - GoogleCallback.js: Enhanced error detection and handling

3. **Configuration Updates**
   - Verified environment variables
   - Confirmed Google Client ID configuration

These changes should resolve most common authentication issues. If problems persist, please check the browser console for specific error messages and contact support with those details.