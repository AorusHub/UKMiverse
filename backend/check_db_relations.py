#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, UKM, Category

def check_database_relations():
    app = create_app()
    
    with app.app_context():
        print("=== CHECKING DATABASE CATEGORIES & UKM RELATIONS ===")
        
        # 1. Check categories table
        print("\n1. CATEGORIES TABLE:")
        categories = Category.query.all()
        print(f"Found {len(categories)} categories:")
        for cat in categories:
            print(f"  ID: {cat.id}, Name: '{cat.name}'")
        
        # 2. Check UKM table
        print("\n2. UKM TABLE:")
        ukms = UKM.query.all()
        print(f"Found {len(ukms)} UKMs:")
        for ukm in ukms:
            print(f"  ID: {ukm.id}, Name: '{ukm.nama}', category_id: {ukm.category_id}")
        
        # 3. Check broken relations
        print("\n3. CHECKING BROKEN RELATIONS:")
        category_ids = {cat.id for cat in categories}
        print(f"Valid category IDs: {category_ids}")
        
        broken_ukms = []
        for ukm in ukms:
            if ukm.category_id not in category_ids:
                broken_ukms.append(ukm)
                print(f"  ❌ UKM '{ukm.nama}' has invalid category_id: {ukm.category_id}")
        
        if len(broken_ukms) == 0:
            print("  ✅ All UKM relations are valid!")
        else:
            print(f"  ❌ Found {len(broken_ukms)} UKMs with broken category relations")
        
        # 4. Show mapping that should exist
        print("\n4. SUGGESTED CATEGORY MAPPING:")
        category_mapping = {
            "Unit Kegiatan Olahraga": ["catur", "basket", "badminton", "futsal"],
            "Unit Kegiatan Kesenian": ["musik", "seni", "tari"],
            "Unit Kegiatan Khusus": ["debat", "persatuan", "fotografi", "bahasa"]
        }
        
        for cat_name, keywords in category_mapping.items():
            # Find category ID for this name
            category = Category.query.filter_by(name=cat_name).first()
            if category:
                print(f"\n  '{cat_name}' (ID: {category.id}) should contain:")
                for keyword in keywords:
                    matching_ukms = [ukm for ukm in ukms if keyword.lower() in ukm.nama.lower()]
                    for ukm in matching_ukms:
                        status = "✅" if ukm.category_id == category.id else "❌"
                        print(f"    {status} {ukm.nama} (current category_id: {ukm.category_id})")

if __name__ == "__main__":
    check_database_relations()
