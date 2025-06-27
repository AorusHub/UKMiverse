#!/usr/bin/env python3
"""
Quick Start Script untuk UKMiverse dengan Avatar System
"""

import subprocess
import sys
import time
import os
from pathlib import Path

def check_mysql_connection():
    """Check if MySQL database is accessible"""
    try:
        import pymysql
        connection = pymysql.connect(
            host='localhost',
            user='root', 
            password='',
            database='ukmiverse_db'
        )
        connection.close()
        print("✅ MySQL database connection: OK")
        return True
    except Exception as e:
        print(f"❌ MySQL database connection: FAILED")
        print(f"   Error: {e}")
        return False

def check_avatar_columns():
    """Check if avatar columns exist in database"""
    try:
        import pymysql
        connection = pymysql.connect(
            host='localhost',
            user='root', 
            password='',
            database='ukmiverse_db'
        )
        cursor = connection.cursor()
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'ukmiverse_db' 
            AND TABLE_NAME = 'users' 
            AND COLUMN_NAME IN ('avatar_filename', 'avatar_type')
        """)
        columns = cursor.fetchall()
        cursor.close()
        connection.close()
        
        if len(columns) >= 2:
            print("✅ Avatar database columns: OK")
            return True
        else:
            print("❌ Avatar database columns: MISSING")
            return False
    except Exception as e:
        print(f"❌ Error checking avatar columns: {e}")
        return False

def run_migration():
    """Run database migration for avatar system"""
    try:
        print("🔄 Running database migration...")
        result = subprocess.run([sys.executable, 'migrate_avatar_db.py'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Database migration: SUCCESS")
            return True
        else:
            print("❌ Database migration: FAILED")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error running migration: {e}")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = ['flask', 'flask_restx', 'flask_jwt_extended', 'pymysql', 'PIL']
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'PIL':
                import PIL
            else:
                __import__(package)
            print(f"✅ {package}: installed")
        except ImportError:
            print(f"❌ {package}: missing")
            missing_packages.append(package)
    
    return len(missing_packages) == 0, missing_packages

def check_directories():
    """Check if required directories exist"""
    required_dirs = [
        'app/static/uploads/avatars',
        'app/services'
    ]
    
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"✅ {dir_path}: exists")
        else:
            print(f"❌ {dir_path}: missing")
            os.makedirs(dir_path, exist_ok=True)
            print(f"✅ {dir_path}: created")

def start_flask_server():
    """Start Flask development server"""
    try:
        print("🚀 Starting Flask server...")
        print("🌐 Server will be available at: http://localhost:5000")
        print("📚 API documentation: http://localhost:5000/")
        print("🛑 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        subprocess.run([sys.executable, 'run.py'])
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    """Main function"""
    print("🚀 UKMIVERSE QUICK START")
    print("=" * 50)
    
    # Change to backend directory
    if not os.path.exists('run.py'):
        if os.path.exists('backend/run.py'):
            os.chdir('backend')
        else:
            print("❌ Cannot find run.py file. Please run from project root or backend directory.")
            sys.exit(1)
    
    # Check directories
    print("\n1. Checking directories...")
    check_directories()
    
    # Check dependencies
    print("\n2. Checking dependencies...")
    deps_ok, missing = check_dependencies()
    if not deps_ok:
        print(f"❌ Missing packages: {missing}")
        print("💡 Install with: pip install -r requirements.txt")
        return
    
    # Check MySQL connection
    print("\n3. Checking database connection...")
    if not check_mysql_connection():
        print("💡 Make sure XAMPP MySQL is running")
        print("💡 Or run: python setup_mysql.py")
        return
    
    # Check avatar columns
    print("\n4. Checking avatar system...")
    if not check_avatar_columns():
        print("🔄 Avatar columns missing, running migration...")
        if not run_migration():
            print("❌ Migration failed")
            return
    
    print("\n" + "=" * 50)
    print("✅ ALL CHECKS PASSED!")
    print("🎉 UKMiverse is ready to run!")
    print("=" * 50)
    
    # Ask user if they want to start server
    try:
        start_now = input("\n🚀 Start Flask server now? (y/n): ").lower().strip()
        if start_now in ['y', 'yes', '']:
            start_flask_server()
        else:
            print("\n💡 To start server manually: python run.py")
            print("💡 To test avatar system: python test_avatar_local.py")
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")

if __name__ == '__main__':
    main()
