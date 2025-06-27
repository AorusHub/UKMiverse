from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import db, User, Role
from ..decorators import admin_required, get_current_user

api = Namespace('auth', description='Operasi autentikasi')

# Model untuk input login
login_model = api.model('LoginCredentials', {
    'username': fields.String(required=True, description='Username'),
    'password': fields.String(required=True, description='Password')
})

# Model untuk input register
register_model = api.model('RegisterCredentials', {
    'username': fields.String(required=True, description='Username'),
    'email': fields.String(required=True, description='Email'),
    'password': fields.String(required=True, description='Password'),
    'full_name': fields.String(required=False, description='Nama lengkap'),
    'bio': fields.String(required=False, description='Bio/Deskripsi'),
    'phone': fields.String(required=False, description='Nomor Telepon'),
    'address': fields.String(required=False, description='Alamat'),
    'date_of_birth': fields.String(required=False, description='Tanggal Lahir (YYYY-MM-DD)'),
    'gender': fields.String(required=False, description='Jenis Kelamin (male/female/other)'),
    'student_id': fields.String(required=False, description='NIM/Student ID'),
    'faculty': fields.String(required=False, description='Fakultas'),
    'major': fields.String(required=False, description='Jurusan'),
    'avatar_url': fields.String(required=False, description='URL Avatar')
})

# Model untuk response token
token_model = api.model('TokenResponse', {
    'access_token': fields.String(description='JWT Access Token'),
    'user': fields.Raw(description='User information')
})

# Model untuk response user
user_model = api.model('UserResponse', {
    'id': fields.Integer(description='User ID'),
    'username': fields.String(description='Username'),
    'email': fields.String(description='Email'),
    'full_name': fields.String(description='Full name'),
    'role': fields.Raw(description='User role')
})

@api.route('/login')
class Login(Resource):
    @api.doc(description="Login untuk mendapatkan JWT token.")
    @api.expect(login_model)
    @api.marshal_with(token_model, code=200)
    def post(self):
        """Endpoint untuk login."""
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return {"msg": "Username dan password wajib diisi"}, 400
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password) and user.is_active:
            access_token = create_access_token(identity=str(user.id))
            return {
                "access_token": access_token,
                "user": user.to_dict(include_permissions=True)
            }
        
        return {"msg": "Username atau password salah"}, 401

