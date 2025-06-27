@echo off
echo ================================
echo FIXING UKM CATEGORY RELATIONS
echo ================================

echo.
echo Step 1: Checking current database state...
python check_simple.py

echo.
echo Step 2: Fixing database relations...
python simple_fix.py

echo.
echo Step 3: Starting backend server...
start "Backend Server" cmd /k "python run.py"

echo.
echo Step 4: Testing endpoints...
timeout /t 3 /nobreak >nul
python debug_categories.py

echo.
echo ================================
echo DATABASE FIX COMPLETED!
echo ================================
echo.
echo Next steps:
echo 1. Backend server is running in another window
echo 2. Open browser to http://localhost:3000/admin
echo 3. Login as admin/admin123
echo 4. Check UKM tab - categories should now show proper names
echo.
echo The following categories have been set up:
echo - Unit Kegiatan Olahraga (for sports UKMs)
echo - Unit Kegiatan Kesenian (for arts UKMs)  
echo - Unit Kegiatan Khusus (for special UKMs)
echo.
pause
