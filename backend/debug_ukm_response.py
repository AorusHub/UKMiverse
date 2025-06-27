#!/usr/bin/env python3

import requests
import json

def debug_ukm_data():
    """Debug what UKM data actually looks like from the backend"""
    base_url = 'http://localhost:5000/api'
    
    # First login to get token
    login_url = f'{base_url}/auth/login'
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        print("=== LOGGING IN ===")
        login_response = requests.post(login_url, json=login_data)
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            print(f"Response: {login_response.text}")
            return
            
        token = login_response.json().get('access_token')
        headers = {'Authorization': f'Bearer {token}'}
        
        print("✅ Login successful")
        
        # Get UKM data
        print("\n=== FETCHING UKM DATA ===")
        ukm_url = f'{base_url}/ukm'
        ukm_response = requests.get(ukm_url, headers=headers)
        
        if ukm_response.status_code == 200:
            ukm_data = ukm_response.json()
            print(f"UKM Response Status: {ukm_response.status_code}")
            print(f"UKM Data Structure: {type(ukm_data)}")
            
            if isinstance(ukm_data, list):
                print(f"Number of UKMs: {len(ukm_data)}")
                if len(ukm_data) > 0:
                    print(f"\n=== FIRST UKM ANALYSIS ===")
                    first_ukm = ukm_data[0]
                    print(f"UKM Keys: {list(first_ukm.keys())}")
                    print(f"Raw UKM Data: {json.dumps(first_ukm, indent=2)}")
                    
                    # Check category_id specifically
                    print(f"\n=== CATEGORY ANALYSIS ===")
                    print(f"Has 'category_id': {'category_id' in first_ukm}")
                    print(f"category_id value: {first_ukm.get('category_id')} (type: {type(first_ukm.get('category_id'))})")
                    print(f"Has 'category': {'category' in first_ukm}")
                    if 'category' in first_ukm:
                        print(f"category value: {first_ukm.get('category')}")
                    
                    # Check all UKMs
                    print(f"\n=== ALL UKM CATEGORY IDS ===")
                    for i, ukm in enumerate(ukm_data):
                        cat_id = ukm.get('category_id')
                        print(f"UKM {i+1} ({ukm.get('name', 'Unknown')}): category_id = {cat_id} (type: {type(cat_id)})")
                        
            elif isinstance(ukm_data, dict):
                print(f"UKM Data Keys: {list(ukm_data.keys())}")
                print(f"Raw UKM Data: {json.dumps(ukm_data, indent=2)}")
            else:
                print(f"Unexpected UKM data type: {type(ukm_data)}")
                print(f"Raw UKM Data: {ukm_data}")
        else:
            print(f"❌ Failed to fetch UKM data: {ukm_response.status_code}")
            print(f"Response: {ukm_response.text}")
            
        # Get Categories data  
        print("\n=== FETCHING CATEGORIES DATA ===")
        categories_url = f'{base_url}/ukm/categories'
        categories_response = requests.get(categories_url, headers=headers)
        
        if categories_response.status_code == 200:
            categories_data = categories_response.json()
            print(f"Categories Response Status: {categories_response.status_code}")
            print(f"Categories Data: {json.dumps(categories_data, indent=2)}")
            
            if isinstance(categories_data, list):
                print(f"\n=== CATEGORIES MAPPING ===")
                for cat in categories_data:
                    print(f"Category ID: {cat.get('id')} (type: {type(cat.get('id'))}) -> Name: {cat.get('name')}")
        else:
            print(f"❌ Failed to fetch categories: {categories_response.status_code}")
            print(f"Response: {categories_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_ukm_data()
