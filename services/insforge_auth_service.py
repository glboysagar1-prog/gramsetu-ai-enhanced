"""
Insforge Authentication Service for Flask Backend
This module provides integration with Insforge's authentication services.
"""

import requests
import os
from functools import wraps
from flask import request, jsonify, g
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InsforgeAuthService:
    def __init__(self):
        self.project_id = os.getenv('INSFORGE_PROJECT_ID', 'your-project-id')
        self.api_key = os.getenv('INSFORGE_API_KEY', 'your-api-key')
        self.jwt_secret = os.getenv('INSFORGE_JWT_SECRET', 'your-jwt-secret')
        self.api_base_url = os.getenv('INSFORGE_API_BASE_URL', 'https://api.insforge.dev')
        
        # Roles configuration
        self.roles = {
            'citizen': 'citizen',
            'field_worker': 'field-worker',
            'district_officer': 'district-officer',
            'state_officer': 'state-officer',
            'national_admin': 'national-admin'
        }
        
        # Setup session with default headers
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'X-Project-ID': self.project_id,
            'X-API-Key': self.api_key
        })

    def _make_request(self, method, endpoint, data=None):
        """Make HTTP request to Insforge API"""
        url = f"{self.api_base_url}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Insforge API request failed: {e}")
            raise Exception(f"API request failed: {str(e)}")

    def signup(self, email, password, username, role=None):
        """Sign up a new user"""
        data = {
            'email': email,
            'password': password,
            'username': username,
            'role': role or self.roles['citizen']
        }
        return self._make_request('POST', '/auth/signup', data)

    def login(self, email, password):
        """Login with email and password"""
        data = {
            'email': email,
            'password': password
        }
        return self._make_request('POST', '/auth/login', data)

    def google_login(self, access_token):
        """Google OAuth login"""
        data = {
            'accessToken': access_token
        }
        return self._make_request('POST', '/auth/google', data)

    def send_password_reset_otp(self, email):
        """Send password reset OTP"""
        data = {
            'email': email
        }
        return self._make_request('POST', '/auth/password-reset/send-otp', data)

    def verify_password_reset_otp(self, email, otp):
        """Verify password reset OTP"""
        data = {
            'email': email,
            'otp': otp
        }
        return self._make_request('POST', '/auth/password-reset/verify-otp', data)

    def reset_password(self, email, otp, new_password):
        """Reset password"""
        data = {
            'email': email,
            'otp': otp,
            'newPassword': new_password
        }
        return self._make_request('POST', '/auth/password-reset/reset', data)

    def verify_token(self, token):
        """Verify JWT token"""
        try:
            # First verify with Insforge
            data = {'token': token}
            return self._make_request('POST', '/auth/verify-token', data)
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            raise Exception("Invalid or expired token")

    def get_user_by_id(self, user_id):
        """Get user by ID"""
        return self._make_request('GET', f'/users/{user_id}')

    def get_user_by_email(self, email):
        """Get user by email"""
        return self._make_request('GET', f'/users/email/{email}')

    def has_role(self, token, required_role):
        """Check if user has required role"""
        try:
            user_data = self.verify_token(token)
            return user_data['user']['role'] == required_role or user_data['user']['role'] == self.roles['national_admin']
        except:
            return False

    def has_any_role(self, token, required_roles):
        """Check if user has any of the required roles"""
        try:
            user_data = self.verify_token(token)
            return user_data['user']['role'] in required_roles or user_data['user']['role'] == self.roles['national_admin']
        except:
            return False

# Initialize the service
insforge_auth_service = InsforgeAuthService()

# Decorator for authentication
def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authentication required'}), 401

        token = auth_header[7:]  # Remove 'Bearer ' prefix
        
        try:
            user_data = insforge_auth_service.verify_token(token)
            # Attach user data to Flask's g object
            g.current_user = user_data['user']
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token'}), 401
            
        return f(*args, **kwargs)
    
    return decorated_function

# Decorator for role-based access control
def require_role(roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'Authentication required'}), 401

            token = auth_header[7:]  # Remove 'Bearer ' prefix
            
            try:
                has_access = insforge_auth_service.has_any_role(token, roles)
                if not has_access:
                    return jsonify({'error': 'Insufficient permissions'}), 403
                
                # Attach user data to Flask's g object
                user_data = insforge_auth_service.verify_token(token)
                g.current_user = user_data['user']
            except Exception as e:
                return jsonify({'error': 'Invalid or expired token'}), 401
                
            return f(*args, **kwargs)
        
        return decorated_function
    return decorator

# Specific role decorators
def require_citizen(f):
    return require_role([insforge_auth_service.roles['citizen']])(f)

def require_field_worker(f):
    return require_role([
        insforge_auth_service.roles['field_worker'],
        insforge_auth_service.roles['district_officer'],
        insforge_auth_service.roles['state_officer'],
        insforge_auth_service.roles['national_admin']
    ])(f)

def require_district_officer(f):
    return require_role([
        insforge_auth_service.roles['district_officer'],
        insforge_auth_service.roles['state_officer'],
        insforge_auth_service.roles['national_admin']
    ])(f)

def require_state_officer(f):
    return require_role([
        insforge_auth_service.roles['state_officer'],
        insforge_auth_service.roles['national_admin']
    ])(f)

def require_national_admin(f):
    return require_role([insforge_auth_service.roles['national_admin']])(f)