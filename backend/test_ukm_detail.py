#!/usr/bin/env python3
"""
Quick test untuk endpoint UKM detail
"""

import requests

API_BASE_URL = 'http://localhost:5000/api'

def test_ukm_detail():
    """Test endpoint UKM detail"""
    print("🔍 TESTING UKM DETAIL ENDPOINT")
    print("=" * 40)
    
    try:
        # Test get all UKMs first
        print("1. Getting all UKMs...")
        response = requests.get(f'{API_BASE_URL}/ukm/')
        
        if response.status_code == 200:
            ukms = response.json()
            print(f"✅ Found {len(ukms)} UKMs")
            
            if ukms:
                # Test detail for first UKM
                first_ukm = ukms[0]
                ukm_id = first_ukm['id']
                print(f"\n2. Testing detail for UKM ID {ukm_id}: {first_ukm['nama']}")
                
                detail_response = requests.get(f'{API_BASE_URL}/ukm/{ukm_id}')
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    print("✅ UKM detail endpoint working!")
                    print(f"   - ID: {detail_data['id']}")
                    print(f"   - Nama: {detail_data['nama']}")
                    print(f"   - Deskripsi: {detail_data['deskripsi'][:50]}...")
                    print(f"   - Category: {detail_data.get('category', {}).get('name', 'N/A')}")
                    print(f"   - Contact: {detail_data.get('contact', 'N/A')}")
                    
                    print(f"\n✅ Frontend URL will be: /ukm/{ukm_id}")
                    return True
                else:
                    print(f"❌ Failed to get UKM detail: {detail_response.status_code}")
                    print(f"Response: {detail_response.text}")
                    return False
            else:
                print("❌ No UKMs found to test")
                return False
        else:
            print(f"❌ Failed to get UKMs: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing UKM detail: {e}")
        return False

def test_invalid_ukm_id():
    """Test dengan ID UKM yang tidak ada"""
    print("\n3. Testing invalid UKM ID...")
    
    try:
        response = requests.get(f'{API_BASE_URL}/ukm/999999')
        
        if response.status_code == 404:
            print("✅ 404 handling works correctly")
            return True
        else:
            print(f"❌ Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing invalid ID: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 TESTING UKM DETAIL SYSTEM")
    print("=" * 50)
    
    # Test valid detail
    detail_works = test_ukm_detail()
    
    # Test invalid ID
    invalid_works = test_invalid_ukm_id()
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print(f"✅ UKM Detail Endpoint: {'PASS' if detail_works else 'FAIL'}")
    print(f"✅ Invalid ID Handling: {'PASS' if invalid_works else 'FAIL'}")
    
    if detail_works and invalid_works:
        print("\n🎉 ALL TESTS PASSED!")
        print("\n💡 Next steps:")
        print("1. Start React frontend: npm run dev")
        print("2. Go to: /daftar-ukm")
        print("3. Click 'LIHAT DETAIL' on any UKM card")
        print("4. Should navigate to /ukm/{id} and show detail page")
    else:
        print("\n❌ Some tests failed. Check the server and try again.")

if __name__ == '__main__':
    main()
