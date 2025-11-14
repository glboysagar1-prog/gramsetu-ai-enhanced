// Network diagnostics component to help identify connection issues
import React, { useState, useEffect } from 'react';

const NetworkDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    connectivity: 'testing...',
    backend: 'testing...',
    dns: 'testing...',
    latency: 'testing...'
  });
  
  const [isTesting, setIsTesting] = useState(false);

  const runDiagnostics = async () => {
    setIsTesting(true);
    const newDiagnostics = { ...diagnostics };
    
    try {
      // Test basic internet connectivity
      const connectivityStart = Date.now();
      const connectivityResponse = await fetch('https://httpbin.org/get');
      const connectivityTime = Date.now() - connectivityStart;
      
      newDiagnostics.connectivity = connectivityResponse.ok 
        ? `OK (${connectivityTime}ms)` 
        : `Failed (${connectivityResponse.status})`;
      
      // Test backend connectivity
      const backendStart = Date.now();
      const backendUrl = process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app';
      const backendResponse = await fetch(backendUrl);
      const backendTime = Date.now() - backendStart;
      
      newDiagnostics.backend = backendResponse.ok 
        ? `OK (${backendTime}ms)` 
        : `Failed (${backendResponse.status})`;
      
      // Test DNS resolution (by fetching a known domain)
      const dnsStart = Date.now();
      const dnsResponse = await fetch('https://google.com');
      const dnsTime = Date.now() - dnsStart;
      
      newDiagnostics.dns = dnsResponse.ok 
        ? `OK (${dnsTime}ms)` 
        : `DNS Resolution Failed`;
        
      // Calculate approximate latency
      newDiagnostics.latency = `${Math.min(connectivityTime, backendTime, dnsTime)}ms`;
      
    } catch (error) {
      console.error('Diagnostics error:', error);
      newDiagnostics.connectivity = `Error: ${error.message}`;
      newDiagnostics.backend = 'Unable to test';
      newDiagnostics.dns = 'Unable to test';
      newDiagnostics.latency = 'Unknown';
    }
    
    setDiagnostics(newDiagnostics);
    setIsTesting(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px', margin: '20px 0' }}>
      <h3>Network Diagnostics</h3>
      <button 
        onClick={runDiagnostics} 
        disabled={isTesting}
        style={{ marginBottom: '10px', padding: '5px 10px' }}
      >
        {isTesting ? 'Testing...' : 'Run Diagnostics'}
      </button>
      
      <div>
        <p><strong>Internet Connectivity:</strong> {diagnostics.connectivity}</p>
        <p><strong>Backend Connectivity:</strong> {diagnostics.backend}</p>
        <p><strong>DNS Resolution:</strong> {diagnostics.dns}</p>
        <p><strong>Approximate Latency:</strong> {diagnostics.latency}</p>
      </div>
    </div>
  );
};

export default NetworkDiagnostics;