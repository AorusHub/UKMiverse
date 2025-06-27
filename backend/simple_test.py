#!/usr/bin/env python3

import sys
import os

try:
    print("Testing imports...")
    
    # Test config
    from config import Config
    print("✅ Config imported")
    
    # Test Flask
    from flask import Flask
    print("✅ Flask imported")
    
    # Test models
    from app.models import db, User, UKM, Category
    print("✅ Models imported")
    
    # Test app creation
    from app import create_app
    print("✅ App factory imported")
    
    # Create app
    app = create_app()
    print("✅ App created successfully")
    
    # Test database
    with app.app_context():
        db.create_all()
        print("✅ Database initialized")
        
        # Count records
        user_count = User.query.count()
        ukm_count = UKM.query.count()
        cat_count = Category.query.count()
        
        print(f"📊 Database records:")
        print(f"   Users: {user_count}")
        print(f"   UKM: {ukm_count}")  
        print(f"   Categories: {cat_count}")
        
    print("\n🎉 All tests passed! Starting server...")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Start server
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
