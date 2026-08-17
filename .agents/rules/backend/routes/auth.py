import os
import time
import base64
from functools import wraps
from flask import Blueprint, request, jsonify, g
from ..db import register_user, login_user, get_user_by_token, update_user_profile
from ..middleware.security import get_sanitized_json

auth_bp = Blueprint('auth', __name__)
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'bistro2026')

def authenticate_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'error': 'Authentication token required'}), 401
        
        user = get_user_by_token(auth_header)
        if not user:
            return jsonify({'success': False, 'error': 'Invalid or expired session token'}), 401
        
        g.user = user
        return f(*args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        body = get_sanitized_json()
        name = body.get('name')
        email = body.get('email')
        password = body.get('password')
        phone = body.get('phone', '')
        address = body.get('address', '')

        if not name or not email or not password:
            return jsonify({'success': False, 'error': 'Name, email, and password are required.'}), 400
        if len(password) < 6:
            return jsonify({'success': False, 'error': 'Password must be at least 6 characters long.'}), 400

        result = register_user(name=name, email=email, password=password, phone=phone, address=address)
        if not result.get('success'):
            return jsonify(result), 400

        return jsonify({
            'success': True,
            'message': 'Account created successfully! Welcome to Bistro & Stack.',
            'user': result['user'],
            'token': result['token']
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        body = get_sanitized_json()
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password are required.'}), 400

        result = login_user(email=email, password=password)
        if not result.get('success'):
            return jsonify(result), 401

        return jsonify({
            'success': True,
            'message': 'Logged in successfully.',
            'user': result['user'],
            'token': result['token']
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
def me():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'success': False, 'error': 'Not authenticated'}), 401

    user = get_user_by_token(auth_header)
    if not user:
        return jsonify({'success': False, 'error': 'Session expired'}), 401

    return jsonify({'success': True, 'user': user}), 200

@auth_bp.route('/profile', methods=['PUT'])
@authenticate_token
def profile():
    try:
        body = get_sanitized_json()
        name = body.get('name')
        phone = body.get('phone')
        address = body.get('address')

        updated = update_user_profile(g.user['userId'], name=name, phone=phone, address=address)
        if not updated:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': updated
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/admin-login', methods=['POST'])
def admin_login():
    body = get_sanitized_json()
    password = body.get('password')
    if not password:
        return jsonify({'success': False, 'error': 'Admin passcode is required.'}), 400

    if password.strip() == ADMIN_PASSWORD:
        token_str = f"admin_{int(time.time() * 1000)}"
        admin_token = 'adm_' + base64.b64encode(token_str.encode()).decode()
        return jsonify({
            'success': True,
            'message': 'Admin authorization granted.',
            'adminToken': admin_token,
            'role': 'admin'
        }), 200
    else:
        return jsonify({
            'success': False,
            'error': 'Invalid admin passcode. Access denied.'
        }), 403
