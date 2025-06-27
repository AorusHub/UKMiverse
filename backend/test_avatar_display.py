#!/usr/bin/env python3
"""
Test script to verify avatar upload and display functionality.
This script will test both URL and base64 avatar upload.
"""
import requests
import json
import base64
import os

# Configuration
API_BASE_URL = "http://localhost:5000/api"
TEST_USER = {
    "username": "testuser",
    "password": "password123"
}

# Test image (1x1 pixel red image as base64)
TEST_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9NhxKvgAAAABJRU5ErkJggg=="
TEST_IMAGE_URL = "https://via.placeholder.com/150/0000FF/808080?Text=Test"

def get_auth_token():
    """Login and get authentication token"""
    print("1. Logging in...")
    login_data = {
        "username": TEST_USER["username"],
        "password": TEST_USER["password"]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            user = data.get("user", {})
            print(f"   ✓ Login successful! User: {user.get('username')}")
            print(f"   ✓ Current avatar: {user.get('avatar_url', 'None')}")
            return token
        else:
            print(f"   ✗ Login failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"   ✗ Login error: {e}")
        return None

def get_current_profile(token):
    """Get current profile information"""
    print("\n2. Getting current profile...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE_URL}/profile/", headers=headers)
        if response.status_code == 200:
            profile = response.json()
            print(f"   ✓ Profile retrieved!")
            print(f"   ✓ Username: {profile.get('username')}")
            print(f"   ✓ Avatar URL: {profile.get('avatar_url', 'None')}")
            return profile
        else:
            print(f"   ✗ Failed to get profile: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"   ✗ Profile fetch error: {e}")
        return None

def test_avatar_url_upload(token):
    """Test uploading avatar via URL"""
    print("\n3. Testing avatar upload via URL...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"avatar_url": TEST_IMAGE_URL}
    
    try:
        response = requests.put(f"{API_BASE_URL}/profile/", headers=headers, json=data)
        if response.status_code == 200:
            updated_profile = response.json()
            print(f"   ✓ Avatar URL upload successful!")
            print(f"   ✓ New avatar URL: {updated_profile.get('avatar_url')}")
            return updated_profile
        else:
            print(f"   ✗ Avatar URL upload failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"   ✗ Avatar URL upload error: {e}")
        return None

def test_avatar_base64_upload(token):
    """Test uploading avatar via base64"""
    print("\n4. Testing avatar upload via base64...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"avatar_url": TEST_IMAGE_BASE64}
    
    try:
        response = requests.put(f"{API_BASE_URL}/profile/", headers=headers, json=data)
        if response.status_code == 200:
            updated_profile = response.json()
            print(f"   ✓ Avatar base64 upload successful!")
            print(f"   ✓ New avatar (first 100 chars): {updated_profile.get('avatar_url', '')[:100]}...")
            return updated_profile
        else:
            print(f"   ✗ Avatar base64 upload failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"   ✗ Avatar base64 upload error: {e}")
        return None

def test_avatar_delete(token):
    """Test deleting avatar"""
    print("\n5. Testing avatar deletion...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    data = {"avatar_url": None}
    
    try:
        response = requests.put(f"{API_BASE_URL}/profile/", headers=headers, json=data)
        if response.status_code == 200:
            updated_profile = response.json()
            print(f"   ✓ Avatar deletion successful!")
            print(f"   ✓ Avatar URL is now: {updated_profile.get('avatar_url', 'None')}")
            return updated_profile
        else:
            print(f"   ✗ Avatar deletion failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"   ✗ Avatar deletion error: {e}")
        return None

def main():
    print("=== Avatar Display Test ===")
    print("This script tests avatar upload, update, and deletion functionality.")
    print("Make sure the backend server is running on http://localhost:5000")
    print()
    
    # Step 1: Get authentication token
    token = get_auth_token()
    if not token:
        print("\n❌ Cannot proceed without authentication token")
        return
    
    # Step 2: Get current profile
    initial_profile = get_current_profile(token)
    if not initial_profile:
        print("\n❌ Cannot proceed without profile information")
        return
    
    # Step 3: Test URL upload
    url_result = test_avatar_url_upload(token)
    if url_result:
        print("   → Frontend should now display the new avatar image")
    
    # Step 4: Test base64 upload
    base64_result = test_avatar_base64_upload(token)
    if base64_result:
        print("   → Frontend should now display the base64 avatar image")
    
    # Step 5: Test deletion
    delete_result = test_avatar_delete(token)
    if delete_result:
        print("   → Frontend should now display the default user icon")
    
    print("\n=== Test Complete ===")
    print("Check your browser to verify that:")
    print("1. Avatar changes are immediately visible after upload")
    print("2. Both URL and file upload work correctly")
    print("3. Avatar deletion removes the image and shows default icon")
    print("4. Both the profile page and header show the updated avatar")

if __name__ == "__main__":
    main()
