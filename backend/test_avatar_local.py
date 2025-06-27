#!/usr/bin/env python3
"""
Test Script untuk Memverifikasi Sistem Avatar Lokal
- Upload file JPG
- Konversi base64 ke JPG
- Verifikasi file tersimpan dengan benar
- Test serving file statis
"""

import requests
import base64
import json
import os
from PIL import Image
import io

# Configuration
API_BASE_URL = 'http://localhost:5000/api'
TEST_USER = {
    'username': 'user1',
    'password': 'password123'
}

def login():
    """Login dan dapatkan token"""
    print("=== LOGIN USER ===")
    
    response = requests.post(f'{API_BASE_URL}/auth/login', json=TEST_USER)
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('access_token')
        print(f"✅ Login berhasil")
        print(f"Token: {token[:50]}...")
        return token
    else:
        print(f"❌ Login gagal: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def create_test_image():
    """Buat test image sebagai base64"""
    print("\n=== MEMBUAT TEST IMAGE ===")
    
    # Buat image simple
    img = Image.new('RGB', (200, 200), color='blue')
    
    # Tambahkan teks atau pattern sederhana
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 150, 150], fill='white')
    
    # Convert ke base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    base64_data = f"data:image/png;base64,{img_str}"
    
    print(f"✅ Test image dibuat (ukuran: {len(base64_data)} chars)")
    return base64_data, img

def test_base64_upload(token, base64_data):
    """Test upload avatar dengan base64 data"""
    print("\n=== TEST BASE64 UPLOAD ===")
    
    headers = {'Authorization': f'Bearer {token}'}
    data = {'avatar_url': base64_data}
    
    response = requests.put(f'{API_BASE_URL}/profile/avatar', 
                           json=data, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Base64 upload berhasil!")
        return True
    else:
        print("❌ Base64 upload gagal!")
        return False

def create_test_jpg_file():
    """Buat file JPG untuk test upload"""
    print("\n=== MEMBUAT TEST JPG FILE ===")
    
    # Buat image
    img = Image.new('RGB', (150, 150), color='red')
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    draw.ellipse([25, 25, 125, 125], fill='yellow')
    
    # Save sebagai JPG
    filename = 'test_avatar.jpg'
    img.save(filename, 'JPEG', quality=85)
    
    print(f"✅ Test JPG file dibuat: {filename}")
    return filename

def test_file_upload(token, filename):
    """Test upload file avatar"""
    print("\n=== TEST FILE UPLOAD ===")
    
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        with open(filename, 'rb') as f:
            files = {'avatar': (filename, f, 'image/jpeg')}
            response = requests.post(f'{API_BASE_URL}/profile/avatar/upload',
                                   files=files, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ File upload berhasil!")
            print(f"Avatar URL: {data.get('avatar_url')}")
            return data.get('avatar_url')
        else:
            print("❌ File upload gagal!")
            return None
            
    except Exception as e:
        print(f"❌ Error saat upload file: {e}")
        return None

def test_get_profile(token):
    """Test ambil profile untuk verifikasi avatar"""
    print("\n=== TEST GET PROFILE ===")
    
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{API_BASE_URL}/profile/', headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Profile berhasil diambil")
        print(f"Avatar URL: {data.get('avatar_url')}")
        print(f"Avatar Type: {data.get('avatar_type')}")
        print(f"Avatar Filename: {data.get('avatar_filename')}")
        return data
    else:
        print(f"❌ Gagal ambil profile: {response.text}")
        return None

def test_avatar_access(avatar_url):
    """Test akses file avatar"""
    print("\n=== TEST AVATAR ACCESS ===")
    
    if not avatar_url:
        print("❌ Tidak ada avatar URL untuk di test")
        return False
    
    # Test akses langsung ke URL
    full_url = f"http://localhost:5000{avatar_url}" if avatar_url.startswith('/') else avatar_url
    print(f"Testing URL: {full_url}")
    
    try:
        response = requests.get(full_url)
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type')}")
        print(f"Content-Length: {response.headers.get('Content-Length')}")
        
        if response.status_code == 200:
            print("✅ Avatar file dapat diakses!")
            return True
        else:
            print("❌ Avatar file tidak dapat diakses!")
            return False
            
    except Exception as e:
        print(f"❌ Error saat akses avatar: {e}")
        return False

def test_remove_avatar(token):
    """Test hapus avatar"""
    print("\n=== TEST REMOVE AVATAR ===")
    
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.delete(f'{API_BASE_URL}/profile/avatar/remove', headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Avatar berhasil dihapus!")
        return True
    else:
        print("❌ Gagal hapus avatar!")
        return False

def cleanup():
    """Cleanup test files"""
    print("\n=== CLEANUP ===")
    
    test_files = ['test_avatar.jpg']
    for filename in test_files:
        if os.path.exists(filename):
            os.remove(filename)
            print(f"✅ Dihapus: {filename}")

def main():
    """Main test function"""
    print("🚀 MEMULAI TEST SISTEM AVATAR LOKAL")
    print("=" * 50)
    
    # Login
    token = login()
    if not token:
        print("❌ Test dihentikan karena gagal login")
        return
    
    # Test 1: Base64 Upload
    base64_data, test_img = create_test_image()
    base64_success = test_base64_upload(token, base64_data)
    
    if base64_success:
        profile = test_get_profile(token)
        if profile and profile.get('avatar_url'):
            test_avatar_access(profile['avatar_url'])
    
    # Test 2: File Upload  
    jpg_filename = create_test_jpg_file()
    avatar_url = test_file_upload(token, jpg_filename)
    
    if avatar_url:
        profile = test_get_profile(token)
        if profile and profile.get('avatar_url'):
            test_avatar_access(profile['avatar_url'])
    
    # Test 3: Remove Avatar
    test_remove_avatar(token)
    
    # Verifikasi avatar sudah dihapus
    profile = test_get_profile(token)
    if profile:
        print(f"Avatar setelah dihapus: {profile.get('avatar_url')}")
    
    # Cleanup
    cleanup()
    
    print("\n" + "=" * 50)
    print("🏁 TEST SELESAI")

if __name__ == '__main__':
    main()
