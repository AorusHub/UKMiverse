#!/usr/bin/env python3

from app import create_app
from app.models import db, User

app = create_app()

with app.app_context():
    print("=== All Users Debug ===")
    all_users = User.query.all()
    
    for user in all_users:
        print(f"\nUser ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Role ID: {user.role_id}")
        print(f"Has password hash: {bool(user.password_hash)}")
        print(f"Created at: {user.created_at}")
        print("-" * 40)
    
    print(f"\nTotal users: {len(all_users)}")
    
    # Specifically check admin user
    admin = User.query.filter_by(username='admin').first()
    if admin:
        print(f"\n=== Admin User Details ===")
        print(f"Admin ID: {admin.id}")
        print(f"Admin Username: {admin.username}")
        print(f"Admin Role: {admin.role}")
        print(f"Admin Role ID: {admin.role_id}")
        print(f"Admin Email: {admin.email}")
        
        # Test password
        print(f"Password 'admin123' works: {admin.check_password('admin123')}")
        print(f"Password 'admin' works: {admin.check_password('admin')}")
    else:
        print("\n=== Admin User NOT FOUND ===")
