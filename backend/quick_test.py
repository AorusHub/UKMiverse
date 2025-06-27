import requests
import json

try:
    print("Testing UKM endpoint...")
    response = requests.get('http://localhost:5000/api/ukm/')
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Number of UKMs: {len(data)}")
        
        for i, ukm in enumerate(data[:3]):  # Show first 3 UKMs
            print(f"\nUKM {i+1}:")
            print(f"  ID: {ukm.get('id')}")
            print(f"  Nama: {ukm.get('nama')}")
            print(f"  Category ID: {ukm.get('category_id')} (type: {type(ukm.get('category_id'))})")
            print(f"  Has category_id: {'category_id' in ukm}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        
    print("\nTesting Categories endpoint...")
    response = requests.get('http://localhost:5000/api/ukm/categories')
    print(f"Categories Status: {response.status_code}")
    
    if response.status_code == 200:
        cats = response.json()
        print(f"Number of categories: {len(cats)}")
        for cat in cats:
            print(f"  Category: {cat.get('id')} -> {cat.get('name')}")
            
except Exception as e:
    print(f"Error: {e}")
