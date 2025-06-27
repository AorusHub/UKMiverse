#!/usr/bin/env python3
"""
Script untuk memastikan backend berjalan dan database terhubung
"""

import sys
import os
import requests
import json
import time

# Tambahkan path backend
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_backend_status():
    """Cek apakah backend berjalan"""
    try:
        response = requests.get('http://localhost:5000/api/ukm/', timeout=5)
        return True, response.status_code, response.text[:200]
    except requests.exceptions.ConnectionError:
        return False, None, "Connection refused"
    except Exception as e:
        return False, None, str(e)

def test_database_connection():
    """Test koneksi database langsung"""
    try:
        from app import create_app, db
        from app.models import User, UKM, Category
        
        app = create_app()
        with app.app_context():
            # Test user count
            user_count = User.query.count()
            ukm_count = UKM.query.count()
            category_count = Category.query.count()
            
            print(f"✅ Database Connection: SUCCESS")
            print(f"📊 Users in database: {user_count}")
            print(f"📊 UKMs in database: {ukm_count}")
            print(f"📊 Categories in database: {category_count}")
            
            # Sample data
            if user_count > 0:
                sample_user = User.query.first()
                user_dict = sample_user.to_dict_with_profile()
                print(f"👤 Sample user: {json.dumps(user_dict, indent=2)}")
            
            if ukm_count > 0:
                sample_ukm = UKM.query.first()
                ukm_dict = sample_ukm.to_dict()
                print(f"🏛️ Sample UKM: {json.dumps(ukm_dict, indent=2)}")
                
            return True, user_count, ukm_count, category_count
            
    except Exception as e:
        print(f"❌ Database Connection: FAILED")
        print(f"Error: {e}")
        return False, 0, 0, 0

def start_backend_if_needed():
    """Start backend jika belum berjalan"""
    backend_running, status, message = check_backend_status()
    
    if not backend_running:
        print("🚀 Starting backend server...")
        import subprocess
        import threading
        
        def run_server():
            try:
                subprocess.run([sys.executable, 'run.py'], check=True)
            except Exception as e:
                print(f"❌ Failed to start server: {e}")
        
        # Start server in background thread
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Wait for server to start
        for i in range(10):
            time.sleep(2)
            backend_running, status, message = check_backend_status()
            if backend_running:
                print(f"✅ Backend started successfully on attempt {i+1}")
                break
            print(f"⏳ Waiting for backend... attempt {i+1}/10")
        
        if not backend_running:
            print("❌ Failed to start backend after 10 attempts")
            return False
    else:
        print(f"✅ Backend already running (status: {status})")
    
    return True

def test_api_endpoints():
    """Test semua API endpoints"""
    endpoints = [
        '/api/ukm/',
        '/api/ukm/categories',
        '/api/auth/login'
    ]
    
    print("\n=== TESTING API ENDPOINTS ===")
    for endpoint in endpoints:
        try:
            if endpoint == '/api/auth/login':
                # Test POST login
                response = requests.post(f'http://localhost:5000{endpoint}', 
                                       json={'username': 'admin', 'password': 'admin123'})
            else:
                # Test GET
                response = requests.get(f'http://localhost:5000{endpoint}')
            
            print(f"📡 {endpoint}: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    print(f"   📊 Count: {len(data)}")
                elif isinstance(data, dict):
                    print(f"   📋 Keys: {list(data.keys())}")
            else:
                print(f"   ❌ Error: {response.text[:100]}")
                
        except Exception as e:
            print(f"📡 {endpoint}: ❌ Error - {e}")

def main():
    print("=" * 60)
    print("🔍 UKMiverse Backend & Database Connection Test")
    print("=" * 60)
    
    # 1. Test database connection
    print("\n1. Testing Database Connection...")
    db_success, user_count, ukm_count, category_count = test_database_connection()
    
    if not db_success:
        print("❌ Database connection failed. Check your database setup.")
        return False
    
    # 2. Start backend if needed
    print("\n2. Checking Backend Server...")
    backend_success = start_backend_if_needed()
    
    if not backend_success:
        print("❌ Backend server failed to start.")
        return False
    
    # 3. Test API endpoints
    test_api_endpoints()
    
    print("\n" + "=" * 60)
    print("✅ DIAGNOSIS COMPLETE")
    print("=" * 60)
    print(f"Database Users: {user_count}")
    print(f"Database UKMs: {ukm_count}")
    print(f"Database Categories: {category_count}")
    print("Backend Status: ✅ Running")
    print("\n💡 Next Steps:")
    print("1. Open browser: http://localhost:3000/admin")
    print("2. Clear cache: Ctrl+Shift+R")
    print("3. Check browser console for errors")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    main()
