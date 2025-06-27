@echo off
echo ===============================================
echo      STARTING UKMIVERSE BACKEND SERVER
echo ===============================================
echo.

cd /d "c:\Users\moham\Documents\Abdul\Unhas\Semester4\Web\ukmiverse_project\backend"

echo Checking if server is already running...
python -c "import requests; r = requests.get('http://localhost:5000/api/ukm/', timeout=2); print('Server already running')" 2>nul
if %errorlevel% == 0 (
    echo Server is already running on http://localhost:5000
    echo.
    goto :test_api
)

echo Starting Flask server...
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python run.py

:test_api
echo.
echo Testing API endpoints...
python quick_test.py
echo.
pause
