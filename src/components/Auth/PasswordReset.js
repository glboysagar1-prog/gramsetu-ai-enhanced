import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Auth.css';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(searchParams.get('step') || 'request'); // request, verify, reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/password-reset/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'OTP sent successfully! Please check your email.');
        setStep('verify');
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/password-reset/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'OTP verified successfully!');
        setStep('reset');
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password-reset/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
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

        {/* Password Reset Form */}
        <div className="login-form-container">
          {step === 'request' && (
            <form className="login-form" onSubmit={handleSendOTP}>
              <h3>Reset Your Password</h3>
              <p className="form-description">Enter your email address and we'll send you a code to reset your password.</p>
              
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
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <span className="btn-icon">→</span>
                    </>
                  )}
                </button>
              </div>

              <div className="form-footer">
                <a href="/login">Back to Login</a>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form className="login-form" onSubmit={handleVerifyOTP}>
              <h3>Verify OTP</h3>
              <p className="form-description">We've sent a 6-digit code to {email}. Please enter it below.</p>
              
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
                <label htmlFor="otp">
                  <span className="label-icon">🔢</span>
                  Verification Code
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
                      <span className="btn-icon">→</span>
                    </>
                  )}
                </button>
              </div>

              <div className="form-footer">
                <a href="#" onClick={(e) => { e.preventDefault(); setStep('request'); }}>Resend Code</a>
                <span>•</span>
                <a href="/login">Back to Login</a>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form className="login-form" onSubmit={handleResetPassword}>
              <h3>Set New Password</h3>
              <p className="form-description">Create a new password for your account.</p>
              
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
                <label htmlFor="newPassword">
                  <span className="label-icon">🔒</span>
                  New Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <span className="btn-icon">→</span>
                    </>
                  )}
                </button>
              </div>

              <div className="form-footer">
                <a href="/login">Back to Login</a>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>Powered by AI • Secured with Blockchain • Built for Bharat 🇮🇳</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;