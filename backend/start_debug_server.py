#!/usr/bin/env python3

from flask import request
from app import create_app
from app.models import db, User
import os

# Create app
app = create_app()

@app.before_request
def log_request():
    print(f"Request: {request.method} {request.path}")
    if request.headers.get('Authorization'):
        print(f"Authorization header present")

def init_database():
    """Initialize database with test data"""
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created")
            
            # Count existing users
            user_count = User.query.count()
            print(f"📊 Found {user_count} users in database")
            
            # List users
            users = User.query.all()
            for user in users:
                print(f"   - {user.username} (ID: {user.id}, Email: {user.email})")
                
            return True
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            return False

if __name__ == '__main__':
    print("🚀 Starting UKMiverse Backend Server")
    print("=" * 50)
    
    # Initialize database
    if not init_database():
        print("❌ Failed to initialize database, exiting...")
        exit(1)
    
    print("\n🌐 Server Configuration:")
    print(f"   Host: 127.0.0.1")
    print(f"   Port: 5000")
    print(f"   Debug: True")
    print(f"   Profile Endpoint: http://127.0.0.1:5000/api/profile/")
    print(f"   Swagger UI: http://127.0.0.1:5000/")
    
    print("\n📱 Frontend URLs to test:")
    print(f"   Debug Page: http://localhost:5176/profile-debug")
    print(f"   Fixed Profile: http://localhost:5176/profile")
    print(f"   Original Profile: http://localhost:5176/profile-original")
    
    print("\n🔄 Starting server...")
    print("   Press Ctrl+C to stop")
    
    try:
        app.run(debug=True, host='127.0.0.1', port=5000)
    except KeyboardInterrupt:
        print("\n✋ Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        import traceback
        traceback.print_exc()
