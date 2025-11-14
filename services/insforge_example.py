"""
Example of how to use Insforge authentication in Flask routes
This file demonstrates how to integrate Insforge authentication with your existing Flask routes.
"""

from flask import Blueprint, request, jsonify, g
from services.insforge_auth_service import (
    insforge_auth_service,
    require_auth,
    require_citizen,
    require_field_worker,
    require_district_officer,
    require_state_officer,
    require_national_admin
)

# Create a blueprint for Insforge-integrated routes
insforge_bp = Blueprint('insforge', __name__)

@insforge_bp.route('/api/insforge/profile', methods=['GET'])
@require_auth
def get_user_profile():
    """Get current user profile - requires authentication"""
    return jsonify({
        'user': g.current_user
    })

@insforge_bp.route('/api/insforge/citizen-data', methods=['GET'])
@require_citizen
def get_citizen_data():
    """Get citizen-specific data - requires citizen role or higher"""
    return jsonify({
        'message': 'Citizen data',
        'user': g.current_user
    })

@insforge_bp.route('/api/insforge/field-worker-data', methods=['GET'])
@require_field_worker
def get_field_worker_data():
    """Get field worker data - requires field worker role or higher"""
    return jsonify({
        'message': 'Field worker data',
        'user': g.current_user
    })

@insforge_bp.route('/api/insforge/district-data', methods=['GET'])
@require_district_officer
def get_district_data():
    """Get district officer data - requires district officer role or higher"""
    return jsonify({
        'message': 'District officer data',
        'user': g.current_user
    })

@insforge_bp.route('/api/insforge/state-data', methods=['GET'])
@require_state_officer
def get_state_data():
    """Get state officer data - requires state officer role or higher"""
    return jsonify({
        'message': 'State officer data',
        'user': g.current_user
    })

@insforge_bp.route('/api/insforge/admin-data', methods=['GET'])
@require_national_admin
def get_admin_data():
    """Get admin data - requires national admin role"""
    return jsonify({
        'message': 'Admin data',
        'user': g.current_user
    })

# Example of how to modify existing routes to use Insforge authentication
# You would replace your existing authentication logic with these patterns

@insforge_bp.route('/api/insforge/login', methods=['POST'])
def insforge_login():
    """Login using Insforge authentication"""
    data = request.get_json()
    
    try:
        result = insforge_auth_service.login(
            email=data.get('email'),
            password=data.get('password')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@insforge_bp.route('/api/insforge/signup', methods=['POST'])
def insforge_signup():
    """Signup using Insforge authentication"""
    data = request.get_json()
    
    try:
        result = insforge_auth_service.signup(
            email=data.get('email'),
            password=data.get('password'),
            username=data.get('username'),
            role=data.get('role')  # Optional role
        )
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@insforge_bp.route('/api/insforge/google-login', methods=['POST'])
def insforge_google_login():
    """Google OAuth login using Insforge authentication"""
    data = request.get_json()
    
    try:
        result = insforge_auth_service.google_login(
            access_token=data.get('accessToken')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@insforge_bp.route('/api/insforge/password-reset/send-otp', methods=['POST'])
def send_password_reset_otp():
    """Send password reset OTP"""
    data = request.get_json()
    
    try:
        result = insforge_auth_service.send_password_reset_otp(
            email=data.get('email')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@insforge_bp.route('/api/insforge/password-reset/verify-otp', methods=['POST'])
def verify_password_reset_otp():
    """Verify password reset OTP"""
    data = request.get_json()
    
    try:
        result = insforge_auth_service.verify_password_reset_otp(
            email=data.get('email'),
            otp=data.get('otp')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@insforge_bp.route('/api/insforge/password-reset/reset', methods=['POST'])
def reset_password():
    """Reset password"""
    data = request.get_json()
    
    try:
        result = insforge_auth_service.reset_password(
            email=data.get('email'),
            otp=data.get('otp'),
            new_password=data.get('newPassword')
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# To integrate this with your main app.py, you would add:
# from services.insforge_example import insforge_bp
# app.register_blueprint(insforge_bp, url_prefix='/insforge')