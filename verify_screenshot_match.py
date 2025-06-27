#!/usr/bin/env python3
"""
Final verification script untuk halaman detail UKM 
yang telah disesuaikan dengan screenshot.
"""

import requests
import json
import webbrowser
import os

def test_backend_endpoint():
    """Test backend endpoint untuk memastikan data tersedia"""
    print("🔍 Testing Backend Endpoint...")
    print("-" * 40)
    
    base_url = "http://localhost:5000/api"
    
    try:
        # Test UKM list
        response = requests.get(f"{base_url}/ukm", timeout=5)
        if response.status_code == 200:
            ukm_list = response.json()
            if ukm_list and len(ukm_list) > 0:
                print(f"✅ Found {len(ukm_list)} UKM(s) in database")
                
                # Test first UKM detail
                first_ukm_id = ukm_list[0]['id']
                detail_response = requests.get(f"{base_url}/ukm/{first_ukm_id}", timeout=5)
                
                if detail_response.status_code == 200:
                    ukm_detail = detail_response.json()
                    print(f"✅ UKM Detail accessible: {ukm_detail.get('nama', 'Unknown')}")
                    return True
                else:
                    print(f"❌ UKM Detail endpoint failed: {detail_response.status_code}")
                    return False
            else:
                print("⚠️  No UKM data found")
                return False
        else:
            print(f"❌ UKM List endpoint failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("   Make sure backend is running: cd backend && python run.py")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def open_preview():
    """Open preview HTML to see the design"""
    print("\n🎨 Opening Design Preview...")
    print("-" * 40)
    
    preview_path = os.path.join(os.path.dirname(__file__), "frontend", "ukm-detail-redesign-preview.html")
    
    if os.path.exists(preview_path):
        try:
            webbrowser.open(f"file:///{preview_path.replace(os.sep, '/')}")
            print("✅ Preview opened in browser")
            return True
        except Exception as e:
            print(f"❌ Failed to open preview: {str(e)}")
            return False
    else:
        print(f"❌ Preview file not found: {preview_path}")
        return False

def check_frontend_files():
    """Check if frontend files exist and are properly structured"""
    print("\n📁 Checking Frontend Files...")
    print("-" * 40)
    
    base_path = os.path.dirname(__file__)
    required_files = [
        "frontend/src/pages/UKMDetail.jsx",
        "frontend/src/pages/UKM.jsx", 
        "frontend/src/App.jsx",
        "frontend/package.json"
    ]
    
    all_exist = True
    for file_path in required_files:
        full_path = os.path.join(base_path, file_path)
        if os.path.exists(full_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - NOT FOUND")
            all_exist = False
    
    return all_exist

def main():
    """Main verification function"""
    print("🧪 UKM Detail - Screenshot Match Verification")
    print("=" * 60)
    
    # Check frontend files
    if not check_frontend_files():
        print("\n❌ Some frontend files are missing!")
        return
    
    # Test backend
    backend_ok = test_backend_endpoint()
    
    # Open preview
    preview_ok = open_preview()
    
    print("\n" + "=" * 60)
    print("📋 VERIFICATION SUMMARY")
    print("=" * 60)
    
    if backend_ok:
        print("✅ Backend: Ready")
    else:
        print("⚠️  Backend: Not ready (server may not be running)")
    
    if preview_ok:
        print("✅ Preview: Opened successfully")
    else:
        print("❌ Preview: Failed to open")
    
    print("\n🚀 NEXT STEPS:")
    print("1. Check the preview in your browser to see the design")
    print("2. Start backend: cd backend && python run.py")
    print("3. Start frontend: cd frontend && npm run dev")
    print("4. Test navigation: List UKM → LIHAT DETAIL → Detail Page")
    
    print("\n🎯 VERIFICATION CHECKLIST:")
    print("□ Logo besar (128px) dengan border putih")
    print("□ Judul 'UKM CATUR' besar dan bold")
    print("□ Background header soft purple-blue gradient")
    print("□ Dua kolom: Kegiatan Rutin (purple) & Prestasi (yellow)")
    print("□ Call-to-action dengan background purple")
    print("□ Tombol 'GABUNG SEKARANG' putih dengan shadow")
    print("□ Layout responsive untuk mobile")

if __name__ == "__main__":
    main()
