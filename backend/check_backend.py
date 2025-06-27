#!/usr/bin/env python3

import requests
import json

def check_backend_data():
    """Check what the backend is actually returning"""
    
    print("=== Checking Backend Data ===")
    
    try:
        # Test UKM endpoint
        print("\n1. Testing UKM endpoint...")
        response = requests.get('http://localhost:5000/api/ukm/', timeout=3)
        
        if response.status_code == 200:
            ukms = response.json()
            print(f"✅ Got {len(ukms)} UKMs")
            
            for i, ukm in enumerate(ukms[:3]):  # Show first 3
                print(f"\nUKM {i+1}:")
                print(f"  ID: {ukm.get('id')}")
                print(f"  Nama: {ukm.get('nama')}")
                print(f"  Category ID: {ukm.get('category_id')}")
                print(f"  Is Fallback?: {'Fallback' in str(ukm.get('nama', ''))}")
        else:
            print(f"❌ UKM endpoint failed: {response.status_code}")
            
        # Test Categories endpoint
        print("\n2. Testing Categories endpoint...")
        response = requests.get('http://localhost:5000/api/ukm/categories', timeout=3)
        
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Got {len(categories)} categories")
            
            for cat in categories:
                print(f"  Category: ID={cat.get('id')}, Name={cat.get('name')}")
        else:
            print(f"❌ Categories endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("Backend might not be running!")

if __name__ == "__main__":
    check_backend_data()
