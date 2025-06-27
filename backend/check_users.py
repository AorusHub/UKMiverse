#!/usr/bin/env python3

from app import create_app
from app.models import db, User

app = create_app()

with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    if admin:
        print(f'Admin user found: {admin.username}')
        print(f'Password check for "admin123": {admin.check_password("admin123")}')
        print(f'Password check for "admin": {admin.check_password("admin")}')
        
        # Check all users and their passwords
        all_users = User.query.all()
        for user in all_users:
            print(f'User: {user.username}, has password hash: {bool(user.password_hash)}')
    else:
        print('Admin user not found')
