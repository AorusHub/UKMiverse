#!/usr/bin/env python3

import requests
import json

# Test endpoint login untuk melihat response yang dikirim
def test_login_response():
    url = 'http://localhost:5000/api/auth/login'
    
    # Test dengan admin credentials
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        print("=== Testing Login Endpoint ===")
        print(f"URL: {url}")
        print(f"Data: {login_data}")
        
        response = requests.post(url, json=login_data)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n=== LOGIN SUCCESS ===")
            print(f"Raw Response: {json.dumps(data, indent=2)}")
            
            if 'user' in data:
                user = data['user']
                print(f"\n=== USER DATA ANALYSIS ===")
                print(f"User ID: {user.get('id')}")
                print(f"Username: {user.get('username')}")
                print(f"Role ID: {user.get('role_id')}")
                print(f"Role Object: {user.get('role')}")
                print(f"Has role_id field: {'role_id' in user}")
                print(f"role_id value: {user.get('role_id')} (type: {type(user.get('role_id'))})")
                
                if user.get('role'):
                    role = user['role']
                    print(f"\n=== ROLE OBJECT ANALYSIS ===")
                    print(f"Role ID: {role.get('id')}")
                    print(f"Role Name: {role.get('name')}")
                    print(f"Role Description: {role.get('description')}")
            else:
                print("❌ No user data in response")
                
        else:
            print(f"❌ Login failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error: {error_data}")
            except:
                print(f"Error: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login_response()
