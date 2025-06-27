@echo off
echo ===============================================
echo    🔍 UKMiverse Database & Backend Test
echo ===============================================
echo.

cd /d "c:\Users\moham\Documents\Abdul\Unhas\Semester4\Web\ukmiverse_project\backend"

echo 📋 Testing database connection...
python simple_db_test.py
echo.

echo 📋 Starting backend server (wait 5 seconds then test API)...
start "UKMiverse Backend" python run.py

timeout /t 5 /nobreak > nul

echo 📋 Testing API endpoints...
python test_login_response.py

echo.
echo ===============================================
echo Open these URLs to verify:
echo http://localhost:5000/api/ukm/
echo http://localhost:3000/admin
echo ===============================================
pause
