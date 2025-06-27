#!/usr/bin/env python3

from app import create_app
from app.models import db, User
import requests
import json

app = create_app()

def test_profile_endpoint():
    with app.app_context():
        # Test database connection
        try:
            db.create_all()
            print("✅ Database connected")
            
            # Check if users exist
            users = User.query.all()
            print(f"📊 Found {len(users)} users in database")
            
            for user in users:
                print(f"   - {user.username} (ID: {user.id}, Active: {user.is_active})")
                if hasattr(user, 'avatar_url'):
                    print(f"     Avatar: {user.avatar_url}")
                
                # Test profile method
                try:
                    profile_data = user.to_dict_with_profile()
                    print(f"     Profile data keys: {list(profile_data.keys())}")
                except Exception as e:
                    print(f"     ❌ Error in to_dict_with_profile: {e}")
            
            print("\n✅ Profile endpoint test completed")
            
        except Exception as e:
            print(f"❌ Database error: {e}")
            import traceback
            traceback.print_exc()

def test_login_and_profile():
    """Test login flow and profile access"""
    try:
        # Start server in background for testing
        import threading
        import time
        
        def run_server():
            with app.app_context():
                app.run(debug=False, host='127.0.0.1', port=5001, use_reloader=False)
        
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Wait for server to start
        time.sleep(2)
        
        # Test API
        BASE_URL = 'http://127.0.0.1:5001/api'
        
        # Try to register a test user
        print("\n🔐 Testing registration...")
        register_data = {
            'username': 'profile_test_user',
            'email': 'profiletest@example.com',
            'password': 'test123',
            'confirm_password': 'test123',
            'full_name': 'Profile Test User'
        }
        
        try:
            response = requests.post(f'{BASE_URL}/auth/register', json=register_data, timeout=5)
            print(f"Register response: {response.status_code}")
            if response.status_code != 201:
                print(f"Register response body: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Register request failed: {e}")
        
        # Try to login
        print("\n🔑 Testing login...")
        login_data = {
            'username': 'profile_test_user',
            'password': 'test123'
        }
        
        try:
            response = requests.post(f'{BASE_URL}/auth/login', json=login_data, timeout=5)
            print(f"Login response: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                token = result.get('access_token')
                print(f"✅ Login successful, token length: {len(token) if token else 0}")
                
                # Test profile endpoint
                print("\n👤 Testing profile endpoint...")
                headers = {
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
                
                profile_response = requests.get(f'{BASE_URL}/profile/', headers=headers, timeout=5)
                print(f"Profile response: {profile_response.status_code}")
                
                if profile_response.status_code == 200:
                    profile_data = profile_response.json()
                    print(f"✅ Profile data received:")
                    for key, value in profile_data.items():
                        print(f"   {key}: {value}")
                else:
                    print(f"❌ Profile request failed: {profile_response.text}")
                    
            else:
                print(f"❌ Login failed: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Login request failed: {e}")
            
    except Exception as e:
        print(f"❌ Test error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print("🔍 Testing Profile Functionality")
    print("=" * 50)
    
    # Test 1: Database and profile data
    test_profile_endpoint()
    
    # Test 2: API endpoints
    test_login_and_profile()
