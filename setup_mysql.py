"""
Script untuk setup database MySQL untuk UKMiverse
Jalankan setelah XAMPP MySQL sudah running
"""

import sys
import subprocess
from datetime import datetime

def install_pymysql():
    """Install pymysql jika belum tersedia."""
    try:
        import pymysql
        print("✅ PyMySQL sudah terinstall!")
        return True
    except ImportError:
        print("📦 PyMySQL belum terinstall. Installing...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pymysql'])
            print("✅ PyMySQL berhasil diinstall!")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Gagal install PyMySQL: {e}")
            print("💡 Coba manual: pip install pymysql")
            return False

def create_database():
    """Membuat database ukmiverse_db jika belum ada."""
    try:
        # Import pymysql dinamis setelah dipastikan sudah terinstall
        import pymysql
        
        # Koneksi ke MySQL server (tanpa database spesifik)
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',  # Default XAMPP tidak ada password
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Cek apakah database sudah ada
            cursor.execute("SHOW DATABASES LIKE 'ukmiverse_db'")
            if cursor.fetchone():
                print("✅ Database 'ukmiverse_db' sudah ada!")
            else:
                # Buat database baru
                cursor.execute("CREATE DATABASE ukmiverse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
                print("✅ Database 'ukmiverse_db' berhasil dibuat!")
        
        connection.commit()
        connection.close()
        return True
        
    except ImportError:
        print("❌ PyMySQL tidak terinstall!")
        return False
    except Exception as e:
        error_msg = str(e)
        if "Can't connect" in error_msg or "Connection refused" in error_msg:
            print(f"❌ Error koneksi MySQL: {e}")
            print("\n🔧 Troubleshooting:")
            print("1. Pastikan XAMPP MySQL sudah running")
            print("2. Check di XAMPP Control Panel - MySQL harus berwarna hijau")
            print("3. Coba restart XAMPP jika masih error")
        else:
            print(f"❌ Error umum: {e}")
        return False

def test_connection():
    """Test koneksi ke database yang sudah dibuat."""
    try:
        import pymysql
        
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='ukmiverse_db',
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ Koneksi berhasil! MySQL Version: {version[0]}")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Test koneksi gagal: {e}")
        return False

def main():
    print("🚀 UKMiverse - Setup Database MySQL")
    print("=" * 50)
    
    # Step 0: Install PyMySQL jika perlu
    print("\n🔍 Step 0: Checking PyMySQL...")
    if not install_pymysql():
        print("❌ Tidak bisa install PyMySQL!")
        print("💡 Coba manual: pip install pymysql")
        sys.exit(1)
    
    # Step 1: Buat database
    print("\n📦 Step 1: Membuat database...")
    if not create_database():
        print("❌ Setup database gagal!")
        sys.exit(1)
    
    # Step 2: Test koneksi
    print("\n🔍 Step 2: Test koneksi...")
    if not test_connection():
        print("❌ Test koneksi gagal!")
        sys.exit(1)
    
    print("\n🎉 Setup database berhasil!")
    print("\n📋 Langkah selanjutnya:")
    print("1. cd backend")
    print("2. pip install -r requirements.txt")
    print("3. python run.py")
    print("\n💡 Backend akan otomatis membuat tabel dan data default!")
    print("📱 Akses phpMyAdmin: http://localhost/phpmyadmin")

if __name__ == "__main__":
    main()
