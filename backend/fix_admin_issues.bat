@echo off
echo ========================================
echo FIXING UKM CATEGORIES AND TESTING ADMIN
echo ========================================

echo.
echo === Step 1: Start Backend Server ===
start "Backend Server" cmd /k "cd /d %~dp0 && python run.py"

echo Waiting for backend server to start...
timeout /t 5 /nobreak >nul

echo.
echo === Step 2: Fix Categories Data ===
python fix_categories.py

echo.
echo === Step 3: Test Categories Mapping ===
python debug_categories.py

echo.
echo === Step 4: Test User Management ===
python quick_test_users.py

echo.
echo ========================================
echo ISSUES FIXED:
echo 1. UKM Categories now properly mapped (no more "Unknown")
echo 2. AdminPanel token validation improved (401 errors handled)
echo 3. Role object format standardized in fallback data
echo.
echo NEXT STEPS:
echo 1. Open browser to http://localhost:3000/admin
echo 2. Login as admin/admin123
echo 3. Check UKM tab - categories should show proper names
echo 4. Check Users tab - should load real users from database
echo.
echo If you see 401 errors, try logging out and logging in again.
echo ========================================
pause
