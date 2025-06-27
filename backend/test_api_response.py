#!/usr/bin/env python3

import subprocess
import time
import requests
import json
import sys
import os

def test_backend_api():
    """Start backend and test API response"""
    
    print("=== Testing Backend API ===")
    
    # Test if backend is already running
    try:
        response = requests.get('http://localhost:5000/api/ukm/', timeout=2)
        print("✅ Backend already running")
        backend_running = True
    except requests.exceptions.RequestException:
        print("❌ Backend not running, will need to start it")
        backend_running = False
    
    if backend_running:
        print("\n=== Testing UKM Endpoint ===")
        try:
            response = requests.get('http://localhost:5000/api/ukm/')
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                ukm_data = response.json()
                print(f"✅ UKM endpoint successful")
                print(f"Number of UKMs: {len(ukm_data)}")
                
                print("\n=== UKM Data Analysis ===")
                for i, ukm in enumerate(ukm_data):
                    print(f"\nUKM #{i+1}:")
                    print(f"  ID: {ukm.get('id')}")
                    print(f"  Name: {ukm.get('nama')} / {ukm.get('name')}")
                    print(f"  Category ID: {ukm.get('category_id')} (type: {type(ukm.get('category_id'))})")
                    print(f"  Has category_id: {'category_id' in ukm}")
                    print(f"  Category object: {ukm.get('category')}")
                    print(f"  All fields: {list(ukm.keys())}")
                    
            else:
                print(f"❌ UKM endpoint failed: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error testing UKM endpoint: {e}")
    
        print("\n=== Testing Categories Endpoint ===")
        try:
            response = requests.get('http://localhost:5000/api/ukm/categories')
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                categories_data = response.json()
                print(f"✅ Categories endpoint successful")
                print(f"Number of categories: {len(categories_data)}")
                
                print("\n=== Categories Data ===")
                for cat in categories_data:
                    print(f"  Category ID: {cat.get('id')} (type: {type(cat.get('id'))}), Name: {cat.get('name')}")
                    
            else:
                print(f"❌ Categories endpoint failed: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error testing categories endpoint: {e}")
    
    else:
        print("❌ Cannot test API - backend is not running")
        print("To test:")
        print("1. Start backend: cd backend && python run.py")
        print("2. Run this script again")

if __name__ == "__main__":
    test_backend_api()
