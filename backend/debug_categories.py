#!/usr/bin/env python3

import requests
import json

def debug_categories():
    try:
        print("=== DEBUGGING CATEGORIES & UKM MAPPING ===")
        
        # Test UKM endpoint
        print("\n1. Testing UKM endpoint...")
        ukm_response = requests.get('http://localhost:5000/api/ukm/')
        print(f"UKM Status: {ukm_response.status_code}")
        
        if ukm_response.status_code == 200:
            ukms = ukm_response.json()
            print(f"Found {len(ukms)} UKMs:")
            for ukm in ukms[:3]:  # Show first 3
                print(f"  - {ukm.get('nama')} (category_id: {ukm.get('category_id')})")
        
        # Test Categories endpoint  
        print("\n2. Testing Categories endpoint...")
        cat_response = requests.get('http://localhost:5000/api/ukm/categories')
        print(f"Categories Status: {cat_response.status_code}")
        
        if cat_response.status_code == 200:
            categories = cat_response.json()
            print(f"Found {len(categories)} categories:")
            for cat in categories:
                print(f"  - ID: {cat.get('id')}, Name: {cat.get('name')}")
                
        # Check mapping
        if ukm_response.status_code == 200 and cat_response.status_code == 200:
            print("\n3. Checking category mapping...")
            ukms = ukm_response.json()
            categories = cat_response.json()
            
            # Create category lookup
            cat_lookup = {cat['id']: cat['name'] for cat in categories}
            print(f"Category lookup: {cat_lookup}")
            
            print("\nUKM category mapping:")
            for ukm in ukms:
                category_id = ukm.get('category_id')
                category_name = cat_lookup.get(category_id, 'UNKNOWN')
                print(f"  - {ukm.get('nama')}: category_id={category_id} → {category_name}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_categories()
