@echo off
echo ===============================================
echo     UKMIVERSE - QUICK FIX CATEGORIES
echo ===============================================
echo.

cd /d "c:\Users\moham\Documents\Abdul\Unhas\Semester4\Web\ukmiverse_project\backend"

echo Checking backend status...
echo.

python -c "import requests; r = requests.get('http://localhost:5000/api/ukm/', timeout=2); print('✅ Backend is running')" 2>nul
if %errorlevel% == 0 (
    echo Backend is already running! Testing endpoints...
    echo.
    python test_endpoints.py
    echo.
    echo ===============================================
    echo NEXT STEPS:
    echo 1. Go to your browser
    echo 2. Open AdminPanel 
    echo 3. Press F12 to open Developer Tools
    echo 4. Click "Refresh Data" button
    echo 5. Check if categories now show correctly
    echo ===============================================
    pause
) else (
    echo Backend is not running. Starting it now...
    echo.
    echo After backend starts:
    echo 1. Go to your browser
    echo 2. Open AdminPanel
    echo 3. Categories should now work correctly
    echo.
    echo Starting backend...
    python run.py
)

echo.
pause
