import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState('citizen');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { id: 'citizen', name: 'Citizen', icon: '👤', description: 'File and track complaints' },
    { id: 'field', name: 'Field Officer', icon: '👮', description: 'Resolve assigned complaints' },
    { id: 'district', name: 'District Officer', icon: '🏛️', description: 'Monitor district operations' },
    { id: 'state', name: 'State Officer', icon: '⚖️', description: 'State-level oversight' },
    { id: 'national', name: 'National Admin', icon: '🇮🇳', description: 'National governance oversight' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Call InsForge signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: activeRole
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setSuccessMessage('Account created successfully! Redirecting to dashboard...');
        
        // Automatically login the user
        setTimeout(() => {
          navigate(`/dashboard/${activeRole}`);
        }, 2000);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Signup Form */}
        <div className="login-form-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Create Account as {roles.find(r => r.id === activeRole).name}</h3>
            
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
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="label-icon">🔒</span>
                Confirm Password
              </label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>
            </div>

            <div className="form-footer">
              <span>Already have an account?</span>
              <a href="/login">Login</a>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>Powered by AI • Secured with Blockchain • Built for Bharat 🇮🇳</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;