@echo off
echo ===============================================
echo    🚀 UKMiverse Backend Startup Script
echo ===============================================
echo.

echo 📁 Navigating to backend directory...
cd /d "c:\Users\moham\Documents\Abdul\Unhas\Semester4\Web\ukmiverse_project\backend"

echo 📋 Current directory: %cd%
echo.

echo 🔍 Checking if run.py exists...
if exist run.py (
    echo ✅ run.py found!
) else (
    echo ❌ run.py not found!
    echo Please check if you're in the correct directory.
    pause
    exit /b 1
)

echo.
echo 🐍 Starting Python Flask server...
echo 🌐 Server will be available at: http://localhost:5000
echo 📊 Admin Panel API: http://localhost:5000/api/ukm/
echo.
echo ⚠️  Press Ctrl+C to stop the server
echo ===============================================
echo.

python run.py

echo.
echo 🛑 Server stopped.
pause
