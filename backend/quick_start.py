#!/usr/bin/env python3

from app import create_app
from app.models import db, User

# Create app
app = create_app()

def quick_test():
    with app.app_context():
        try:
            # Test database
            db.create_all()
            users = User.query.all()
            print(f"Found {len(users)} users")
            
            # Test profile method on first user
            if users:
                user = users[0]
                profile = user.to_dict_with_profile()
                print(f"Profile test successful for {user.username}")
                print(f"Keys: {list(profile.keys())}")
            else:
                print("No users found")
                
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    print("Quick profile test...")
    quick_test()
    print("\nStarting server on http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
