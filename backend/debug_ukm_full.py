#!/usr/bin/env python3

import requests
import json

def test_ukm_endpoint():
    """Test UKM endpoint to see exactly what data is being returned"""
    
    # First login to get token
    login_url = 'http://localhost:5000/api/auth/login'
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        print("=== Step 1: Login ===")
        login_response = requests.post(login_url, json=login_data)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return
            
        token = login_response.json().get('access_token')
        print(f"✅ Login successful, token: {token[:20]}...")
        
        # Now test UKM endpoint
        ukm_url = 'http://localhost:5000/api/ukm/'
        headers = {'Authorization': f'Bearer {token}'}
        
        print(f"\n=== Step 2: Get UKM Data ===")
        print(f"URL: {ukm_url}")
        print(f"Headers: {headers}")
        
        ukm_response = requests.get(ukm_url, headers=headers)
        
        print(f"Response Status: {ukm_response.status_code}")
        
        if ukm_response.status_code == 200:
            ukm_data = ukm_response.json()
            print(f"✅ UKM data retrieved successfully")
            print(f"Raw Response: {json.dumps(ukm_data, indent=2)}")
            
            if isinstance(ukm_data, list) and len(ukm_data) > 0:
                print(f"\n=== UKM Data Analysis ===")
                print(f"Number of UKMs: {len(ukm_data)}")
                
                for i, ukm in enumerate(ukm_data):
                    print(f"\n--- UKM #{i+1} ---")
                    print(f"ID: {ukm.get('id')}")
                    print(f"Name: {ukm.get('name')}")
                    print(f"Category ID: {ukm.get('category_id')} (type: {type(ukm.get('category_id'))})")
                    print(f"Has category_id field: {'category_id' in ukm}")
                    print(f"All fields: {list(ukm.keys())}")
                    
                    if 'category_id' in ukm and ukm['category_id'] is not None:
                        print(f"✅ Category ID present: {ukm['category_id']}")
                    else:
                        print(f"❌ Category ID missing or None")
                        
        else:
            print(f"❌ Failed to get UKM data: {ukm_response.status_code}")
            try:
                error_data = ukm_response.json()
                print(f"Error: {error_data}")
            except:
                print(f"Error: {ukm_response.text}")
                
        # Also test categories endpoint
        print(f"\n=== Step 3: Get Categories Data ===")
        categories_url = 'http://localhost:5000/api/ukm/categories'
        
        categories_response = requests.get(categories_url, headers=headers)
        print(f"Categories Response Status: {categories_response.status_code}")
        
        if categories_response.status_code == 200:
            categories_data = categories_response.json()
            print(f"✅ Categories data retrieved successfully")
            print(f"Categories Raw Response: {json.dumps(categories_data, indent=2)}")
            
            if isinstance(categories_data, list):
                print(f"\n=== Categories Analysis ===")
                print(f"Number of categories: {len(categories_data)}")
                
                for cat in categories_data:
                    print(f"Category ID: {cat.get('id')} (type: {type(cat.get('id'))}), Name: {cat.get('name')}")
        else:
            print(f"❌ Failed to get categories: {categories_response.status_code}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_ukm_endpoint()
