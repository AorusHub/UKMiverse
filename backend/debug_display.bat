@echo off
echo ========================================
echo DEBUGGING FRONTEND CATEGORY DISPLAY
echo ========================================

echo.
echo Step 1: Starting backend server...
start "Backend Server" cmd /k "python run.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 2: Testing backend endpoints...
python debug_frontend_data.py

echo.
echo ========================================
echo DEBUGGING COMPLETED!
echo ========================================
echo.
echo Next steps:
echo 1. Backend server is running
echo 2. Open browser DevTools (F12) 
echo 3. Go to http://localhost:3000/admin
echo 4. Login as admin/admin123
echo 5. Go to UKM tab
echo 6. Check console logs for detailed mapping debug info
echo.
echo Look for logs starting with "🔍 UKM:" in browser console
echo This will show exactly what data frontend receives
echo and how the category mapping works.
echo.
pause
