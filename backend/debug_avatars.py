#!/usr/bin/env python3

from app import create_app
from app.models import db, User

app = create_app()

with app.app_context():
    db.create_all()
    print('Tables created')
    
    users = User.query.all()
    print(f'Total users: {len(users)}')
    
    for u in users:
        print(f'User {u.id}: {u.username}, avatar_url: {u.avatar_url}')
        
    # Test avatar update
    test_user = User.query.first()
    if test_user:
        print(f'\nTesting avatar update for user: {test_user.username}')
        test_user.avatar_url = 'https://via.placeholder.com/150'
        db.session.commit()
        print(f'Avatar updated to: {test_user.avatar_url}')
        
        # Check if it's saved
        updated_user = User.query.get(test_user.id)
        print(f'Verified avatar in DB: {updated_user.avatar_url}')
