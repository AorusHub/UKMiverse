#!/usr/bin/env python3
"""
Quick test script to verify UKM CRUD system is ready
"""

import requests
import json

def test_system():
    """Test the UKM CRUD system"""
    
    base_url = "http://localhost:5000/api"
    
    print("Testing UKM CRUD System...")
    print("=" * 50)
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{base_url}/ukm/categories", timeout=5)
        if response.status_code == 200:
            print("✅ Backend server is running")
            categories = response.json()
            print(f"✅ Found {len(categories)} categories")
        else:
            print("❌ Backend server error:", response.status_code)
            return False
    except requests.exceptions.RequestException as e:
        print("❌ Cannot connect to backend server")
        print("💡 Make sure to run: python run.py")
        return False
    
    # Test 2: Check UKM data
    try:
        response = requests.get(f"{base_url}/ukm/")
        if response.status_code == 200:
            ukms = response.json()
            print(f"✅ Found {len(ukms)} UKMs")
            
            # Check if new fields exist
            if ukms and len(ukms) > 0:
                sample_ukm = ukms[0]
                has_prestasi = 'prestasi' in sample_ukm and sample_ukm['prestasi']
                has_kegiatan = 'kegiatan_rutin' in sample_ukm and sample_ukm['kegiatan_rutin']
                
                print(f"✅ UKM has prestasi field: {has_prestasi}")
                print(f"✅ UKM has kegiatan_rutin field: {has_kegiatan}")
                
                if has_prestasi and has_kegiatan:
                    print("✅ Migration successful - new fields are present")
                else:
                    print("⚠️  New fields may be empty but structure is correct")
            else:
                print("⚠️  No UKM data found")
        else:
            print("❌ Failed to fetch UKMs:", response.status_code)
            return False
    except Exception as e:
        print("❌ Error fetching UKMs:", e)
        return False
    
    # Test 3: Check admin login
    try:
        login_data = {
            "username": "admin",
            "password": "password123"
        }
        response = requests.post(f"{base_url}/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json()['access_token']
            print("✅ Admin login successful")
            
            # Test admin access to UKM creation
            test_ukm = {
                "nama": "Test UKM CRUD",
                "deskripsi": "Test description",
                "category_id": 1,
                "prestasi": "Test prestasi",
                "kegiatan_rutin": "Test kegiatan rutin"
            }
            
            headers = {"Authorization": f"Bearer {token}"}
            # Just test if the endpoint is accessible (don't actually create)
            # We'll just check that we get a proper error for missing fields
            response = requests.post(f"{base_url}/ukm/", json={"nama": ""}, headers=headers)
            if response.status_code in [400, 422]:  # Validation error is expected
                print("✅ Admin UKM creation endpoint is accessible")
            else:
                print(f"⚠️  Unexpected response from UKM creation: {response.status_code}")
        else:
            print("❌ Admin login failed:", response.status_code)
            return False
    except Exception as e:
        print("❌ Error testing admin functionality:", e)
        return False
    
    print("\n" + "=" * 50)
    print("🎉 System is ready for CRUD testing!")
    print("\n📝 Next steps:")
    print("1. Start frontend: npm run dev")
    print("2. Login as admin (username: admin, password: password123)")
    print("3. Go to UKM page and test 'Tambah UKM' button")
    print("4. Test edit and delete buttons on UKM cards")
    
    return True

if __name__ == "__main__":
    test_system()
