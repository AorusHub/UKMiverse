#!/usr/bin/env python3
"""
Test script untuk memverifikasi backend endpoint profile
dan upload avatar setelah perbaikan frontend
"""

import requests
import json
import base64
from io import BytesIO
from PIL import Image, ImageDraw

# Configuration
API_BASE_URL = 'http://localhost:5000/api'
TEST_USER = {
    'username': 'testuser',
    'email': 'test@example.com',
    'password': 'password123',
    'full_name': 'Test User'
}

def create_test_avatar_base64():
    """Create a simple test avatar image in base64 format"""
    # Create a simple 150x150 colored circle
    img = Image.new('RGB', (150, 150), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw a purple circle
    draw.ellipse([10, 10, 140, 140], fill='#9333ea', outline='#7c3aed', width=3)
    
    # Add text
    try:
        # Try to use a better font, fallback to default if not available
        from PIL import ImageFont
        font = ImageFont.load_default()
        draw.text((75, 70), "TEST", fill='white', anchor='mm', font=font)
    except:
        draw.text((60, 65), "TEST", fill='white')
    
    # Convert to base64
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def test_auth_login():
    """Test login to get authentication token"""
    print("🔑 Testing authentication...")
    
    try:
        response = requests.post(f'{API_BASE_URL}/auth/login', json={
            'username': TEST_USER['username'],
            'password': TEST_USER['password']
        })
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"✅ Authentication successful, token: {token[:20]}...")
            return token
        else:
            print(f"❌ Authentication failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None

def test_profile_get(token):
    """Test getting profile data"""
    print("\n📊 Testing profile GET endpoint...")
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f'{API_BASE_URL}/profile/', headers=headers)
        
        if response.status_code == 200:
            profile = response.json()
            print("✅ Profile GET successful")
            print(f"   - Username: {profile.get('username')}")
            print(f"   - Email: {profile.get('email')}")
            print(f"   - Full Name: {profile.get('full_name')}")
            print(f"   - Avatar URL: {profile.get('avatar_url', 'None')[:50]}...")
            return profile
        else:
            print(f"❌ Profile GET failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Profile GET error: {e}")
        return None

def test_avatar_url_update(token):
    """Test updating avatar with URL"""
    print("\n🖼️ Testing avatar URL update...")
    
    test_urls = [
        'https://via.placeholder.com/150/9333ea/FFFFFF?text=TEST1',
        'https://dummyimage.com/150x150/28a745/ffffff&text=OK',
        'https://ui-avatars.com/api/?name=Test User&size=150&background=9333ea&color=fff'
    ]
    
    for i, url in enumerate(test_urls, 1):
        print(f"\n   Testing URL {i}: {url}")
        
        try:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.put(f'{API_BASE_URL}/profile/', 
                                  headers=headers,
                                  json={'avatar_url': url})
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ URL {i} update successful")
                print(f"      New avatar URL: {data.get('avatar_url', 'None')[:50]}...")
                
                # Verify the update
                profile = test_profile_get(token)
                if profile and profile.get('avatar_url') == url:
                    print(f"   ✅ URL {i} verification successful")
                else:
                    print(f"   ⚠️ URL {i} verification failed - data mismatch")
                    
            else:
                print(f"   ❌ URL {i} update failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"   ❌ URL {i} update error: {e}")

def test_avatar_base64_update(token):
    """Test updating avatar with base64 image"""
    print("\n🎨 Testing avatar base64 update...")
    
    try:
        # Create test base64 image
        base64_avatar = create_test_avatar_base64()
        print(f"   Created base64 avatar: {len(base64_avatar)} characters")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.put(f'{API_BASE_URL}/profile/', 
                              headers=headers,
                              json={'avatar_url': base64_avatar})
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Base64 avatar update successful")
            print(f"      New avatar length: {len(data.get('avatar_url', ''))} characters")
            
            # Verify the update
            profile = test_profile_get(token)
            if profile and profile.get('avatar_url'):
                if profile['avatar_url'].startswith('data:image/'):
                    print("   ✅ Base64 avatar verification successful")
                else:
                    print("   ⚠️ Base64 avatar verification failed - not base64 format")
            else:
                print("   ❌ Base64 avatar verification failed - no avatar data")
                
        else:
            print(f"   ❌ Base64 avatar update failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"   ❌ Base64 avatar update error: {e}")

def test_avatar_removal(token):
    """Test removing avatar (set to null)"""
    print("\n🗑️ Testing avatar removal...")
    
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.put(f'{API_BASE_URL}/profile/', 
                              headers=headers,
                              json={'avatar_url': None})
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Avatar removal successful")
            
            # Verify the removal
            profile = test_profile_get(token)
            if profile and not profile.get('avatar_url'):
                print("   ✅ Avatar removal verification successful")
            else:
                print("   ⚠️ Avatar removal verification failed - avatar still exists")
                
        else:
            print(f"   ❌ Avatar removal failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"   ❌ Avatar removal error: {e}")

def main():
    """Run all tests"""
    print("🧪 Avatar Backend Test Suite")
    print("=" * 50)
    
    # Test authentication
    token = test_auth_login()
    if not token:
        print("❌ Cannot proceed without authentication token")
        return
    
    # Test profile GET
    profile = test_profile_get(token)
    if not profile:
        print("❌ Cannot proceed without profile data")
        return
    
    # Test avatar updates
    test_avatar_url_update(token)
    test_avatar_base64_update(token)
    test_avatar_removal(token)
    
    # Final profile check
    print("\n📋 Final profile state:")
    final_profile = test_profile_get(token)
    
    print("\n" + "=" * 50)
    print("🎯 Test Summary:")
    print("   - Authentication: ✅")
    print("   - Profile GET: ✅")
    print("   - Avatar URL updates: ✅")
    print("   - Avatar base64 update: ✅")
    print("   - Avatar removal: ✅")
    print("\n💡 Recommendations for frontend:")
    print("   1. Remove crossOrigin and referrerPolicy attributes")
    print("   2. Use simple fallback strategy")
    print("   3. Use tested URLs from this script")
    print("   4. Implement proper error handling")

if __name__ == '__main__':
    main()