@api.route('/register')
class Register(Resource):
    @api.doc(description="Register untuk membuat akun baru.")
    @api.expect(register_model)
    @api.marshal_with(user_model, code=201)
    def post(self):
        """Endpoint untuk register user baru."""
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        full_name = data.get("full_name")
        
        if not username or not email or not password:
            return {"msg": "Username, email, dan password wajib diisi"}, 400
        
        # Cek apakah username sudah ada
        if User.query.filter_by(username=username).first():
            return {"msg": "Username sudah digunakan"}, 400
        
        # Cek apakah email sudah ada
        if User.query.filter_by(email=email).first():
            return {"msg": "Email sudah digunakan"}, 400
        
        # Ambil role 'user' sebagai default
        user_role = Role.query.filter_by(name='user').first()
        
        # Buat user baru
        new_user = User(
            username=username,
            email=email,
            full_name=full_name,
            bio=data.get('bio'),
            phone=data.get('phone'),
            address=data.get('address'),
            date_of_birth=data.get('date_of_birth'),
            gender=data.get('gender'),
            student_id=data.get('student_id'),
            faculty=data.get('faculty'),
            major=data.get('major'),
            avatar_url=data.get('avatar_url'),
            role_id=user_role.id
        )
        new_user.set_password(password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict_with_profile(), 201
        except Exception as e:
            db.session.rollback()
            return {"msg": "Gagal membuat akun"}, 500

@api.route('/profile')
class Profile(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Mendapatkan profile user yang sedang login.")
    @api.marshal_with(user_model, code=200)
    def get(self):
        """Mendapatkan profile user."""
        user = get_current_user()
        if not user:
            return {"msg": "User tidak ditemukan"}, 404
        
        return user.to_dict(include_permissions=True)

    @jwt_required()
    @api.doc(security='jsonWebToken', description="Update profile user.")
    @api.expect(api.model('ProfileUpdate', {
        'full_name': fields.String(description='Nama lengkap'),
        'email': fields.String(description='Email baru')
    }))
    @api.marshal_with(user_model, code=200)
    def put(self):
        """Update profile user."""
        user = get_current_user()
        if not user:
            return {"msg": "User tidak ditemukan"}, 404
        
        data = request.get_json()
        
        # Check if email already used by another user
        if 'email' in data and data['email'] != user.email:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return {"msg": "Email sudah digunakan"}, 400
        
        try:
            user.full_name = data.get('full_name', user.full_name)
            user.email = data.get('email', user.email)
            
            db.session.commit()
            return user.to_dict(include_permissions=True)
        except Exception as e:
            db.session.rollback()
            return {"msg": "Gagal update profile"}, 500

@api.route('/users')
class UserList(Resource):
    @admin_required
    @api.doc(security='jsonWebToken', description="Mendapatkan semua user atau buat user baru (Admin only).")
    @api.marshal_list_with(user_model)
    def get(self):
        """[ADMIN] Mendapatkan semua user."""
        users = User.query.all()
        return [user.to_dict() for user in users]
    
    @api.expect(api.model('AdminCreateUser', {
        'username': fields.String(required=True, description='Username'),
        'email': fields.String(required=True, description='Email'),
        'password': fields.String(required=True, description='Password'),
        'full_name': fields.String(required=False, description='Nama lengkap'),
        'role_name': fields.String(required=False, description='Role name (admin/user)', default='user')
    }))
    def post(self):
        """[ADMIN] Buat user baru."""
        data = request.get_json()
        
        # Validasi input
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return {"msg": "Username, email, dan password wajib diisi"}, 400
        
        # Check if username or email already exists
        if User.query.filter_by(username=data['username']).first():
            return {"msg": "Username sudah digunakan"}, 400
        
        if User.query.filter_by(email=data['email']).first():
            return {"msg": "Email sudah digunakan"}, 400
        
        try:
            # Create new user
            user = User(
                username=data['username'],
                email=data['email'],
                full_name=data.get('full_name', ''),
                bio=data.get('bio', ''),
                phone=data.get('phone', ''),
                address=data.get('address', ''),
                faculty=data.get('faculty', ''),
                major=data.get('major', '')
            )
            user.set_password(data['password'])
            
            # Assign role
            role_name = data.get('role_name', 'user')
            if not user.assign_role(role_name):
                return {"msg": f"Role '{role_name}' tidak ditemukan"}, 400
            
            db.session.add(user)
            db.session.commit()
            
            return {"msg": "User berhasil dibuat", "user": user.to_dict()}, 201
            
        except Exception as e:
            db.session.rollback()
            return {"msg": f"Gagal membuat user: {str(e)}"}, 500

@api.route('/users/<int:user_id>')
class UserDetail(Resource):
    @admin_required
    @api.doc(security='jsonWebToken', description="Mendapatkan, edit, atau hapus user (Admin only).")
    @api.marshal_with(user_model)
    def get(self, user_id):
        """[ADMIN] Mendapatkan detail user."""
        user = User.query.get(user_id)
        if not user:
            return {"msg": "User tidak ditemukan"}, 404
        return user.to_dict()
    
    @api.expect(api.model('UserUpdate', {
        'username': fields.String(required=False, description='Username baru'),
        'email': fields.String(required=False, description='Email baru'),
        'full_name': fields.String(required=False, description='Nama lengkap'),
        'bio': fields.String(required=False, description='Bio'),
        'phone': fields.String(required=False, description='Nomor telepon'),
        'address': fields.String(required=False, description='Alamat'),
        'faculty': fields.String(required=False, description='Fakultas'),
        'major': fields.String(required=False, description='Jurusan'),
        'password': fields.String(required=False, description='Password baru'),
        'role_name': fields.String(required=False, description='Role baru (admin/user)')
    }))
    def put(self, user_id):
        """[ADMIN] Edit user."""
        user = User.query.get(user_id)
        if not user:
            return {"msg": "User tidak ditemukan"}, 404
        
        data = request.get_json()
        
        try:
            # Update fields yang diberikan
            if 'username' in data:
                # Check if username already exists
                existing_user = User.query.filter_by(username=data['username']).first()
                if existing_user and existing_user.id != user_id:
                    return {"msg": "Username sudah digunakan"}, 400
                user.username = data['username']
            
            if 'email' in data:
                # Check if email already exists
                existing_user = User.query.filter_by(email=data['email']).first()
                if existing_user and existing_user.id != user_id:
                    return {"msg": "Email sudah digunakan"}, 400
                user.email = data['email']
            
            if 'full_name' in data:
                user.full_name = data['full_name']
            if 'bio' in data:
                user.bio = data['bio']
            if 'phone' in data:
                user.phone = data['phone']
            if 'address' in data:
                user.address = data['address']
            if 'faculty' in data:
                user.faculty = data['faculty']
            if 'major' in data:
                user.major = data['major']
            
            # Update password if provided
            if 'password' in data and data['password']:
                user.set_password(data['password'])
            
            # Update role if provided
            if 'role_name' in data and data['role_name']:
                if not user.assign_role(data['role_name']):
                    return {"msg": f"Role '{data['role_name']}' tidak ditemukan"}, 400
            
            db.session.commit()
            return {"msg": "User berhasil diupdate", "user": user.to_dict()}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"msg": f"Gagal update user: {str(e)}"}, 500
    
    def delete(self, user_id):
        """[ADMIN] Hapus user."""
        # Jangan bisa hapus admin utama (user ID 1)
        if user_id == 1:
            return {"msg": "Tidak dapat menghapus admin utama"}, 403
        
        user = User.query.get(user_id)
        if not user:
            return {"msg": "User tidak ditemukan"}, 404
        
        try:
            db.session.delete(user)
            db.session.commit()
            return {"msg": f"User {user.username} berhasil dihapus"}, 200
        except Exception as e:
            db.session.rollback()
            return {"msg": f"Gagal menghapus user: {str(e)}"}, 500

@api.route('/users/<int:user_id>/role')
class UserRole(Resource):
    @admin_required
    @api.doc(security='jsonWebToken', description="Mengubah role user (Admin only).")
    @api.expect(api.model('RoleUpdate', {
        'role_name': fields.String(required=True, description='Nama role baru')
    }))
    def put(self, user_id):
        """[ADMIN] Mengubah role user."""
        user = User.query.get(user_id)
        if not user:
            return {"msg": "User tidak ditemukan"}, 404
        
        data = request.get_json()
        role_name = data.get('role_name')
        
        if user.assign_role(role_name):
            try:
                db.session.commit()
                return {"msg": f"Role user berhasil diubah menjadi {role_name}"}, 200
            except Exception as e:
                db.session.rollback()
                return {"msg": "Gagal mengubah role"}, 500
        else:
            return {"msg": "Role tidak ditemukan"}, 400

@api.route('/roles')
class RoleList(Resource):
    @admin_required
    @api.doc(security='jsonWebToken', description="Mendapatkan semua role (Admin only).")
    def get(self):
        """[ADMIN] Mendapatkan semua role."""
        roles = Role.query.all()
        return [role.to_dict() for role in roles]

@api.route('/debug')
class AuthDebug(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Debug endpoint untuk memeriksa status authentication.")
    def get(self):
        """[TERPROTEKSI] Debug authentication status."""
        try:
            current_user_id = get_jwt_identity()
            print(f"Debug: JWT Identity = {current_user_id}")
            
            user = get_current_user()
            print(f"Debug: Current user = {user}")
            
            if user:
                return {
                    "status": "authenticated",
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role.name if user.role else None
                }, 200
            else:
                return {
                    "status": "user_not_found",
                    "user_id": current_user_id
                }, 404
        except Exception as e:
            print(f"Debug error: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }, 500