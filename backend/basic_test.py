#!/usr/bin/env python3
"""
Test sederhana untuk memastikan imports bekerja
"""

def test_imports():
    """Test import modules yang diperlukan"""
    try:
        # Test Flask imports
        from flask import Flask, send_from_directory, request
        print("✅ Flask imports berhasil")
        
        # Test PIL import
        from PIL import Image
        print("✅ PIL (Pillow) import berhasil")
        
        # Test werkzeug
        from werkzeug.utils import secure_filename
        print("✅ Werkzeug import berhasil")
        
        # Test os dan base64
        import os
        import base64
        import io
        print("✅ Standard library imports berhasil")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def test_create_test_image():
    """Test membuat image sederhana dengan PIL"""
    try:
        from PIL import Image, ImageDraw
        import io
        import base64
        
        # Buat image test
        img = Image.new('RGB', (100, 100), color='blue')
        draw = ImageDraw.Draw(img)
        draw.rectangle([20, 20, 80, 80], fill='white')
        
        # Convert ke base64
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG", quality=85)
        img_bytes = buffered.getvalue()
        base64_data = base64.b64encode(img_bytes).decode()
        
        print(f"✅ Test image berhasil dibuat (size: {len(base64_data)} chars)")
        
        # Test save ke file
        img.save('test_image.jpg', 'JPEG', quality=85)
        print("✅ Test image berhasil disave ke file")
        
        # Cleanup
        import os
        if os.path.exists('test_image.jpg'):
            os.remove('test_image.jpg')
            print("✅ Test image file berhasil dihapus")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating test image: {e}")
        return False

def test_folder_structure():
    """Test struktur folder"""
    import os
    
    # Test current directory
    print(f"📂 Current directory: {os.getcwd()}")
    
    # Check app folder
    if os.path.exists('app'):
        print("✅ app folder exists")
        
        # Check static folder
        static_path = os.path.join('app', 'static', 'uploads', 'avatars')
        if os.path.exists(static_path):
            print(f"✅ {static_path} exists")
        else:
            print(f"❌ {static_path} does not exist")
            
        # Check services folder
        services_path = os.path.join('app', 'services')
        if os.path.exists(services_path):
            print(f"✅ {services_path} exists")
        else:
            print(f"❌ {services_path} does not exist")
    else:
        print("❌ app folder does not exist")

if __name__ == '__main__':
    print("🧪 RUNNING BASIC TESTS")
    print("=" * 30)
    
    print("1. Testing imports...")
    test_imports()
    
    print("\n2. Testing image creation...")
    test_create_test_image()
    
    print("\n3. Testing folder structure...")
    test_folder_structure()
    
    print("\n✅ Basic tests completed!")
    print("💡 If all tests pass, the avatar system should work!")
