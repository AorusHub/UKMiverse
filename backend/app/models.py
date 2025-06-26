from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Tabel Roles
class Role(db.Model):
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    users = db.relationship('User', backref='role', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_count': len(self.users)
        }
    
    def get_users(self):
        """Dapatkan semua user dengan role ini"""
        return self.users
    
    def get_active_users(self):
        """Dapatkan user aktif dengan role ini"""
        return [user for user in self.users if user.is_active]
    
    def is_admin_role(self):
        """Check apakah ini adalah admin role"""
        return self.name == 'admin'
    
    def is_user_role(self):
        """Check apakah ini adalah user role"""
        return self.name == 'user'
    
    @staticmethod
    def get_admin_role():
        """Get admin role"""
        return Role.query.filter_by(name='admin').first()
    
    @staticmethod
    def get_user_role():
        """Get user role"""
        return Role.query.filter_by(name='user').first()
    
    @staticmethod
    def create_default_roles():
        """Create default roles if they don't exist"""
        default_roles = [
            {'name': 'admin', 'description': 'Administrator with full access'},
            {'name': 'user', 'description': 'Regular user with limited access'}
        ]
        
        for role_data in default_roles:
            existing_role = Role.query.filter_by(name=role_data['name']).first()
            if not existing_role:
                new_role = Role(
                    name=role_data['name'],
                    description=role_data['description']
                )
                db.session.add(new_role)
        
        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            return False
    
    def __repr__(self):
        return f'<Role {self.name}>'

# Tabel Categories
class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(50), nullable=True)  # For emoji or icon class
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    ukms = db.relationship('UKM', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Tabel Users
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False, default=2)  # Default to 'user' role
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        """Set password dengan hashing"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifikasi password"""
        return check_password_hash(self.password_hash, password)
    
    def has_role(self, role_name):
        """Check apakah user memiliki role tertentu"""
        return self.role and self.role.name == role_name
    
    def is_admin(self):
        """Check apakah user adalah admin"""
        return self.has_role('admin')
    
    def is_regular_user(self):
        """Check apakah user adalah regular user"""
        return self.has_role('user')
    
    def can_manage_ukm(self):
        """Check apakah user bisa mengelola UKM (CREATE, UPDATE, DELETE)"""
        return self.is_admin()
    
    def can_view_ukm(self):
        """Check apakah user bisa melihat UKM (READ)"""
        # Semua user (termasuk yang tidak login) bisa melihat UKM
        return True
    
    def can_manage_users(self):
        """Check apakah user bisa mengelola user lain"""
        return self.is_admin()
    
    def can_manage_categories(self):
        """Check apakah user bisa mengelola kategori"""
        return self.is_admin()
    
    def assign_role(self, role_name):
        """Assign role baru ke user"""
        role = Role.query.filter_by(name=role_name).first()
        if role:
            self.role_id = role.id
            self.updated_at = datetime.utcnow()
            return True
        return False
    
    def get_permissions(self):
        """Dapatkan daftar permission user berdasarkan role"""
        permissions = []
        
        if self.is_admin():
            permissions = [
                'manage_ukm',
                'manage_users', 
                'manage_categories',
                'view_ukm',
                'view_admin_panel'
            ]
        elif self.is_regular_user():
            permissions = [
                'view_ukm',
                'register_to_ukm'  # Future feature
            ]
        
        return permissions
    
    def to_dict(self, include_permissions=False):
        """Convert user object to dictionary"""
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role.to_dict() if self.role else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_permissions:
            user_dict['permissions'] = self.get_permissions()
        
        return user_dict
    
    @staticmethod
    def create_user(username, email, password, full_name=None, role_name='user'):
        """Factory method untuk membuat user baru"""
        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            return None, "Username sudah digunakan"
        
        if User.query.filter_by(email=email).first():
            return None, "Email sudah digunakan"
        
        # Get role
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            return None, "Role tidak ditemukan"
        
        # Create new user
        new_user = User(
            username=username,
            email=email,
            full_name=full_name,
            role_id=role.id
        )
        new_user.set_password(password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return new_user, "User berhasil dibuat"
        except Exception as e:
            db.session.rollback()
            return None, "Gagal membuat user"
    
    def __repr__(self):
        return f'<User {self.username} - {self.role.name if self.role else "No Role"}>'

# Tabel UKM
class UKM(db.Model):
    __tablename__ = 'ukms'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    logo_url = db.Column(db.String(255), nullable=True)
    contact_person = db.Column(db.String(100), nullable=True)
    contact_email = db.Column(db.String(120), nullable=True)
    contact_phone = db.Column(db.String(20), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'deskripsi': self.deskripsi,
            'category': self.category.to_dict() if self.category else None,
            'logo_url': self.logo_url,
            'contact_person': self.contact_person,
            'contact_email': self.contact_email,
            'contact_phone': self.contact_phone,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }