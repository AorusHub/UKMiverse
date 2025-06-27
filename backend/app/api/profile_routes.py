from flask import request, send_from_directory, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..models import db, User
from ..decorators import get_current_user
from ..services.file_upload import FileUploadService
import os
import base64
import io
from PIL import Image

api = Namespace('profile', description='Operasi terkait profil user')

# Model untuk Profile
profile_model = api.model('Profile', {
    'id': fields.Integer(description='ID User'),
    'username': fields.String(description='Username'),
    'email': fields.String(description='Email'),
    'full_name': fields.String(description='Nama Lengkap'),
    'bio': fields.String(description='Bio/Deskripsi'),
    'phone': fields.String(description='Nomor Telepon'),
    'address': fields.String(description='Alamat'),
    'date_of_birth': fields.String(description='Tanggal Lahir'),
    'gender': fields.String(description='Jenis Kelamin'),
    'student_id': fields.String(description='NIM/Student ID'),
    'faculty': fields.String(description='Fakultas'),
    'major': fields.String(description='Jurusan'),
    'avatar_url': fields.String(description='URL Avatar'),
    'avatar_filename': fields.String(description='Avatar Filename (Local)'),
    'avatar_type': fields.String(description='Avatar Type (url/local/base64)'),
    'role': fields.Raw(description='Role User'),
    'created_at': fields.String(description='Tanggal Dibuat'),
    'updated_at': fields.String(description='Tanggal Diupdate')
})

# Model untuk update profile
profile_update_model = api.model('ProfileUpdate', {
    'full_name': fields.String(description='Nama Lengkap'),
    'bio': fields.String(description='Bio/Deskripsi'),
    'phone': fields.String(description='Nomor Telepon'),
    'address': fields.String(description='Alamat'),
    'date_of_birth': fields.String(description='Tanggal Lahir (YYYY-MM-DD)'),
    'gender': fields.String(description='Jenis Kelamin (male/female/other)'),
    'student_id': fields.String(description='NIM/Student ID'),
    'faculty': fields.String(description='Fakultas'),
    'major': fields.String(description='Jurusan'),
    'avatar_url': fields.String(description='URL Avatar')
})

# Model untuk update password
password_update_model = api.model('PasswordUpdate', {
    'current_password': fields.String(required=True, description='Password Saat Ini'),
    'new_password': fields.String(required=True, description='Password Baru'),
    'confirm_password': fields.String(required=True, description='Konfirmasi Password Baru')
})

# Model untuk response message
message_model = api.model('Message', {
    'message': fields.String(description='Pesan response')
})

