// Debug component to check environment variables
import React, { useEffect, useState } from 'react';

const DebugEnv = () => {
  const [envInfo, setEnvInfo] = useState({});

  useEffect(() => {
    // Check environment variables
    const envData = {
      REACT_APP_INSFORGE_URL: process.env.REACT_APP_INSFORGE_URL,
      REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      NODE_ENV: process.env.NODE_ENV,
      PUBLIC_URL: process.env.PUBLIC_URL,
    };
    
    setEnvInfo(envData);
    
    // Log to console
    console.log('Environment Variables:', envData);
    
    // Test fetch to backend
    fetch(process.env.REACT_APP_INSFORGE_URL || 'https://89gp4et3.us-east.insforge.app')
      .then(response => {
        console.log('Backend connectivity test - Status:', response.status);
      })
      .catch(error => {
        console.error('Backend connectivity test failed:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
      <h2>Environment Debug Info</h2>
      <pre>{JSON.stringify(envInfo, null, 2)}</pre>
    </div>
  );
};

export default DebugEnv;