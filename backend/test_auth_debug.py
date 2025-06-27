#!/usr/bin/env python3

import requests
import json

API_BASE = 'http://localhost:5000/api'

def test_login():
    """Test login endpoint"""
    print("=== TESTING LOGIN ===")
    
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(f'{API_BASE}/auth/login', json=login_data)
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            user = data.get('user')
            
            print(f"Login successful!")
            print(f"Token: {token[:50]}..." if token else "No token")
            print(f"User: {user['username']} ({user['email']})" if user else "No user")
            
            return token
        else:
            print(f"Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"Login error: {e}")
        return None

def test_profile(token):
    """Test profile endpoint with token"""
    print("\n=== TESTING PROFILE ===")
    
    if not token:
        print("No token available for profile test")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f'{API_BASE}/profile/', headers=headers)
        print(f"Profile response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Profile success: {data.get('username')} - {data.get('email')}")
        else:
            print(f"Profile failed: {response.text}")
            
    except Exception as e:
        print(f"Profile error: {e}")

def test_debug(token):
    """Test debug endpoint with token"""
    print("\n=== TESTING DEBUG ===")
    
    if not token:
        print("No token available for debug test")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f'{API_BASE}/auth/debug', headers=headers)
        print(f"Debug response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Debug success: {json.dumps(data, indent=2)}")
        else:
            print(f"Debug failed: {response.text}")
            
    except Exception as e:
        print(f"Debug error: {e}")

if __name__ == '__main__':
    # Test login first
    token = test_login()
    
    # Test debug endpoint
    test_debug(token)
    
    # Test profile endpoint
    test_profile(token)
