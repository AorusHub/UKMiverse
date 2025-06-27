@echo off
echo 🚀 UKMiverse Quick Setup
echo ========================

echo.
echo 📦 Step 1: Installing Python dependencies...
cd backend
pip install -r requirements.txt

echo.
echo 🎯 Step 2: Setup complete!
echo.
echo 📋 Manual steps needed:
echo 1. Start XAMPP (Apache + MySQL)
echo 2. Create database 'ukmiverse_db' in phpMyAdmin
echo 3. Run: python run.py (in backend folder)
echo.
echo 🔗 URLs:
echo - phpMyAdmin: http://localhost/phpmyadmin
echo - Backend API: http://localhost:5000
echo - Frontend: http://localhost:5176
echo.
echo 🔑 Default Admin:
echo Username: admin
echo Password: admin123
echo.
pause
