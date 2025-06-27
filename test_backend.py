#!/usr/bin/env python3
"""
Quick test script untuk memeriksa backend API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_endpoint(endpoint, description):
    try:
        print(f"\n🔍 Testing {description}...")
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Data count: {len(data) if isinstance(data, list) else 'Object'}")
            if isinstance(data, list) and len(data) > 0:
                print(f"📄 Sample data: {json.dumps(data[0], indent=2)}")
            elif not isinstance(data, list):
                print(f"📄 Data: {json.dumps(data, indent=2)}")
        else:
            print(f"❌ Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Connection failed - Backend might not be running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Testing UKMiverse Backend APIs...")
    
    # Test endpoints
    test_endpoint("/ukm/", "UKM endpoint")
    test_endpoint("/ukm/categories", "Categories endpoint")
    
    print("\n" + "="*50)
    print("💡 If backend is not running:")
    print("   1. cd backend")
    print("   2. python run.py")
    print("="*50)
