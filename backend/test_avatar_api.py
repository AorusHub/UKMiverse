#!/usr/bin/env python3

import requests
import json

# Test login dan profile update
BASE_URL = 'http://localhost:5000/api'

def test_register():
    # Register new test user
    register_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'test123',
        'confirm_password': 'test123',
        'full_name': 'Test User'
    }
    
    response = requests.post(f'{BASE_URL}/auth/register', json=register_data)
    print(f'Register response: {response.status_code}')
    
    if response.status_code == 201:
        print('Registration successful')
        return True
    else:
        print(f'Register failed: {response.text}')
        return False

def test_login():
    # Login dengan user testuser
    login_data = {
        'username': 'testuser',
        'password': 'test123'
    }
    
    response = requests.post(f'{BASE_URL}/auth/login', json=login_data)
    print(f'Login response: {response.status_code}')
    
    if response.status_code == 200:
        result = response.json()
        token = result.get('access_token')
        print(f'Login successful, token: {token[:50]}...')
        return token
    else:
        print(f'Login failed: {response.text}')
        return None

def test_profile_get(token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{BASE_URL}/profile/', headers=headers)
    print(f'Get profile response: {response.status_code}')
    
    if response.status_code == 200:
        profile = response.json()
        print(f'Current avatar_url: {profile.get("avatar_url")}')
        return profile
    else:
        print(f'Get profile failed: {response.text}')
        return None

def test_avatar_update(token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Test dengan URL
    update_data = {
        'avatar_url': 'https://via.placeholder.com/200x200/FF5733/FFFFFF?text=Avatar'
    }
    
    response = requests.put(f'{BASE_URL}/profile/', headers=headers, json=update_data)
    print(f'Avatar update response: {response.status_code}')
    
    if response.status_code == 200:
        result = response.json()
        print(f'Avatar updated successfully: {result.get("avatar_url")}')
        return result
    else:
        print(f'Avatar update failed: {response.text}')
        return None

if __name__ == '__main__':
    print('Testing avatar functionality...')
    
    # Step 0: Register test user
    test_register()
    
    # Step 1: Login
    token = test_login()
    if not token:
        exit(1)
    
    # Step 2: Get current profile
    profile = test_profile_get(token)
    if not profile:
        exit(1)
    
    # Step 3: Update avatar
    updated_profile = test_avatar_update(token)
    if not updated_profile:
        exit(1)
    
    # Step 4: Verify update
    print('\nVerifying update...')
    final_profile = test_profile_get(token)
    
    print('\nTest completed successfully!')
