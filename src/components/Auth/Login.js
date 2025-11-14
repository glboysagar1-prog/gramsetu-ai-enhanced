import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NetworkDiagnostics from '../NetworkDiagnostics';
import DebugEnv from '../DebugEnv';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [activeRole, setActiveRole] = useState('citizen');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedField, setCopiedField] = useState(null);

  const roles = [
    { id: 'citizen', name: 'Citizen', icon: '👤', description: 'File and track complaints' },
    { id: 'field', name: 'Field Officer', icon: '👮', description: 'Resolve assigned complaints' },
    { id: 'district', name: 'District Officer', icon: '🏛️', description: 'Monitor district operations' },
    { id: 'state', name: 'State Officer', icon: '⚖️', description: 'State-level oversight' },
    { id: 'national', name: 'National Admin', icon: '🇮🇳', description: 'National governance oversight' }
  ];

  // Demo credentials for each role
  const demoCredentials = {
    citizen: { username: 'citizen@gramsetu.in', password: 'citizen123' },
    field: { username: 'field@gramsetu.in', password: 'field123' },
    district: { username: 'district@gramsetu.in', password: 'district123' },
    state: { username: 'state@gramsetu.in', password: 'state123' },
    national: { username: 'admin@gramsetu.in', password: 'admin123' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    console.log('Login form submitted with credentials:', credentials);

    try {
      // Pass credentials with the correct structure
      const loginCredentials = {
        email: credentials.username, // Map username to email
        password: credentials.password,
        role: activeRole
      };
      
      const result = await login(loginCredentials);
      console.log('Login result:', result);
      
      if (result.success) {
        setSuccessMessage('Login successful! Redirecting...');
        
        setTimeout(() => {
          navigate(`/dashboard/${activeRole}`);
        }, 1500);
      } else {
        setError(result.error || 'Invalid credentials. Please check and try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    console.log('Google login button clicked');

    try {
      // Use InsForge Google OAuth
      console.log('Calling googleLogin function from useAuth');
      const result = await googleLogin();
      console.log('Google login function returned:', result);
      
      if (result && !result.success) {
        console.log('Google login failed with error:', result.error);
        setError(result.error || 'Google login failed. Please try again.');
        setLoading(false);
      } else if (!result) {
        console.log('Google login function returned undefined');
        setError('Google login failed. Please try again.');
        setLoading(false);
      } else {
        console.log('Google login initiated successfully');
        // If successful, the function should have redirected, so we don't need to do anything here
      }
    } catch (err) {
      console.error('Google login error caught in Login component:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      let errorMessage = 'Google login failed. Please check your connection and try again.';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCopyCredential = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDemoLogin = () => {
    const demo = demoCredentials[activeRole];
    setCredentials({
      username: demo.username,
      password: demo.password
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-particles"></div>
      </div>

      <div className="auth-content">
        {/* Debug Components */}
        <DebugEnv />
        <NetworkDiagnostics />
        
        {/* Logo & Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🛡️</span>
            <h1>GramSetu AI</h1>
          </div>
          <p className="auth-tagline">National Governance Intelligence Network</p>
        </div>

        {/* Role Selection */}
        <div className="role-selector">
          <h2>Select Your Role</h2>
          <div className="role-cards">
            {roles.map(role => (
              <button
                key={role.id}
                className={`role-card ${activeRole === role.id ? 'active' : ''}`}
                onClick={() => setActiveRole(role.id)}
              >
                <span className="role-icon">{role.icon}</span>
                <h3>{role.name}</h3>
                <p>{role.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Login as {roles.find(r => r.id === activeRole).name}</h3>
            
            {successMessage && (
              <div className="success-alert">
                <span className="alert-icon">✓</span>
                <p>{successMessage}</p>
              </div>
            )}
            
            {error && (
              <div className="error-alert">
                <span className="alert-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">📧</span>
                Email or Username
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  required
                />
                {focusedField === 'username' && (
                  <span className="input-hint">Use your registered email address</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                {focusedField === 'password' && (
                  <span className="input-hint">Your secure password</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>

              <button type="button" className="btn-demo" onClick={handleDemoLogin}>
                Use Demo Credentials
              </button>
            </div>

            {/* Google OAuth Button */}
            <div className="oauth-section">
              <div className="divider">
                <span>or</span>
              </div>
              <button 
                type="button" 
                className="btn-google" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <span className="google-icon">G</span>
                Continue with Google
              </button>
            </div>

            <div className="form-footer">
              <a href="/reset-password">Forgot password?</a>
              <span>•</span>
              <a href="/signup">Create account</a>
            </div>
          </form>

          {/* Demo Credentials Display */}
          <div className="demo-info">
            <h4>💡 Demo Credentials</h4>
            <div className="demo-credentials">
              <div className="credential-item">
                <p><strong>Email:</strong> {demoCredentials[activeRole].username}</p>
                <button 
                  type="button"
                  className="copy-btn"
                  onClick={() => handleCopyCredential('email', demoCredentials[activeRole].username)}
                  title="Copy email"
                >
                  {copiedField === 'email' ? '✓' : '📋'}
                </button>
              </div>
              <div className="credential-item">
                <p><strong>Password:</strong> {demoCredentials[activeRole].password}</p>
                <button 
                  type="button"
                  className="copy-btn"
                  onClick={() => handleCopyCredential('password', demoCredentials[activeRole].password)}
                  title="Copy password"
                >
                  {copiedField === 'password' ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>Powered by AI • Secured with Blockchain • Built for Bharat 🇮🇳</p>
        </div>
      </div>
    </div>
  );
};

export default Login;