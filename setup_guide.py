"""
Script setup database MySQL untuk UKMiverse - Versi Simple
Panduan manual untuk setup XAMPP + MySQL
"""

def check_xampp():
    """Panduan untuk mengecek XAMPP"""
    print("🔍 STEP 1: Pastikan XAMPP Running")
    print("=" * 40)
    print("1. Buka XAMPP Control Panel")
    print("2. Start 'Apache' (untuk phpMySQL)")
    print("3. Start 'MySQL' (untuk database)")
    print("4. Pastikan status keduanya HIJAU ✅")
    print()

def create_database_manual():
    """Panduan membuat database manual"""
    print("📦 STEP 2: Buat Database")
    print("=" * 40)
    print("1. Buka browser: http://localhost/phpmyadmin")
    print("2. Click 'New' di sidebar kiri")
    print("3. Database name: ukmiverse_db")
    print("4. Collation: utf8mb4_unicode_ci")
    print("5. Click 'Create'")
    print()

def install_dependencies():
    """Panduan install dependencies"""
    print("🛠️ STEP 3: Install Dependencies")
    print("=" * 40)
    print("Jalankan command berikut:")
    print("cd backend")
    print("pip install -r requirements.txt")
    print()
    print("💡 Ini akan install:")
    print("- Flask & Flask-RESTX")
    print("- PyMySQL (MySQL connector)")
    print("- JWT & CORS support")
    print()

def run_backend():
    """Panduan menjalankan backend"""
    print("🚀 STEP 4: Jalankan Backend")
    print("=" * 40)
    print("cd backend")
    print("python run.py")
    print()
    print("✅ Backend akan otomatis:")
    print("- Buat tabel yang diperlukan")
    print("- Insert data default (admin user, kategori)")
    print("- Running di http://localhost:5000")
    print()

def verification():
    """Panduan verifikasi"""
    print("🔍 STEP 5: Verifikasi")
    print("=" * 40)
    print("1. Backend running: http://localhost:5000")
    print("2. Frontend running: http://localhost:5176")
    print("3. Database via phpMyAdmin: http://localhost/phpmyadmin")
    print()
    print("🔑 Login Admin Default:")
    print("Username: admin")
    print("Password: admin123")
    print()

def troubleshooting():
    """Common issues dan solusi"""
    print("🐛 TROUBLESHOOTING")
    print("=" * 40)
    print()
    print("❌ Error: 'Can't connect to MySQL server'")
    print("✅ Solusi: Pastikan MySQL running di XAMPP")
    print()
    print("❌ Error: 'No module named pymysql'")
    print("✅ Solusi: pip install pymysql")
    print()
    print("❌ Error: 'Database ukmiverse_db doesn't exist'")
    print("✅ Solusi: Buat database manual di phpMyAdmin")
    print()
    print("❌ Error: Frontend blank/error")
    print("✅ Solusi: Pastikan backend running dulu")
    print()

def main():
    print("🚀 UKMiverse - Setup MySQL Database")
    print("=" * 50)
    print("Tutorial step-by-step untuk setup database")
    print()
    
    check_xampp()
    create_database_manual()
    install_dependencies()
    run_backend()
    verification()
    troubleshooting()
    
    print("🎉 Setup selesai! UKMiverse siap digunakan!")
    print("📚 Dokumentasi lengkap: TUTORIAL_MYSQL_SETUP.md")

if __name__ == "__main__":
    main()
