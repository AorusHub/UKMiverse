#!/usr/bin/env python3

import requests
import json
from datetime import datetime

def quick_test_endpoints():
    """Quick test of the main endpoints to see what's actually being returned"""
    
    print(f"=== Quick Endpoint Test - {datetime.now().strftime('%H:%M:%S')} ===")
    
    base_url = 'http://localhost:5000/api'
    
    # Test 1: UKM endpoint
    print("\n1. Testing UKM endpoint...")
    try:
        response = requests.get(f'{base_url}/ukm/', timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success! Found {len(data)} UKMs")
            
            if len(data) > 0:
                sample_ukm = data[0]
                print(f"   📋 Sample UKM structure:")
                print(f"      ID: {sample_ukm.get('id')}")
                print(f"      Nama: {sample_ukm.get('nama')}")
                print(f"      Name: {sample_ukm.get('name')}")
                print(f"      Category ID: {sample_ukm.get('category_id')} (type: {type(sample_ukm.get('category_id'))})")
                print(f"      Has category_id: {'category_id' in sample_ukm}")
                print(f"      All fields: {list(sample_ukm.keys())}")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Categories endpoint
    print("\n2. Testing Categories endpoint...")
    try:
        response = requests.get(f'{base_url}/ukm/categories', timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success! Found {len(data)} categories")
            
            for cat in data:
                print(f"      - ID: {cat.get('id')} (type: {type(cat.get('id'))}), Name: {cat.get('name')}")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Simple connectivity test
    print("\n3. Basic connectivity test...")
    try:
        response = requests.get(f'{base_url}/', timeout=5)
        print(f"   Base API Status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Basic connectivity failed: {e}")
    
    print("\n" + "="*50)
    print("If all tests show ✅, then the backend is working correctly.")
    print("If you see ❌, then there's an issue with the backend.")
    print("="*50)

if __name__ == "__main__":
    quick_test_endpoints()
