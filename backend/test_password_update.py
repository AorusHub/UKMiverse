#!/usr/bin/env python3

import requests
import json

API_BASE = 'http://localhost:5000/api'

def test_password_update():
    """Test password update endpoint"""
    print("=== TESTING PASSWORD UPDATE ===")
    
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
        
        # Step 2: Test password update
        password_data = {
            'current_password': 'admin123',
            'new_password': 'newpass123',
            'confirm_password': 'newpass123'
        }
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        print(f"Sending password update request with data: {password_data}")
        
        response = requests.put(f'{API_BASE}/profile/password', 
                              json=password_data, 
                              headers=headers)
        
        print(f"Password update response status: {response.status_code}")
        print(f"Password update response: {response.text}")
        
        if response.status_code == 200:
            print("Password update successful!")
            
            # Step 3: Try to login with new password
            print("\n=== TESTING LOGIN WITH NEW PASSWORD ===")
            new_login_data = {
                'username': 'admin',
                'password': 'newpass123'
            }
            
            response = requests.post(f'{API_BASE}/auth/login', json=new_login_data)
            print(f"New login response status: {response.status_code}")
            
            if response.status_code == 200:
                print("Login with new password successful!")
                
                # Step 4: Revert password back
                print("\n=== REVERTING PASSWORD BACK ===")
                revert_data = {
                    'current_password': 'newpass123',
                    'new_password': 'admin123',
                    'confirm_password': 'admin123'
                }
                
                new_token = response.json().get('access_token')
                headers['Authorization'] = f'Bearer {new_token}'
                
                response = requests.put(f'{API_BASE}/profile/password', 
                                      json=revert_data, 
                                      headers=headers)
                
                print(f"Revert password response status: {response.status_code}")
                print(f"Revert password response: {response.text}")
                
            else:
                print(f"Login with new password failed: {response.text}")
        else:
            print(f"Password update failed: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_password_update()
