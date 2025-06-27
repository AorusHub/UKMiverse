import os
import uuid
from PIL import Image
from werkzeug.utils import secure_filename
from datetime import datetime

class FileUploadService:
    def __init__(self, app):
        self.app = app
        
        # Configuration
        self.UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads', 'avatars')
        self.ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        self.MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        self.AVATAR_SIZE = (300, 300)  # Fixed size for avatars
        
        # Create upload directory if it doesn't exist
        os.makedirs(self.UPLOAD_FOLDER, exist_ok=True)
        
        # Setup Flask config
        app.config['UPLOAD_FOLDER'] = self.UPLOAD_FOLDER
        app.config['MAX_CONTENT_LENGTH'] = self.MAX_FILE_SIZE
    
    def allowed_file(self, filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS
    
    def generate_filename(self, user_id, original_filename):
        """Generate unique filename for uploaded file"""
        # Get file extension
        ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
        
        # Generate unique filename with timestamp and user_id
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        filename = f"avatar_{user_id}_{timestamp}_{unique_id}.{ext}"
        
        return secure_filename(filename)
    
    def resize_image(self, image_path, size=None):
        """Resize and optimize image"""
        if size is None:
            size = self.AVATAR_SIZE
            
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary (for PNG with transparency)
                if img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    if 'transparency' in img.info:
                        background.paste(img, mask=img.split()[-1])
                    else:
                        background.paste(img)
                    img = background
                
                # Resize maintaining aspect ratio
                img.thumbnail(size, Image.Resampling.LANCZOS)
                
                # Create a square image with white background
                square_img = Image.new('RGB', size, (255, 255, 255))
                offset = ((size[0] - img.size[0]) // 2, (size[1] - img.size[1]) // 2)
                square_img.paste(img, offset)
                
                # Save as JPEG with optimization
                square_img.save(image_path, 'JPEG', quality=85, optimize=True)
                
            return True
        except Exception as e:
            print(f"Error resizing image: {e}")
            return False
    
    def save_uploaded_file(self, file, user_id):
        """Save uploaded file and return file info"""
        try:
            # Check if file is valid
            if not file or file.filename == '':
                return {'success': False, 'error': 'No file selected'}
            
            if not self.allowed_file(file.filename):
                return {'success': False, 'error': 'File type not allowed'}
            
            # Generate filename
            filename = self.generate_filename(user_id, file.filename)
            filepath = os.path.join(self.UPLOAD_FOLDER, filename)
            
            # Save file
            file.save(filepath)
            
            # Resize and optimize
            if not self.resize_image(filepath):
                os.remove(filepath)  # Remove if resize failed
                return {'success': False, 'error': 'Failed to process image'}
            
            # Return file info
            return {
                'success': True,
                'filename': filename,
                'filepath': filepath,
                'url': f'/static/uploads/avatars/{filename}',
                'size': os.path.getsize(filepath)
            }
            
        except Exception as e:
            return {'success': False, 'error': f'Upload failed: {str(e)}'}
    
    def delete_file(self, filename):
        """Delete uploaded file"""
        try:
            if filename:
                filepath = os.path.join(self.UPLOAD_FOLDER, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)
                    return True
            return False
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
    
    def get_file_info(self, filename):
        """Get file information"""
        try:
            filepath = os.path.join(self.UPLOAD_FOLDER, filename)
            if os.path.exists(filepath):
                return {
                    'exists': True,
                    'size': os.path.getsize(filepath),
                    'url': f'/static/uploads/avatars/{filename}'
                }
            return {'exists': False}
        except Exception as e:
            print(f"Error getting file info: {e}")
            return {'exists': False}
