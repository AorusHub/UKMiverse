@echo off
echo ===============================================
echo UKM Category Display Fix - Comprehensive
echo ===============================================

cd /d "c:\Users\moham\Documents\Abdul\Unhas\Semester4\Web\ukmiverse_project\backend"

echo.
echo Step 1: Fix database category_id values
echo -----------------------------------------------
python fix_ukm_categories_direct.py

echo.
echo Step 2: Test backend API response
echo -----------------------------------------------
python test_api_response.py

echo.
echo Step 3: Testing if we can start backend...
echo -----------------------------------------------
echo Starting Flask backend (this will show any errors)
echo Press Ctrl+C to stop the server after testing
echo.
python run.py

pause
