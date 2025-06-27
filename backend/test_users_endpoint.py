#!/usr/bin/env python3

import requests
import json

def test_users_endpoints():
    base_url = 'http://localhost:5000/api/auth'
    
    # 1. Login untuk mendapatkan token
    print("=== Step 1: Login ===")
    login_response = requests.post(f'{base_url}/login', json={
        'username': 'admin',
        'password': 'admin123'
    })
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json().get('access_token')
    print(f"✅ Login successful, token: {token[:20]}...")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # 2. Test GET /users
    print("\n=== Step 2: GET All Users ===")
    users_response = requests.get(f'{base_url}/users', headers=headers)
    print(f"Status: {users_response.status_code}")
    
    if users_response.status_code == 200:
        users_data = users_response.json()
        print(f"✅ Users loaded: {len(users_data)} users")
        for user in users_data:
            print(f"- User: {user.get('username')} (ID: {user.get('id')}, Role: {user.get('role', {}).get('name', 'N/A')})")
    else:
        print(f"❌ Failed to get users: {users_response.text}")
        return
    
    # 3. Test GET specific user
    if users_data:
        user_id = users_data[0]['id']
        print(f"\n=== Step 3: GET User {user_id} ===")
        user_response = requests.get(f'{base_url}/users/{user_id}', headers=headers)
        print(f"Status: {user_response.status_code}")
        
        if user_response.status_code == 200:
            user_detail = user_response.json()
            print(f"✅ User detail: {json.dumps(user_detail, indent=2)}")
        else:
            print(f"❌ Failed to get user detail: {user_response.text}")
    
    # 4. Test POST new user
    print(f"\n=== Step 4: POST New User ===")
    new_user_data = {
        'username': 'testuser_api',
        'email': 'testuser@test.com',
        'password': 'testpass123',
        'full_name': 'Test User API',
        'role_name': 'user'
    }
    
    create_response = requests.post(f'{base_url}/users', headers=headers, json=new_user_data)
    print(f"Status: {create_response.status_code}")
    
    if create_response.status_code == 201:
        created_user = create_response.json()
        print(f"✅ User created: {json.dumps(created_user, indent=2)}")
        new_user_id = created_user.get('user', {}).get('id')
        
        # 5. Test PUT update user
        if new_user_id:
            print(f"\n=== Step 5: PUT Update User {new_user_id} ===")
            update_data = {
                'full_name': 'Updated Test User',
                'bio': 'Updated bio via API'
            }
            
            update_response = requests.put(f'{base_url}/users/{new_user_id}', headers=headers, json=update_data)
            print(f"Status: {update_response.status_code}")
            
            if update_response.status_code == 200:
                updated_user = update_response.json()
                print(f"✅ User updated: {json.dumps(updated_user, indent=2)}")
            else:
                print(f"❌ Failed to update user: {update_response.text}")
            
            # 6. Test DELETE user
            print(f"\n=== Step 6: DELETE User {new_user_id} ===")
            delete_response = requests.delete(f'{base_url}/users/{new_user_id}', headers=headers)
            print(f"Status: {delete_response.status_code}")
            
            if delete_response.status_code == 200:
                delete_result = delete_response.json()
                print(f"✅ User deleted: {json.dumps(delete_result, indent=2)}")
            else:
                print(f"❌ Failed to delete user: {delete_response.text}")
    else:
        print(f"❌ Failed to create user: {create_response.text}")

if __name__ == "__main__":
    try:
        test_users_endpoints()
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")
