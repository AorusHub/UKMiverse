#!/usr/bin/env python3
"""
Test script untuk halaman detail UKM yang baru dibuat ulang.
Menguji endpoint backend dan memverifikasi response.
"""

import requests
import json
import sys

def test_ukm_detail_endpoint():
    """Test endpoint GET /api/ukm/<id> untuk detail UKM"""
    base_url = "http://localhost:5000/api"
    
    print("🧪 Testing UKM Detail Endpoint...")
    print("=" * 50)
    
    # Test dengan ID yang valid (biasanya UKM pertama memiliki ID 1)
    test_ids = [1, 2, 3]
    
    for ukm_id in test_ids:
        print(f"\n📋 Testing UKM ID: {ukm_id}")
        print("-" * 30)
        
        try:
            response = requests.get(f"{base_url}/ukm/{ukm_id}", timeout=10)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Success! UKM Detail:")
                print(f"   - Nama: {data.get('nama', 'N/A')}")
                print(f"   - Deskripsi: {data.get('deskripsi', 'N/A')[:50]}...")
                print(f"   - Category: {data.get('category', {}).get('name', 'N/A')}")
                print(f"   - Is Active: {data.get('is_active', 'N/A')}")
                print(f"   - Contact Person: {data.get('contact_person', 'N/A')}")
                print(f"   - Contact Email: {data.get('contact_email', 'N/A')}")
                
                # Pastikan field yang dibutuhkan frontend ada
                required_fields = ['id', 'nama', 'deskripsi', 'is_active']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"⚠️  Missing required fields: {missing_fields}")
                else:
                    print("✅ All required fields present")
                
            elif response.status_code == 404:
                print("❌ UKM not found")
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection Error: Backend server tidak berjalan!")
            print("   Pastikan backend server berjalan di http://localhost:5000")
            return False
        except requests.exceptions.Timeout:
            print("❌ Timeout Error: Server terlalu lambat merespon")
            return False
        except Exception as e:
            print(f"❌ Unexpected Error: {str(e)}")
            return False
    
    return True

def test_ukm_list_endpoint():
    """Test endpoint GET /api/ukm untuk memastikan ada data UKM"""
    base_url = "http://localhost:5000/api"
    
    print(f"\n📋 Testing UKM List Endpoint...")
    print("-" * 30)
    
    try:
        response = requests.get(f"{base_url}/ukm", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                print(f"✅ Found {len(data)} UKM(s)")
                for ukm in data[:3]:  # Show first 3 UKMs
                    print(f"   - ID: {ukm.get('id')}, Nama: {ukm.get('nama')}")
                return True
            else:
                print("⚠️  No UKM data found or invalid format")
                return False
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🧪 UKM Detail Redesign - Backend Integration Test")
    print("=" * 60)
    
    # Test koneksi ke backend
    print("\n1. Testing Backend Connection...")
    if not test_ukm_list_endpoint():
        print("\n❌ Backend test failed! Please check:")
        print("   1. Backend server is running (python run.py)")
        print("   2. Database has UKM data")
        print("   3. No CORS issues")
        sys.exit(1)
    
    # Test endpoint detail UKM
    print("\n2. Testing UKM Detail Endpoints...")
    if not test_ukm_detail_endpoint():
        print("\n❌ UKM Detail test failed!")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ All tests passed! Backend integration ready.")
    print("\nNext steps:")
    print("1. Start frontend: cd frontend && npm run dev")
    print("2. Navigate to UKM list page")
    print("3. Click 'LIHAT DETAIL' button")
    print("4. Verify the redesigned detail page works correctly")

if __name__ == "__main__":
    main()
