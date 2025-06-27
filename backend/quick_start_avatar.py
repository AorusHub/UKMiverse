#!/usr/bin/env python3
"""
Quick Start Script untuk Test Sistem Avatar
- Start server Flask
- Test basic functionality
- Provide easy commands
"""

import subprocess
import sys
import time
import requests
import json
from pathlib import Path

def print_banner():
    print("🚀 UKMiverse Avatar System - Quick Start")
    print("=" * 50)

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking dependencies...")
    
    try:
        import flask
        print("✅ Flask installed")
    except ImportError:
        print("❌ Flask not installed - run: pip install flask")
        return False
    
    try:
        import PIL
        print("✅ Pillow installed")
    except ImportError:
        print("❌ Pillow not installed - run: pip install Pillow")
        return False
    
    return True

def check_structure():
    """Check directory structure"""
    print("\n📁 Checking directory structure...")
    
    required_dirs = [
        "app",
        "app/static/uploads/avatars",
        "app/services"
    ]
    
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path} missing")
            return False
    
    return True

def start_server():
    """Start Flask server"""
    print("\n🌐 Starting Flask server...")
    print("⏰ Please wait, server is starting...")
    print("📍 Server will be available at: http://localhost:5000")
    print("📖 Swagger docs at: http://localhost:5000/")
    print("\n💡 To stop server: Press Ctrl+C")
    print("=" * 50)
    
    try:
        # Start server
        subprocess.run([sys.executable, "run.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")

def test_server_health(max_attempts=10):
    """Test if server is running"""
    print("🔍 Testing server health...")
    
    for attempt in range(max_attempts):
        try:
            response = requests.get("http://localhost:5000/", timeout=2)
            if response.status_code == 200:
                print("✅ Server is running!")
                return True
        except:
            pass
        
        print(f"⏳ Attempt {attempt + 1}/{max_attempts}...")
        time.sleep(1)
    
    print("❌ Server not responding")
    return False

def show_test_commands():
    """Show useful test commands"""
    print("\n🧪 Test Commands:")
    print("=" * 30)
    print("1. Test basic setup:")
    print("   python basic_test.py")
    print()
    print("2. Test full avatar system:")
    print("   python test_avatar_local.py")
    print()
    print("3. Check API documentation:")
    print("   Open browser: http://localhost:5000/")
    print()
    print("4. Test endpoints manually:")
    print("   POST /api/auth/login - Login first")
    print("   GET /api/profile/ - Get profile")
    print("   POST /api/profile/avatar/upload - Upload file")
    print()

def show_frontend_info():
    """Show frontend information"""
    print("🎨 Frontend Info:")
    print("=" * 20)
    print("1. Start React frontend:")
    print("   cd ../frontend")
    print("   npm run dev")
    print()
    print("2. Frontend will be at:")
    print("   http://localhost:5173")
    print()
    print("3. Test avatar upload:")
    print("   - Login to application")
    print("   - Go to Profile page")
    print("   - Click avatar to upload")
    print()

def main():
    """Main function"""
    print_banner()
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Please install missing dependencies first!")
        return
    
    # Check structure
    if not check_structure():
        print("\n❌ Directory structure incomplete!")
        return
    
    print("\n✅ All checks passed!")
    
    # Show options
    print("\n🎯 What would you like to do?")
    print("1. Start Flask server")
    print("2. Run basic tests")
    print("3. Show test commands")
    print("4. Show frontend info")
    print("5. Exit")
    
    while True:
        try:
            choice = input("\nEnter choice (1-5): ").strip()
            
            if choice == "1":
                start_server()
                break
            elif choice == "2":
                print("\n🧪 Running basic tests...")
                subprocess.run([sys.executable, "basic_test.py"])
                break
            elif choice == "3":
                show_test_commands()
                break
            elif choice == "4":
                show_frontend_info()
                break
            elif choice == "5":
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid choice. Please enter 1-5.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break

if __name__ == "__main__":
    main()
