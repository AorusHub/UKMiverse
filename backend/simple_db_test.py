#!/usr/bin/env python3
"""
Simple database test
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("🔍 Testing database connection...")
    from app import create_app, db
    from app.models import User, UKM, Category
    
    app = create_app()
    with app.app_context():
        # Count records
        user_count = User.query.count()
        ukm_count = UKM.query.count()
        category_count = Category.query.count()
        
        print(f"✅ Database connection successful!")
        print(f"👥 Users: {user_count}")
        print(f"🏛️ UKMs: {ukm_count}")
        print(f"📂 Categories: {category_count}")
        
        # Show sample data
        if ukm_count > 0:
            print("\n📋 Sample UKMs:")
            ukms = UKM.query.limit(3).all()
            for ukm in ukms:
                print(f"  - {ukm.nama} (ID: {ukm.id}, Category: {ukm.category_id})")
        
        if user_count > 0:
            print("\n👤 Sample Users:")
            users = User.query.limit(3).all()
            for user in users:
                user_dict = user.to_dict_with_profile()
                print(f"  - {user.username} (ID: {user.id}, Role ID: {user_dict.get('role_id')})")

except Exception as e:
    print(f"❌ Database test failed: {e}")
    import traceback
    traceback.print_exc()
