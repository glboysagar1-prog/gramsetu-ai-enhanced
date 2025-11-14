import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentUser } = useAuth();

  useEffect(() => {
    console.log('GoogleCallback component mounted with location:', location);
    
    const handleGoogleCallback = async () => {
      try {
        // Check if there's an error in the URL parameters
        const params = new URLSearchParams(location.search);
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        console.log('URL parameters checked:', { error, errorDescription });
        
        if (error) {
          console.error('OAuth error in URL parameters:', error, errorDescription);
          navigate('/login', { 
            state: { 
              error: `Google authentication failed: ${errorDescription || error}` 
            } 
          });
          return;
        }
        
        // After OAuth redirect, InsForge automatically handles the callback
        // We just need to get the current user
        console.log('Attempting to get current user after OAuth');
        const result = await getCurrentUser();
        console.log('Current user result:', result);
        
        if (result.success) {
          // Redirect to appropriate dashboard based on user role
          const userRole = result.data.user.role;
          let dashboardPath = '/dashboard';
          
          console.log('User authenticated with role:', userRole);
          
          switch (userRole) {
            case 'citizen':
              dashboardPath = '/dashboard/citizen';
              break;
            case 'field-worker':
              dashboardPath = '/dashboard/field';
              break;
            case 'district-officer':
              dashboardPath = '/dashboard/district';
              break;
            case 'state-officer':
              dashboardPath = '/dashboard/state';
              break;
            case 'national-admin':
              dashboardPath = '/dashboard/national';
              break;
            default:
              dashboardPath = '/dashboard';
          }
          
          console.log('Redirecting to dashboard:', dashboardPath);
          navigate(dashboardPath);
        } else {
          // Handle login error
          console.error('Failed to get current user:', result.error);
          navigate('/login', { 
            state: { 
              error: result.error || 'Google login failed. Please try again.' 
            } 
          });
        }
      } catch (error) {
        // Handle network error
        console.error('Network error during Google callback:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        let errorMessage = 'Network error. Please check your connection and try again.';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Network connection failed. Please check your internet connection.';
        }
        
        navigate('/login', { 
          state: { 
            error: errorMessage
          } 
        });
      }
    };

    handleGoogleCallback();
  }, [location, navigate, getCurrentUser]);

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-gradient"></div>
        <div className="auth-particles"></div>
      </div>

      <div className="auth-content">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🛡️</span>
            <h1>GramSetu AI</h1>
          </div>
          <p className="auth-tagline">National Governance Intelligence Network</p>
        </div>

        <div className="login-form-container">
          <div className="login-form">
            <h3>Authenticating with Google</h3>
            <div className="form-actions" style={{ justifyContent: 'center' }}>
              <span className="spinner"></span>
              <span>Please wait while we authenticate you...</span>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <p>Powered by AI • Secured with Blockchain • Built for Bharat 🇮🇳</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;