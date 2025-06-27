#!/usr/bin/env python3
"""
Database Migration Script untuk Avatar Fields
Menambahkan kolom avatar_filename dan avatar_type ke tabel users
"""

import pymysql
import sys
from pathlib import Path

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # XAMPP default tanpa password
    'database': 'ukmiverse_db',
    'charset': 'utf8mb4'
}

def create_connection():
    """Create database connection"""
    try:
        connection = pymysql.connect(**DB_CONFIG)
        print("✅ Connected to MySQL database")
        return connection
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        return None

def check_columns_exist(connection):
    """Check if avatar columns already exist"""
    try:
        cursor = connection.cursor()
        
        # Check if columns exist
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'ukmiverse_db' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME IN ('avatar_filename', 'avatar_type')
        """)
        
        existing_columns = [row[0] for row in cursor.fetchall()]
        cursor.close()
        
        return existing_columns
        
    except Exception as e:
        print(f"❌ Error checking columns: {e}")
        return []

def add_avatar_columns(connection):
    """Add avatar columns to users table"""
    try:
        cursor = connection.cursor()
        
        print("📝 Adding avatar columns to users table...")
        
        # Add avatar_filename column
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN avatar_filename VARCHAR(255) NULL AFTER avatar_url
        """)
        print("✅ Added avatar_filename column")
        
        # Add avatar_type column
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN avatar_type VARCHAR(10) DEFAULT 'url' AFTER avatar_filename
        """)
        print("✅ Added avatar_type column")
        
        connection.commit()
        cursor.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding columns: {e}")
        connection.rollback()
        return False

def update_existing_avatars(connection):
    """Update existing avatar_url entries to use new system"""
    try:
        cursor = connection.cursor()
        
        print("🔄 Updating existing avatar entries...")
        
        # Get users with avatar_url but no avatar_type
        cursor.execute("""
            SELECT id, avatar_url 
            FROM users 
            WHERE avatar_url IS NOT NULL 
            AND avatar_url != ''
            AND (avatar_type IS NULL OR avatar_type = 'url')
        """)
        
        users_with_avatars = cursor.fetchall()
        
        for user_id, avatar_url in users_with_avatars:
            if avatar_url.startswith('data:image/'):
                # Base64 avatar
                cursor.execute("""
                    UPDATE users 
                    SET avatar_type = 'base64' 
                    WHERE id = %s
                """, (user_id,))
                print(f"✅ Updated user {user_id}: set as base64 avatar")
            else:
                # URL avatar
                cursor.execute("""
                    UPDATE users 
                    SET avatar_type = 'url' 
                    WHERE id = %s
                """, (user_id,))
                print(f"✅ Updated user {user_id}: set as URL avatar")
        
        connection.commit()
        cursor.close()
        
        print(f"✅ Updated {len(users_with_avatars)} existing avatar entries")
        return True
        
    except Exception as e:
        print(f"❌ Error updating existing avatars: {e}")
        connection.rollback()
        return False

def verify_migration(connection):
    """Verify that migration was successful"""
    try:
        cursor = connection.cursor()
        
        print("🔍 Verifying migration...")
        
        # Check table structure
        cursor.execute("""
            DESCRIBE users
        """)
        
        columns = cursor.fetchall()
        avatar_columns = [col for col in columns if 'avatar' in col[0]]
        
        print("📋 Avatar columns in users table:")
        for column in avatar_columns:
            print(f"  - {column[0]}: {column[1]} {column[2]}")
        
        # Check data
        cursor.execute("""
            SELECT COUNT(*) as total_users,
                   COUNT(avatar_url) as users_with_avatar_url,
                   COUNT(avatar_filename) as users_with_avatar_filename,
                   COUNT(CASE WHEN avatar_type = 'local' THEN 1 END) as local_avatars,
                   COUNT(CASE WHEN avatar_type = 'url' THEN 1 END) as url_avatars,
                   COUNT(CASE WHEN avatar_type = 'base64' THEN 1 END) as base64_avatars
            FROM users
        """)
        
        stats = cursor.fetchone()
        cursor.close()
        
        print("📊 Avatar statistics:")
        print(f"  - Total users: {stats[0]}")
        print(f"  - Users with avatar_url: {stats[1]}")
        print(f"  - Users with avatar_filename: {stats[2]}")
        print(f"  - Local avatars: {stats[3]}")
        print(f"  - URL avatars: {stats[4]}")
        print(f"  - Base64 avatars: {stats[5]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying migration: {e}")
        return False

def main():
    """Main migration function"""
    print("🚀 STARTING DATABASE MIGRATION FOR AVATAR SYSTEM")
    print("=" * 60)
    
    # Connect to database
    connection = create_connection()
    if not connection:
        print("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    try:
        # Check existing columns
        existing_columns = check_columns_exist(connection)
        
        if 'avatar_filename' in existing_columns and 'avatar_type' in existing_columns:
            print("✅ Avatar columns already exist!")
            print("🔍 Verifying current state...")
            verify_migration(connection)
        else:
            print(f"📋 Existing avatar columns: {existing_columns}")
            
            # Add missing columns
            if add_avatar_columns(connection):
                print("✅ Avatar columns added successfully!")
                
                # Update existing data
                if update_existing_avatars(connection):
                    print("✅ Existing data updated successfully!")
                
                # Verify migration
                if verify_migration(connection):
                    print("✅ Migration completed and verified!")
                else:
                    print("⚠️ Migration completed but verification failed")
            else:
                print("❌ Failed to add avatar columns")
                sys.exit(1)
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)
    
    finally:
        connection.close()
        print("🔐 Database connection closed")
    
    print("\n" + "=" * 60)
    print("🎉 MIGRATION COMPLETED SUCCESSFULLY!")
    print("\n💡 Next steps:")
    print("1. Start Flask server: python run.py")
    print("2. Test avatar upload from frontend")
    print("3. Verify avatar files are saved in app/static/uploads/avatars/")

if __name__ == '__main__':
    main()
