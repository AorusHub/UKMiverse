#!/usr/bin/env python3
"""
Quick test untuk debugging masalah "image failed to load"
Script ini akan test URL gambar dan upload ke API
"""
import requests
import json

# Configuration
API_BASE_URL = "http://localhost:5000/api"
TEST_USER = {
    "username": "testuser",
    "password": "password123"
}

# Test URLs yang biasanya berfungsi
TEST_URLS = [
    "https://via.placeholder.com/150/9333ea/FFFFFF?text=Test1",
    "https://via.placeholder.com/150/0066cc/FFFFFF?text=Test2", 
    "https://picsum.photos/150?random=1",
    "https://httpbin.org/image/png",
    "https://httpbin.org/image/jpeg"
]

def test_image_url(url):
    """Test apakah URL image bisa diakses"""
    print(f"\n🔍 Testing URL: {url}")
    try:
        response = requests.head(url, timeout=10)
        print(f"  Status: {response.status_code}")
        print(f"  Content-Type: {response.headers.get('Content-Type', 'Unknown')}")
        print(f"  Content-Length: {response.headers.get('Content-Length', 'Unknown')}")
        
        if response.status_code == 200:
            content_type = response.headers.get('Content-Type', '').lower()
            if 'image' in content_type:
                print(f"  ✅ URL accessible and is an image")
                return True
            else:
                print(f"  ⚠️ URL accessible but not an image")
                return False
        else:
            print(f"  ❌ URL not accessible")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def login_and_get_token():
    """Login dan dapatkan token"""
    print("\n🔐 Logging in...")
    try:
        response = requests.post(f"{API_BASE_URL}/auth/login", 
                               json=TEST_USER,
                               timeout=10)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"  ✅ Login successful")
            return token
        else:
            print(f"  ❌ Login failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return None
    except Exception as e:
        print(f"  ❌ Login error: {e}")
        return None

def test_avatar_upload(token, avatar_url):
    """Test upload avatar ke API"""
    print(f"\n📤 Testing avatar upload...")
    print(f"  URL: {avatar_url}")
    
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        data = {"avatar_url": avatar_url}
        
        response = requests.put(f"{API_BASE_URL}/profile/", 
                              headers=headers,
                              json=data,
                              timeout=15)
        
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            profile = response.json()
            print(f"  ✅ Upload successful")
            print(f"  Avatar URL in response: {profile.get('avatar_url', 'None')}")
            return True
        else:
            print(f"  ❌ Upload failed")
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"  ❌ Upload error: {e}")
        return False

def get_current_profile(token):
    """Get current profile untuk check avatar"""
    print(f"\n📋 Getting current profile...")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_BASE_URL}/profile/", 
                              headers=headers,
                              timeout=10)
        
        if response.status_code == 200:
            profile = response.json()
            print(f"  ✅ Profile retrieved")
            print(f"  Username: {profile.get('username')}")
            print(f"  Avatar URL: {profile.get('avatar_url', 'None')}")
            return profile
        else:
            print(f"  ❌ Failed to get profile: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"  ❌ Profile error: {e}")
        return None

def main():
    print("=" * 50)
    print("🐛 Avatar Debug Script - Image Failed to Load")
    print("=" * 50)
    
    # Step 1: Test all URLs accessibility
    print("\n📋 STEP 1: Testing URL accessibility")
    working_urls = []
    for url in TEST_URLS:
        if test_image_url(url):
            working_urls.append(url)
    
    print(f"\n✅ Working URLs: {len(working_urls)}/{len(TEST_URLS)}")
    
    if not working_urls:
        print("❌ No working URLs found! Check internet connection.")
        return
    
    # Step 2: Login
    print("\n📋 STEP 2: Authentication")
    token = login_and_get_token()
    if not token:
        print("❌ Cannot proceed without token")
        return
    
    # Step 3: Get current profile
    print("\n📋 STEP 3: Current profile")
    current_profile = get_current_profile(token)
    
    # Step 4: Test upload with working URLs
    print("\n📋 STEP 4: Testing avatar uploads")
    success_count = 0
    for i, url in enumerate(working_urls[:3]):  # Test first 3 working URLs
        print(f"\n--- Test {i+1}/{min(3, len(working_urls))} ---")
        if test_avatar_upload(token, url):
            success_count += 1
            # Verify the upload worked
            updated_profile = get_current_profile(token)
            if updated_profile and updated_profile.get('avatar_url') == url:
                print(f"  ✅ Avatar successfully set in profile")
            else:
                print(f"  ⚠️ Avatar uploaded but not reflected in profile")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 SUMMARY")
    print("=" * 50)
    print(f"URLs tested: {len(TEST_URLS)}")
    print(f"URLs accessible: {len(working_urls)}")
    print(f"Upload tests: {min(3, len(working_urls))}")
    print(f"Successful uploads: {success_count}")
    
    if success_count > 0:
        print("\n✅ Avatar upload is working!")
        print("💡 If frontend still shows 'image failed to load':")
        print("   1. Check browser console for CORS errors")
        print("   2. Try hard refresh (Ctrl+F5)")
        print("   3. Check network tab in browser dev tools")
        print("   4. Verify frontend is connecting to correct backend URL")
    else:
        print("\n❌ Avatar upload is not working!")
        print("💡 Possible issues:")
        print("   1. Backend server not running")
        print("   2. Database connection issues")
        print("   3. Authentication problems")
        print("   4. CORS configuration issues")

if __name__ == "__main__":
    main()
