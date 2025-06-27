#!/usr/bin/env python3
import os
import sys

# Change to backend directory
backend_path = r"c:\Users\moham\Documents\Abdul\Unhas\Semester4\Web\ukmiverse_project\backend"
os.chdir(backend_path)

# Add backend to Python path
sys.path.insert(0, backend_path)

print("🚀 Starting UKMiverse Backend...")
print(f"📁 Working directory: {os.getcwd()}")

try:
    # Import and run the Flask app
    from run import app
    app.run(debug=True, host='0.0.0.0', port=5000)
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're in the correct directory and run.py exists")
except Exception as e:
    print(f"❌ Error starting server: {e}")