@api.route('/')
class ProfileResource(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Mengambil profil user yang sedang login.")
    @api.marshal_with(profile_model)
    def get(self):
        """[TERPROTEKSI] Mengambil profil user yang sedang login."""
        try:
            current_user_id = get_jwt_identity()
            print(f"Profile GET request from user ID: {current_user_id}")
            
            current_user = get_current_user()
            if not current_user:
                print(f"User not found for ID: {current_user_id}")
                return {"message": "User tidak ditemukan"}, 404
            
            print(f"Found user: {current_user.username} (ID: {current_user.id})")
            
            profile_data = current_user.to_dict_with_profile()
            # Ensure avatar_url includes correct URL for local files
            if current_user.avatar_type == 'local' and current_user.avatar_filename:
                host = request.headers.get('Host', 'localhost:5000')
                profile_data['avatar_url'] = current_user.get_avatar_url(host)
            elif current_user.avatar_type in ['url', 'base64']:
                profile_data['avatar_url'] = current_user.get_avatar_url()
            else:
                profile_data['avatar_url'] = None
            
            print(f"Profile data prepared with keys: {list(profile_data.keys())}")
            print(f"Avatar URL returned: {profile_data.get('avatar_url', 'None')}")
            
            return profile_data, 200
            
        except Exception as e:
            print(f"Error in profile GET: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"message": "Internal server error"}, 500

    @jwt_required()
    @api.doc(security='jsonWebToken', description="Update profil user yang sedang login.")
    @api.expect(profile_update_model)
    @api.marshal_with(profile_model)
    def put(self):
        """[TERPROTEKSI] Update profil user yang sedang login."""
        current_user = get_current_user()
        if not current_user:
            return {"message": "User tidak ditemukan"}, 404
        
        data = request.get_json()
        print(f"Profile update request data keys: {list(data.keys()) if data else 'None'}")
        if 'avatar_url' in data:
            avatar_data = data['avatar_url']
            if avatar_data:
                print(f"Avatar URL received, type: {type(avatar_data)}, length: {len(str(avatar_data))}")
                if isinstance(avatar_data, str) and avatar_data.startswith('data:'):
                    print("Base64 image detected")
                else:
                    print(f"URL received: {avatar_data[:100]}...")
            else:
                print("Avatar URL is None/empty")
        
        try:
            # Update fields that are provided
            if 'full_name' in data:
                current_user.full_name = data['full_name']
            if 'bio' in data:
                current_user.bio = data['bio']
            if 'phone' in data:
                current_user.phone = data['phone']
            if 'address' in data:
                current_user.address = data['address']
            if 'date_of_birth' in data:
                current_user.date_of_birth = data['date_of_birth']
            if 'gender' in data:
                current_user.gender = data['gender']
            if 'student_id' in data:
                current_user.student_id = data['student_id']
            if 'faculty' in data:
                current_user.faculty = data['faculty']
            if 'major' in data:
                current_user.major = data['major']
            if 'avatar_url' in data:
                current_user.avatar_url = data['avatar_url']
                print(f"Avatar URL updated for user {current_user.id}: {current_user.avatar_url[:100] if current_user.avatar_url else 'None'}...")
            
            db.session.commit()
            print(f"Profile updated successfully for user {current_user.id}")
            result = current_user.to_dict_with_profile()
            print(f"Returning avatar_url: {result.get('avatar_url', 'Not found')[:100] if result.get('avatar_url') else 'None'}...")
            return result, 200
            
        except Exception as e:
            print(f"Error updating profile: {str(e)}")
            db.session.rollback()
            return {"message": "Gagal mengupdate profil"}, 500

@api.route('/password')
class PasswordUpdateResource(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Update password user yang sedang login.")
    @api.expect(password_update_model)
    @api.marshal_with(message_model)
    def put(self):
        """[TERPROTEKSI] Update password user yang sedang login."""
        current_user = get_current_user()
        if not current_user:
            return {"message": "User tidak ditemukan"}, 404
        
        data = request.get_json()
        
        # Validasi input
        if not all(k in data for k in ['current_password', 'new_password', 'confirm_password']):
            return {"message": "Data tidak lengkap"}, 400
        
        # Validasi password saat ini
        if not current_user.check_password(data['current_password']):
            return {"message": "Password saat ini salah"}, 400
        
        # Validasi konfirmasi password
        if data['new_password'] != data['confirm_password']:
            return {"message": "Konfirmasi password tidak cocok"}, 400
        
        # Validasi panjang password
        if len(data['new_password']) < 6:
            return {"message": "Password baru harus minimal 6 karakter"}, 400
        
        try:
            current_user.set_password(data['new_password'])
            db.session.commit()
            return {"message": "Password berhasil diupdate"}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"message": "Gagal mengupdate password"}, 500

@api.route('/avatar')
class AvatarUpdateResource(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Update avatar user yang sedang login.")
    @api.expect(api.model('AvatarUpdate', {
        'avatar_url': fields.String(required=True, description='URL Avatar Baru atau Base64 Data')
    }))
    @api.marshal_with(message_model)
    def put(self):
        """[TERPROTEKSI] Update avatar user yang sedang login dengan URL atau Base64."""
        current_user = get_current_user()
        if not current_user:
            return {"message": "User tidak ditemukan"}, 404
        
        data = request.get_json()
        
        if 'avatar_url' not in data:
            return {"message": "URL avatar diperlukan"}, 400
        
        avatar_data = data['avatar_url']
        
        try:
            # Handle base64 data dengan konversi ke file JPG
            if avatar_data and avatar_data.startswith('data:image/'):
                # Convert base64 to local file
                result = self._save_base64_as_file(avatar_data, current_user.id)
                if result['success']:
                    # Remove old avatar file if exists
                    if current_user.avatar_type == 'local' and current_user.avatar_filename:
                        upload_service = FileUploadService(current_app)
                        upload_service.delete_file(current_user.avatar_filename)
                    
                    # Update user with local file
                    current_user.set_avatar_local(result['filename'])
                    db.session.commit()
                    return {"message": "Avatar berhasil diupdate sebagai file lokal JPG"}, 200
                else:
                    return {"message": f"Gagal memproses base64: {result['error']}"}, 400
            else:
                # Handle URL avatar
                # Remove old avatar file if exists
                if current_user.avatar_type == 'local' and current_user.avatar_filename:
                    upload_service = FileUploadService(current_app)
                    upload_service.delete_file(current_user.avatar_filename)
                
                current_user.set_avatar_url(avatar_data)
                db.session.commit()
                return {"message": "Avatar berhasil diupdate dengan URL"}, 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error updating avatar: {str(e)}")
            return {"message": "Gagal mengupdate avatar"}, 500
    
    def _save_base64_as_file(self, base64_data, user_id):
        """Convert base64 data to JPG file"""
        try:
            # Parse base64 data
            header, image_data = base64_data.split(',', 1)
            image_bytes = base64.b64decode(image_data)
            
            # Create PIL Image
            from PIL import Image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary (for PNG with transparency)
            if image.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                if image.mode == 'P':
                    image = image.convert('RGBA')
                background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
                image = background
            
            # Resize to avatar size
            avatar_size = (300, 300)
            image.thumbnail(avatar_size, Image.Resampling.LANCZOS)
            
            # Create square image with white background
            square_img = Image.new('RGB', avatar_size, (255, 255, 255))
            offset = ((avatar_size[0] - image.size[0]) // 2, (avatar_size[1] - image.size[1]) // 2)
            square_img.paste(image, offset)
            
            # Generate filename
            from datetime import datetime
            import uuid
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            filename = f"avatar_{user_id}_{timestamp}_{unique_id}.jpg"
            
            # Save as JPG
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'avatars')
            os.makedirs(upload_folder, exist_ok=True)
            filepath = os.path.join(upload_folder, filename)
            
            square_img.save(filepath, 'JPEG', quality=85, optimize=True)
            
            return {
                'success': True,
                'filename': filename,
                'filepath': filepath
            }
            
        except Exception as e:
            print(f"Error saving base64 as file: {e}")
            return {'success': False, 'error': str(e)}

@api.route('/avatar/upload')
class AvatarFileUploadResource(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Upload file avatar sebagai JPG.")
    def post(self):
        """[TERPROTEKSI] Upload file avatar dan simpan sebagai JPG."""
        current_user = get_current_user()
        if not current_user:
            return {"message": "User tidak ditemukan"}, 404
        
        try:
            # Check if file is in request
            if 'avatar' not in request.files:
                return {"message": "Tidak ada file yang diupload"}, 400
            
            file = request.files['avatar']
            if file.filename == '':
                return {"message": "Tidak ada file yang dipilih"}, 400
            
            # Initialize upload service
            upload_service = FileUploadService(current_app)
            
            # Save uploaded file
            result = upload_service.save_uploaded_file(file, current_user.id)
            
            if result['success']:
                # Remove old avatar file if exists
                if current_user.avatar_type == 'local' and current_user.avatar_filename:
                    upload_service.delete_file(current_user.avatar_filename)
                
                # Update user with new local file
                current_user.set_avatar_local(result['filename'])
                db.session.commit()
                
                # Return full URL
                host = request.headers.get('Host', 'localhost:5000')
                avatar_url = current_user.get_avatar_url(host)
                
                return {
                    "message": "Avatar berhasil diupload sebagai JPG",
                    "filename": result['filename'],
                    "avatar_url": avatar_url
                }, 200
            else:
                return {"message": result['error']}, 400
                
        except Exception as e:
            db.session.rollback()
            print(f"Error uploading avatar file: {str(e)}")
            return {"message": "Gagal mengupload avatar"}, 500

@api.route('/avatar/remove')
class AvatarRemoveResource(Resource):
    @jwt_required()
    @api.doc(security='jsonWebToken', description="Hapus avatar user.")
    @api.marshal_with(message_model)
    def delete(self):
        """[TERPROTEKSI] Hapus avatar user yang sedang login."""
        current_user = get_current_user()
        if not current_user:
            return {"message": "User tidak ditemukan"}, 404
        
        try:
            # Remove file if it's local
            if current_user.avatar_type == 'local' and current_user.avatar_filename:
                upload_service = FileUploadService(current_app)
                upload_service.delete_file(current_user.avatar_filename)
            
            # Remove avatar from database
            current_user.remove_avatar()
            db.session.commit()
            
            return {"message": "Avatar berhasil dihapus"}, 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error removing avatar: {str(e)}")
            return {"message": "Gagal menghapus avatar"}, 500

# Endpoint untuk serving static files (untuk development)
@api.route('/static/uploads/avatars/<string:filename>')
class StaticAvatarResource(Resource):
    @api.doc(description="Serve file avatar statis.")
    def get(self, filename):
        """Serve file avatar statis."""
        try:
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'avatars')
            return send_from_directory(upload_folder, filename)
        except Exception as e:
            print(f"Error serving static file: {str(e)}")
            return {"message": "File tidak ditemukan"}, 404
