#!/usr/bin/env python3

import requests
import json

def debug_frontend_data():
    """Debug data yang diterima frontend dari backend"""
    
    try:
        print("=== DEBUGGING FRONTEND DATA MAPPING ===")
        
        # Test UKM endpoint
        print("\n1. Testing UKM endpoint...")
        ukm_response = requests.get('http://localhost:5000/api/ukm/')
        print(f"UKM Status: {ukm_response.status_code}")
        
        if ukm_response.status_code == 200:
            ukms = ukm_response.json()
            print(f"UKMs received by frontend:")
            print(json.dumps(ukms[:3], indent=2))  # Show first 3 UKMs
            
            print(f"\nUKM category_id analysis:")
            for ukm in ukms:
                print(f"  {ukm.get('nama')}: category_id = {ukm.get('category_id')} (type: {type(ukm.get('category_id'))})")
        
        # Test Categories endpoint  
        print(f"\n2. Testing Categories endpoint...")
        cat_response = requests.get('http://localhost:5000/api/ukm/categories')
        print(f"Categories Status: {cat_response.status_code}")
        
        if cat_response.status_code == 200:
            categories = cat_response.json()
            print(f"Categories received by frontend:")
            print(json.dumps(categories, indent=2))
            
            print(f"\nCategory id analysis:")
            for cat in categories:
                print(f"  {cat.get('name')}: id = {cat.get('id')} (type: {type(cat.get('id'))})")
                
        # Simulate frontend mapping logic
        if ukm_response.status_code == 200 and cat_response.status_code == 200:
            print(f"\n3. Simulating frontend mapping logic...")
            ukms = ukm_response.json()
            categories = cat_response.json()
            
            print(f"Frontend mapping simulation:")
            for ukm in ukms:
                # This is the exact logic from AdminPanel.jsx
                category = next((cat for cat in categories if cat['id'] == ukm['category_id']), None)
                categoryName = category['name'] if category else 'Unknown'
                
                print(f"  {ukm['nama']}")
                print(f"    - category_id: {ukm['category_id']} ({type(ukm['category_id'])})")
                print(f"    - matched category: {category}")
                print(f"    - result: {categoryName}")
                print()
        
        # Test data types specifically
        print(f"\n4. Data type analysis...")
        if ukm_response.status_code == 200 and cat_response.status_code == 200:
            ukms = ukm_response.json()
            categories = cat_response.json()
            
            # Check if there's a type mismatch
            print(f"Category IDs in categories: {[cat['id'] for cat in categories]}")
            print(f"Types: {[type(cat['id']) for cat in categories]}")
            
            print(f"category_ids in UKMs: {[ukm['category_id'] for ukm in ukms]}")
            print(f"Types: {[type(ukm['category_id']) for ukm in ukms]}")
            
            # Look for type mismatches
            mismatches = []
            for ukm in ukms:
                matched = False
                for cat in categories:
                    if cat['id'] == ukm['category_id']:
                        matched = True
                        break
                
                if not matched:
                    mismatches.append({
                        'ukm': ukm['nama'],
                        'category_id': ukm['category_id'],
                        'type': type(ukm['category_id'])
                    })
            
            if mismatches:
                print(f"\n❌ Found {len(mismatches)} mismatches:")
                for mismatch in mismatches:
                    print(f"  {mismatch}")
            else:
                print(f"\n✅ All UKMs should match categories correctly!")
                
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Backend server might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_frontend_data()
