#!/usr/bin/env python3
"""
Script sederhana untuk test sistem avatar lokal
Hanya mengecek struktur dan konfigurasi
"""

import os
import sys
from pathlib import Path

def test_directory_structure():
    """Test struktur direktori yang diperlukan"""
    print("=== TEST STRUKTUR DIREKTORI ===")
    
    base_dir = Path(__file__).parent
    required_dirs = [
        "app",
        "app/static",
        "app/static/uploads", 
        "app/static/uploads/avatars",
        "app/services"
    ]
    
    for dir_path in required_dirs:
        full_path = base_dir / dir_path
        if full_path.exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path} - Missing!")
            return False
    
    return True

def test_files_exist():
    """Test file yang diperlukan ada"""
    print("\n=== TEST FILE YANG DIPERLUKAN ===")
    
    base_dir = Path(__file__).parent
    required_files = [
        "app/__init__.py",
        "app/models.py",
        "app/services/file_upload.py",
        "app/api/profile_routes.py",
        "requirements.txt"
    ]
    
    for file_path in required_files:
        full_path = base_dir / file_path
        if full_path.exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - Missing!")
            return False
    
    return True

def test_model_fields():
    """Test field avatar di model User"""
    print("\n=== TEST MODEL FIELDS ===")
    
    try:
        # Add project directory to Python path
        sys.path.insert(0, str(Path(__file__).parent))
        
        from app.models import User, db
        
        # Check if avatar fields exist
        if hasattr(User, 'avatar_url'):
            print("✅ avatar_url field exists")
        else:
            print("❌ avatar_url field missing")
            return False
            
        if hasattr(User, 'avatar_filename'):
            print("✅ avatar_filename field exists")
        else:
            print("❌ avatar_filename field missing")
            return False
            
        if hasattr(User, 'avatar_type'):
            print("✅ avatar_type field exists")
        else:
            print("❌ avatar_type field missing")
            return False
            
        # Check methods
        if hasattr(User, 'get_avatar_url'):
            print("✅ get_avatar_url method exists")
        else:
            print("❌ get_avatar_url method missing")
            return False
            
        if hasattr(User, 'set_avatar_local'):
            print("✅ set_avatar_local method exists")
        else:
            print("❌ set_avatar_local method missing")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error importing model: {e}")
        return False

def test_file_upload_service():
    """Test FileUploadService"""
    print("\n=== TEST FILE UPLOAD SERVICE ===")
    
    try:
        # Add project directory to Python path
        sys.path.insert(0, str(Path(__file__).parent))
        
        from app.services.file_upload import FileUploadService
        
        # Mock app object
        class MockApp:
            def __init__(self):
                self.root_path = str(Path(__file__).parent / "app")
                self.config = {}
        
        mock_app = MockApp()
        service = FileUploadService(mock_app)
        
        print("✅ FileUploadService can be imported")
        print(f"✅ Upload folder: {service.UPLOAD_FOLDER}")
        print(f"✅ Allowed extensions: {service.ALLOWED_EXTENSIONS}")
        print(f"✅ Max file size: {service.MAX_FILE_SIZE} bytes")
        
        return True
        
    except Exception as e:
        print(f"❌ Error with FileUploadService: {e}")
        return False

def test_requirements():
    """Test requirements.txt contains Pillow"""
    print("\n=== TEST REQUIREMENTS ===")
    
    req_file = Path(__file__).parent / "requirements.txt"
    if req_file.exists():
        content = req_file.read_text()
        if "Pillow" in content:
            print("✅ Pillow is in requirements.txt")
        else:
            print("❌ Pillow missing from requirements.txt")
            return False
        print("✅ requirements.txt exists")
        return True
    else:
        print("❌ requirements.txt missing")
        return False

def main():
    """Main test function"""
    print("🧪 TESTING AVATAR SYSTEM SETUP")
    print("=" * 50)
    
    tests = [
        test_directory_structure,
        test_files_exist,
        test_requirements,
        test_model_fields,
        test_file_upload_service
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test failed with error: {e}")
            results.append(False)
    
    print("\n" + "=" * 50)
    print("📊 HASIL TEST:")
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Passed: {passed}/{total}")
    if passed == total:
        print("🎉 SEMUA TEST BERHASIL!")
        print("\n💡 NEXT STEPS:")
        print("1. Start Flask server: python run.py")
        print("2. Test dengan browser atau script test_avatar_local.py")
        print("3. Upload gambar dari frontend React")
    else:
        print("❌ Ada test yang gagal, perlu diperbaiki")
        failed = total - passed
        print(f"❌ Failed: {failed}/{total}")

if __name__ == '__main__':
    main()
