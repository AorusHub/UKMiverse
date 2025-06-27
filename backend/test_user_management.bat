@echo off
echo Starting backend server and testing user management...

echo.
echo === Starting Backend Server ===
start "Backend Server" cmd /k "cd /d %~dp0 && python run.py"

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo === Testing User Management Endpoints ===
python quick_test_users.py

echo.
echo ========================================
echo INSTRUCTIONS:
echo 1. Backend server is running in a separate window
echo 2. Open browser to http://localhost:3000/admin
echo 3. Login as admin/admin123
echo 4. Go to Users tab to test the new user management features
echo 5. Try adding, editing, and deleting users
echo.
echo Features added:
echo - Add new users with role selection
echo - Edit user details (username, email, name, bio, phone, address, faculty, major)
echo - Change user password
echo - Change user role (admin/user)
echo - Delete users (except admin user ID 1)
echo.
pause
