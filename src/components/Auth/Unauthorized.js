import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-particles"></div>
      </div>

      <div className="auth-content">
        {/* Logo & Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🛡️</span>
            <h1>GramSetu AI</h1>
          </div>
          <p className="auth-tagline">National Governance Intelligence Network</p>
        </div>

        {/* Unauthorized Content */}
        <div className="login-form-container">
          <div className="login-form">
            <h3>Access Denied</h3>
            <div className="error-alert" style={{ margin: '20px 0' }}>
              <span className="alert-icon">🚫</span>
              <p>You don't have permission to access this page.</p>
            </div>
            <p className="form-description">
              The page you're trying to access requires permissions that your account doesn't have.
              If you believe this is an error, please contact your administrator.
            </p>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => navigate('/dashboard/citizen')}
              >
                Go to Dashboard
              </button>
              <button 
                type="button" 
                className="btn-demo" 
                onClick={() => navigate('/login')}
              >
                Switch Account
              </button>
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

export default Unauthorized;