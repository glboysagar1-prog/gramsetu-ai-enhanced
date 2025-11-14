# Network Issue Troubleshooting Guide

This document provides a comprehensive approach to diagnosing and resolving the persistent network issues with authentication in the GramSetu AI application.

## 🔍 Diagnostic Steps

### 1. Browser Console Analysis

1. Open Developer Tools (F12 or right-click → Inspect)
2. Go to the Console tab
3. Attempt to log in
4. Look for specific error messages:
   - Network errors (ERR_CONNECTION_REFUSED, ERR_NETWORK_CHANGED, etc.)
   - CORS errors
   - JavaScript exceptions
   - 4xx/5xx HTTP errors

### 2. Network Tab Analysis

1. Open Developer Tools
2. Go to the Network tab
3. Attempt to log in
4. Look for failed requests:
   - Check status codes (404, 500, etc.)
   - Check request/response headers
   - Check request/response bodies
   - Note timing information

### 3. Environment Variable Verification

Check that the following environment variables are correctly set in `.env.local`:
```
REACT_APP_INSFORGE_URL=https://89gp4et3.us-east.insforge.app
REACT_APP_GOOGLE_CLIENT_ID=58577006087-lnlbas9p1u5388fj9oicehr11osl78ab.apps.googleusercontent.com
```

### 4. Connectivity Tests

#### Test 1: Basic Backend Connectivity
```bash
curl -I https://89gp4et3.us-east.insforge.app
```

#### Test 2: DNS Resolution
```bash
nslookup 89gp4et3.us-east.insforge.app
```

#### Test 3: Ping Test
```bash
ping 89gp4et3.us-east.insforge.app
```

## 🛠️ Potential Causes and Solutions

### 1. Corporate Firewall/Proxy Issues

**Symptoms:**
- Consistent network errors in office/organization networks
- Works on mobile data but not WiFi
- Other applications also have connectivity issues

**Solutions:**
- Try using a VPN
- Connect to a different network (mobile hotspot)
- Contact IT department about whitelisting the domain

### 2. CORS Configuration Issues

**Symptoms:**
- CORS errors in browser console
- Requests fail with no response body
- Works with direct API calls but not through browser

**Solutions:**
- Verify backend CORS configuration
- Check if requests include proper headers
- Ensure frontend and backend domains are properly configured

### 3. Ad Blocker/Privacy Extension Interference

**Symptoms:**
- Works in incognito/private browsing mode
- Works in different browsers
- Specific requests are blocked

**Solutions:**
- Disable ad blockers for the site
- Try in incognito/private browsing mode
- Disable browser extensions temporarily

### 4. Geographic/Regional Restrictions

**Symptoms:**
- Works from some locations but not others
- Consistent timeouts
- DNS resolution failures

**Solutions:**
- Try using a VPN
- Check if the service is available in your region
- Contact service provider about regional availability

### 5. DNS Resolution Problems

**Symptoms:**
- DNS-related errors
- Very slow initial connection
- Intermittent connectivity issues

**Solutions:**
- Change DNS servers (Google: 8.8.8.8, Cloudflare: 1.1.1.1)
- Flush DNS cache
- Check hosts file for incorrect entries

## 🧪 Advanced Debugging

### 1. Create a Minimal Test Case

Create a simple HTML file to test connectivity:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Network Test</title>
</head>
<body>
    <h1>Network Test</h1>
    <button onclick="testConnection()">Test Connection</button>
    <div id="result"></div>

    <script>
        async function testConnection() {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = 'Testing...';
            
            try {
                const response = await fetch('https://89gp4et3.us-east.insforge.app');
                resultDiv.innerHTML = `Success: ${response.status} ${response.statusText}`;
            } catch (error) {
                resultDiv.innerHTML = `Error: ${error.message}`;
                console.error('Connection test failed:', error);
            }
        }
    </script>
</body>
</html>
```

### 2. Test with Different HTTP Clients

Try using different tools to test connectivity:
```bash
# Using curl
curl -v https://89gp4et3.us-east.insforge.app

# Using wget
wget --spider https://89gp4et3.us-east.insforge.app

# Using Postman or similar API testing tool
```

### 3. Check System Network Configuration

On macOS:
```bash
# Check network interfaces
ifconfig

# Check routing table
netstat -rn

# Check DNS configuration
scutil --dns
```

## 📊 Monitoring and Logging

### 1. Enable Detailed Logging

Add the following to your browser console:
```javascript
// Enable verbose logging
localStorage.setItem('debug', '*');

// Monitor network requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch request:', args);
    return originalFetch.apply(this, args);
};
```

### 2. Check Application Logs

Look for any server-side logs that might indicate:
- Authentication failures
- Rate limiting
- Service outages
- Configuration issues

## 📞 Support Escalation

If the issue persists after trying all troubleshooting steps:

1. **Document the Issue**
   - Exact error messages
   - Steps to reproduce
   - Browser/OS information
   - Network environment details

2. **Gather Diagnostic Information**
   - Browser console output
   - Network tab capture
   - Environment variable settings
   - Connectivity test results

3. **Contact Support**
   - InsForge support: support@insforge.com
   - Provide all gathered information
   - Include timestamp of when the issue started

## 🔄 Recent Changes Summary

The following debugging enhancements have been added to help identify the issue:

1. **Enhanced Logging**
   - Added detailed console logging in AuthContext
   - Added debugging in GoogleCallback component
   - Added logging in Login component

2. **Diagnostic Components**
   - Created NetworkDiagnostics component
   - Created DebugEnv component

3. **Test Scripts**
   - Created debug-auth.js for authentication flow testing
   - Added connectivity tests

These tools should help identify the root cause of the network issues.