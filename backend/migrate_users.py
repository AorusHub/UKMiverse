"""
Script untuk menambahkan kolom profil baru ke tabel users
"""
import pymysql
from config import Config
from urllib.parse import urlparse

def update_users_table():
    try:
        # Parse database URI
        db_uri = Config.SQLALCHEMY_DATABASE_URI
        # Format: mysql+pymysql://root:@localhost/ukmiverse_db
        
        # Remove the mysql+pymysql:// prefix and parse
        if db_uri.startswith('mysql+pymysql://'):
            db_uri = db_uri.replace('mysql+pymysql://', 'mysql://')
        
        parsed = urlparse(db_uri)
        
        # Connect to database
        connection = pymysql.connect(
            host=parsed.hostname or 'localhost',
            user=parsed.username or 'root',
            password=parsed.password or '',
            database=parsed.path.lstrip('/') if parsed.path else 'ukmiverse_db',
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        # Add new columns to users table
        columns_to_add = [
            "ALTER TABLE users ADD COLUMN bio TEXT NULL AFTER full_name",
            "ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER bio",
            "ALTER TABLE users ADD COLUMN address TEXT NULL AFTER phone",
            "ALTER TABLE users ADD COLUMN date_of_birth DATE NULL AFTER address",
            "ALTER TABLE users ADD COLUMN gender VARCHAR(10) NULL AFTER date_of_birth",
            "ALTER TABLE users ADD COLUMN student_id VARCHAR(20) NULL AFTER gender",
            "ALTER TABLE users ADD COLUMN faculty VARCHAR(100) NULL AFTER student_id",
            "ALTER TABLE users ADD COLUMN major VARCHAR(100) NULL AFTER faculty",
            "ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) NULL AFTER major"
        ]
        
        for sql in columns_to_add:
            try:
                cursor.execute(sql)
                print(f"✅ Executed: {sql}")
            except pymysql.err.OperationalError as e:
                if "Duplicate column name" in str(e):
                    print(f"⚠️ Column already exists: {sql}")
                else:
                    print(f"❌ Error: {sql} - {e}")
        
        connection.commit()
        print("✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

if __name__ == "__main__":
    update_users_table()
