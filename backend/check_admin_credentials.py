#!/usr/bin/env python3
"""
Script untuk memverifikasi credentials admin di UKMiverse
"""

from app import create_app
from app.models import db, User, Role

app = create_app()

def check_admin_credentials():
    """Check admin credentials and display information"""
    with app.app_context():
        print("🔐 UKMiverse Admin Credentials Checker")
        print("=" * 50)
        
        # Check if admin user exists
        admin = User.query.filter_by(username='admin').first()
        
        if admin:
            print("✅ Admin user found!")
            print(f"   📧 Email: {admin.email}")
            print(f"   👤 Full Name: {admin.full_name}")
            print(f"   🏷️  Role: {admin.role.name if admin.role else 'No role'}")
            print(f"   🆔 User ID: {admin.id}")
            
            print("\n🔑 Testing passwords:")
            
            # Test various possible passwords
            test_passwords = [
                'password123',  # From __init__.py
                'admin123',     # From test files
                'admin',        # Simple admin
                'ukmiverse123', # Project specific
                '123456',       # Common password
            ]
            
            for password in test_passwords:
                is_valid = admin.check_password(password)
                status = "✅ VALID" if is_valid else "❌ Invalid"
                print(f"   {status}: '{password}'")
                
                if is_valid:
                    print(f"\n🎉 FOUND CORRECT PASSWORD: '{password}'")
                    print(f"📋 Admin Login Credentials:")
                    print(f"   Username: admin")
                    print(f"   Password: {password}")
                    return password
            
            print("\n⚠️  None of the test passwords worked!")
            print("   The admin password might be different.")
            
        else:
            print("❌ Admin user not found!")
            print("   The database might not be initialized.")
            
            # Try to create admin user
            print("\n🔧 Attempting to create admin user...")
            try:
                admin_user, message = User.create_user(
                    username='admin',
                    email='admin@ukmiverse.com',
                    password='admin123',
                    full_name='Administrator',
                    role_name='admin'
                )
                
                if admin_user:
                    print("✅ Admin user created successfully!")
                    print(f"📋 New Admin Credentials:")
                    print(f"   Username: admin")
                    print(f"   Password: admin123")
                    return 'admin123'
                else:
                    print(f"❌ Failed to create admin user: {message}")
                    
            except Exception as e:
                print(f"❌ Error creating admin user: {str(e)}")
        
        return None

def display_all_users():
    """Display all users in the system"""
    with app.app_context():
        print("\n👥 All Users in System:")
        print("-" * 30)
        
        users = User.query.all()
        if users:
            for user in users:
                role_name = user.role.name if user.role else 'No role'
                print(f"   👤 {user.username} ({role_name}) - {user.email}")
        else:
            print("   No users found in database")

if __name__ == "__main__":
    password = check_admin_credentials()
    display_all_users()
    
    if password:
        print(f"\n🚀 Ready to login!")
        print(f"   Go to login page and use:")
        print(f"   Username: admin")
        print(f"   Password: {password}")
    else:
        print(f"\n❌ Could not determine admin credentials.")
        print(f"   Please check database initialization.")
