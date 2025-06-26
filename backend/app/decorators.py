from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from .models import User

def role_required(*allowed_roles):
    """
    Decorator untuk memverifikasi role user.
    
    Usage:
    @role_required('admin')
    @role_required('admin', 'user')
    """
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            
            if not current_user_id:
                return jsonify({"msg": "Token tidak valid"}), 401
            
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({"msg": "User tidak ditemukan"}), 404
            
            if not user.is_active:
                return jsonify({"msg": "User tidak aktif"}), 403
            
            if not user.role:
                return jsonify({"msg": "User tidak memiliki role"}), 403
            
            if user.role.name not in allowed_roles:
                return jsonify({
                    "msg": f"Access denied. Required roles: {', '.join(allowed_roles)}"
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    """Decorator khusus untuk admin only"""
    @wraps(f)
    @role_required('admin')
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

def permission_required(permission):
    """
    Decorator untuk memverifikasi permission user.
    
    Usage:
    @permission_required('manage_ukm')
    """
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            
            if not current_user_id:
                return jsonify({"msg": "Token tidak valid"}), 401
            
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({"msg": "User tidak ditemukan"}), 404
            
            if not user.is_active:
                return jsonify({"msg": "User tidak aktif"}), 403
            
            user_permissions = user.get_permissions()
            
            if permission not in user_permissions:
                return jsonify({
                    "msg": f"Access denied. Required permission: {permission}"
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def get_current_user():
    """Utility function untuk mendapatkan current user"""
    try:
        current_user_id = get_jwt_identity()
        if current_user_id:
            return User.query.get(current_user_id)
        return None
    except:
        return None

def check_user_permission(permission):
    """Utility function untuk check permission current user"""
    user = get_current_user()
    if user:
        return permission in user.get_permissions()
    return False
