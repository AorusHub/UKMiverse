#!/usr/bin/env python3
import requests
import json

def quick_test():
    try:
        # Test login
        print("=== LOGIN TEST ===")
        response = requests.post('http://localhost:5000/api/auth/login', json={
            'username': 'admin', 'password': 'admin123'
        })
        
        if response.status_code == 200:
            token = response.json()['access_token']
            print(f"✅ Login success, token: {token[:20]}...")
            
            headers = {'Authorization': f'Bearer {token}'}
            
            # Test get users
            print("\n=== GET USERS TEST ===")
            users_response = requests.get('http://localhost:5000/api/auth/users', headers=headers)
            
            print(f"Status: {users_response.status_code}")
            if users_response.status_code == 200:
                users = users_response.json()
                print(f"✅ Found {len(users)} users:")
                for user in users:
                    role_name = user.get('role', {}).get('name', 'N/A') if isinstance(user.get('role'), dict) else user.get('role', 'N/A')
                    print(f"  - {user['username']} (ID: {user['id']}, Role: {role_name})")
                    
                # Test create user
                print("\n=== CREATE USER TEST ===")
                new_user = {
                    'username': 'testuser123',
                    'email': 'testuser123@test.com',
                    'password': 'password123',
                    'full_name': 'Test User',
                    'role_name': 'user'
                }
                
                create_response = requests.post('http://localhost:5000/api/auth/users', 
                                              headers={**headers, 'Content-Type': 'application/json'}, 
                                              json=new_user)
                
                print(f"Create status: {create_response.status_code}")
                if create_response.status_code == 201:
                    created = create_response.json()
                    print(f"✅ User created: {created}")
                    
                    user_id = created.get('user', {}).get('id')
                    if user_id:
                        # Test update user
                        print(f"\n=== UPDATE USER TEST (ID: {user_id}) ===")
                        update_data = {
                            'full_name': 'Updated Test User',
                            'bio': 'Updated bio'
                        }
                        
                        update_response = requests.put(f'http://localhost:5000/api/auth/users/{user_id}',
                                                     headers={**headers, 'Content-Type': 'application/json'},
                                                     json=update_data)
                        
                        print(f"Update status: {update_response.status_code}")
                        if update_response.status_code == 200:
                            print(f"✅ User updated: {update_response.json()}")
                        else:
                            print(f"❌ Update failed: {update_response.text}")
                        
                        # Test delete user
                        print(f"\n=== DELETE USER TEST (ID: {user_id}) ===")
                        delete_response = requests.delete(f'http://localhost:5000/api/auth/users/{user_id}', headers=headers)
                        
                        print(f"Delete status: {delete_response.status_code}")
                        if delete_response.status_code == 200:
                            print(f"✅ User deleted: {delete_response.json()}")
                        else:
                            print(f"❌ Delete failed: {delete_response.text}")
                    
                else:
                    print(f"❌ Create failed: {create_response.text}")
            else:
                print(f"❌ Get users failed: {users_response.text}")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
        print("Start backend with: python run.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    quick_test()
