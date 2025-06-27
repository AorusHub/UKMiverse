#!/usr/bin/env python3

import requests
import json
from datetime import datetime, timedelta

def check_and_refresh_token():
    try:
        print("=== CHECKING AND REFRESHING AUTH TOKEN ===")
        
        # Step 1: Test current token (if any exists in browser localStorage)
        print("\n1. Testing current authentication...")
        
        # Try to login fresh
        login_response = requests.post('http://localhost:5000/api/auth/login', json={
            'username': 'admin',
            'password': 'admin123'
        })
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            token = token_data['access_token']
            user = token_data['user']
            
            print(f"✅ Login successful!")
            print(f"Token: {token[:30]}...")
            print(f"User: {user['username']} (Role: {user.get('role', {}).get('name', 'N/A')})")
            
            # Step 2: Test protected endpoints with this token
            print(f"\n2. Testing protected endpoints with fresh token...")
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            # Test users endpoint
            users_response = requests.get('http://localhost:5000/api/auth/users', headers=headers)
            print(f"Users endpoint: {users_response.status_code}")
            
            if users_response.status_code == 200:
                users = users_response.json()
                print(f"✅ Users loaded successfully: {len(users)} users")
                for user in users:
                    role_name = user.get('role', {}).get('name', 'N/A')
                    print(f"  - {user['username']} ({role_name})")
            else:
                print(f"❌ Users endpoint failed: {users_response.text}")
            
            # Step 3: Provide instructions for frontend
            print(f"\n3. Frontend Integration Instructions:")
            print(f"=====================================")
            print(f"If you're getting 401 errors in the frontend:")
            print(f"1. Open browser DevTools (F12)")
            print(f"2. Go to Application/Storage tab")
            print(f"3. Clear localStorage")
            print(f"4. Login again with admin/admin123")
            print(f"5. Check that token is stored in localStorage")
            print(f"")
            print(f"New fresh token for testing:")
            print(f"{token}")
            
        else:
            print(f"❌ Login failed: {login_response.status_code}")
            try:
                error = login_response.json()
                print(f"Error: {error}")
            except:
                print(f"Error: {login_response.text}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
        print("Start backend with: python run.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_and_refresh_token()
