#!/usr/bin/env python3

import requests
import json
import base64

API_BASE = 'http://localhost:5000/api'

def test_avatar_upload():
    """Test avatar upload functionality"""
    print("=== TESTING AVATAR UPLOAD ===")
    
    # Step 1: Login first
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(f'{API_BASE}/auth/login', json=login_data)
        print(f"Login response status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return
        
        data = response.json()
        token = data.get('access_token')
        
        if not token:
            print("No token received from login")
            return
        
        print(f"Login successful, token: {token[:20]}...")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Step 2: Test URL avatar upload
        print("\n=== TESTING URL AVATAR UPLOAD ===")
        url_data = {
            'avatar_url': 'https://via.placeholder.com/150/0000FF/808080?text=Test'
        }
        
        response = requests.put(f'{API_BASE}/profile/', 
                              json=url_data, 
                              headers=headers)
        
        print(f"URL avatar upload response status: {response.status_code}")
        print(f"URL avatar upload response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Avatar URL in response: {result.get('avatar_url', 'NOT FOUND')}")
        
        # Step 3: Test base64 avatar upload
        print("\n=== TESTING BASE64 AVATAR UPLOAD ===")
        
        # Create a simple base64 image (1x1 red pixel)
        base64_data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        
        base64_data_obj = {
            'avatar_url': base64_data
        }
        
        response = requests.put(f'{API_BASE}/profile/', 
                              json=base64_data_obj, 
                              headers=headers)
        
        print(f"Base64 avatar upload response status: {response.status_code}")
        print(f"Base64 avatar upload response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            avatar_url = result.get('avatar_url', 'NOT FOUND')
            print(f"Avatar URL in response (length): {len(avatar_url) if avatar_url else 'None'}")
            if avatar_url:
                print(f"Avatar URL preview: {avatar_url[:100]}...")
        
        # Step 4: Get profile to verify avatar
        print("\n=== GETTING PROFILE TO VERIFY AVATAR ===")
        
        response = requests.get(f'{API_BASE}/profile/', headers=headers)
        
        print(f"Get profile response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            avatar_url = result.get('avatar_url', 'NOT FOUND')
            print(f"Current avatar URL: {avatar_url}")
            if avatar_url and len(avatar_url) > 100:
                print(f"Avatar URL preview: {avatar_url[:100]}...")
        else:
            print(f"Get profile failed: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_avatar_upload()
