@echo off
echo ================================================
echo COMPLETE DEBUGGING: CATEGORY DISPLAY ISSUE
echo ================================================

echo.
echo === STEP 1: VERIFY DATABASE ===
python simple_fix.py

echo.
echo === STEP 2: START BACKEND ===
start "Backend Server" cmd /k "cd /d %~dp0 && python run.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo === STEP 3: TEST BACKEND DATA ===
python debug_frontend_data.py

echo.
echo ================================================
echo ISSUE DIAGNOSIS & SOLUTIONS
echo ================================================
echo.
echo The issue could be:
echo 1. Type mismatch between category_id (string) and id (number)
echo 2. Browser cache showing old data
echo 3. Frontend not refreshing after database fix
echo.
echo SOLUTIONS APPLIED:
echo ✅ Added type conversion: parseInt(category_id) === parseInt(id)
echo ✅ Added detailed console logging for debugging
echo ✅ Added "Refresh Data" button in AdminPanel
echo ✅ Enhanced error display to show actual category_id values
echo.
echo NEXT STEPS:
echo 1. Backend is running
echo 2. Open http://localhost:3000/admin in browser
echo 3. Login as admin/admin123
echo 4. Go to UKM tab
echo 5. Click "Refresh Data" button
echo 6. Open DevTools (F12) and check Console tab
echo 7. Look for logs starting with "🔍 UKM:" 
echo.
echo If categories still show "Unknown", check the console logs
echo to see the exact data types and values being compared.
echo ================================================
pause
