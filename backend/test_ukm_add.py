#!/usr/bin/env python3
"""
Test script untuk menguji penambahan UKM baru dengan fields prestasi dan kegiatan_rutin
"""

import requests
import json

def test_ukm_add():
    """Test adding new UKM with prestasi and kegiatan_rutin fields"""
    
    # API base URL
    base_url = "http://localhost:5000/api"
    
    print("🔍 Testing UKM Add functionality...")
    
    # First, get admin token
    print("\n1. Getting admin token...")
    login_data = {
        "username": "admin",
        "password": "password123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/auth/login", json=login_data)
        if login_response.status_code == 200:
            token = login_response.json()['access_token']
            print("✅ Admin login successful")
        else:
            print(f"❌ Admin login failed: {login_response.status_code}")
            print(login_response.text)
            return
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return
    
    # Get categories first
    print("\n2. Getting categories...")
    try:
        categories_response = requests.get(f"{base_url}/ukm/categories")
        if categories_response.status_code == 200:
            categories = categories_response.json()
            print(f"✅ Categories fetched: {len(categories)} categories")
            if categories:
                category_id = categories[0]['id']
                print(f"🎯 Using category ID: {category_id}")
            else:
                print("❌ No categories found")
                return
        else:
            print(f"❌ Failed to fetch categories: {categories_response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error fetching categories: {e}")
        return
    
    # Test adding new UKM
    print("\n3. Adding new UKM...")
    new_ukm_data = {
        "nama": "UKM Test CRUD",
        "deskripsi": "UKM untuk testing fungsi CRUD dengan prestasi dan kegiatan rutin",
        "category_id": category_id,
        "prestasi": "• Test Prestasi 1\n• Test Prestasi 2\n• Test Prestasi 3",
        "kegiatan_rutin": "• Latihan rutin setiap Senin dan Rabu\n• Pertemuan bulanan setiap awal bulan\n• Workshop skill development",
        "logo_url": "https://via.placeholder.com/300x200",
        "contact_person": "Admin Test",
        "contact_email": "test@ukm.com",
        "contact_phone": "081234567890"
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        add_response = requests.post(f"{base_url}/ukm/", json=new_ukm_data, headers=headers)
        if add_response.status_code == 201:
            new_ukm = add_response.json()
            print("✅ UKM added successfully!")
            print(f"📋 UKM ID: {new_ukm['id']}")
            print(f"📋 UKM Name: {new_ukm['nama']}")
            print(f"📋 Has prestasi: {'prestasi' in new_ukm and bool(new_ukm['prestasi'])}")
            print(f"📋 Has kegiatan_rutin: {'kegiatan_rutin' in new_ukm and bool(new_ukm['kegiatan_rutin'])}")
            
            # Test retrieving the UKM
            print(f"\n4. Retrieving added UKM (ID: {new_ukm['id']})...")
            get_response = requests.get(f"{base_url}/ukm/{new_ukm['id']}")
            if get_response.status_code == 200:
                retrieved_ukm = get_response.json()
                print("✅ UKM retrieved successfully!")
                print(f"📋 Prestasi: {retrieved_ukm.get('prestasi', 'N/A')}")
                print(f"📋 Kegiatan Rutin: {retrieved_ukm.get('kegiatan_rutin', 'N/A')}")
            else:
                print(f"❌ Failed to retrieve UKM: {get_response.status_code}")
                
        else:
            print(f"❌ Failed to add UKM: {add_response.status_code}")
            print(add_response.text)
    except Exception as e:
        print(f"❌ Error adding UKM: {e}")

if __name__ == "__main__":
    test_ukm_add()
