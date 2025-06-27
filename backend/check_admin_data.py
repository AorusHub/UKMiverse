#!/usr/bin/env python3
"""
Script untuk memeriksa data admin dan struktur user
"""

import pymysql
import json

def check_admin_data():
    try:
        # Database connection
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='ukmiverse_db',
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        print("=" * 50)
        print("CHECKING ADMIN USER DATA")
        print("=" * 50)
        
        # Check users table structure
        cursor.execute("DESCRIBE users")
        columns = cursor.fetchall()
        print("\n📋 Users table structure:")
        for col in columns:
            print(f"   - {col[0]} ({col[1]})")
        
        # Check admin user
        cursor.execute("SELECT * FROM users WHERE username = 'admin'")
        admin = cursor.fetchone()
        
        if admin:
            print("\n👤 Admin user found:")
            cursor.execute("DESCRIBE users")
            column_names = [col[0] for col in cursor.fetchall()]
            
            admin_dict = dict(zip(column_names, admin))
            for key, value in admin_dict.items():
                if key == 'password_hash':
                    print(f"   - {key}: {'***HIDDEN***' if value else 'NULL'}")
                else:
                    print(f"   - {key}: {value}")
        else:
            print("\n❌ Admin user not found!")
        
        # Check roles table if exists
        try:
            cursor.execute("SELECT * FROM roles")
            roles = cursor.fetchall()
            print(f"\n🎭 Roles table ({len(roles)} roles):")
            for role in roles:
                print(f"   - ID: {role[0]}, Name: {role[1]}")
        except:
            print("\n⚠️  Roles table not found or empty")
        
        # Check user role relationships
        try:
            cursor.execute("""
                SELECT u.id, u.username, u.role_id, r.name as role_name 
                FROM users u 
                LEFT JOIN roles r ON u.role_id = r.id 
                WHERE u.username = 'admin'
            """)
            admin_role = cursor.fetchone()
            if admin_role:
                print(f"\n🔐 Admin role details:")
                print(f"   - User ID: {admin_role[0]}")
                print(f"   - Username: {admin_role[1]}")
                print(f"   - Role ID: {admin_role[2]}")
                print(f"   - Role Name: {admin_role[3]}")
        except Exception as e:
            print(f"\n⚠️  Error checking user-role relationship: {e}")
        
        print("\n" + "=" * 50)
        print("SUGGESTIONS FOR FRONTEND:")
        print("=" * 50)
        
        if admin:
            role_id = admin_dict.get('role_id')
            role_name = admin_dict.get('role')
            
            if role_id == 1:
                print("✅ Admin has role_id = 1")
                print("   Frontend should check: user.role_id === 1")
            
            if role_name == 'admin':
                print("✅ Admin has role = 'admin'")
                print("   Frontend should check: user.role === 'admin'")
            
            print(f"\n💡 Recommended frontend check:")
            print(f"   (user?.role === 'admin' || user?.role_id === 1)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    check_admin_data()
