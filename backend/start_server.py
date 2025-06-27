#!/usr/bin/env python3

from app import create_app
from app.models import db

# Create Flask app
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        try:
            # Test database connection
            db.create_all()
            print("✅ Database connection successful")
            
            # Test models import
            from app.models import User, UKM, Category
            print("✅ Models imported successfully")
            
            # Check tables
            users_count = User.query.count()
            ukm_count = UKM.query.count()
            category_count = Category.query.count()
            
            print(f"📊 Database stats:")
            print(f"   Users: {users_count}")
            print(f"   UKM: {ukm_count}")
            print(f"   Categories: {category_count}")
            
            # Test API routes import
            from app.api import auth_routes, ukm_routes, profile_routes
            print("✅ API routes imported successfully")
            
            print("\n🚀 Starting Flask server...")
            app.run(debug=True, host='0.0.0.0', port=5000)
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
