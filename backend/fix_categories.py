#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, UKM, Category

def fix_categories():
    app = create_app()
    
    with app.app_context():
        print("=== FIXING UKM CATEGORIES ===")
        
        # 1. Check existing categories
        print("\n1. Checking existing categories...")
        categories = Category.query.all()
        print(f"Found {len(categories)} categories:")
        for cat in categories:
            print(f"  - ID: {cat.id}, Name: {cat.name}")
        
        # 2. If no categories, create them
        if len(categories) == 0:
            print("\n2. Creating default categories...")
            default_categories = [
                "Unit Kegiatan Olahraga",
                "Unit Kegiatan Kesenian", 
                "Unit Kegiatan Khusus"
            ]
            
            for cat_name in default_categories:
                category = Category(name=cat_name)
                db.session.add(category)
            
            db.session.commit()
            
            # Refresh categories
            categories = Category.query.all()
            print(f"Created {len(categories)} categories:")
            for cat in categories:
                print(f"  - ID: {cat.id}, Name: {cat.name}")
        
        # 3. Check UKMs and their categories
        print("\n3. Checking UKM categories...")
        ukms = UKM.query.all()
        print(f"Found {len(ukms)} UKMs:")
        
        category_mapping = {
            "catur": 3,      # Unit Kegiatan Khusus
            "musik": 2,      # Unit Kegiatan Kesenian
            "debat": 3,      # Unit Kegiatan Khusus
            "basket": 1,     # Unit Kegiatan Olahraga
            "persatuan": 3   # Unit Kegiatan Khusus
        }
        
        for ukm in ukms:
            print(f"  - {ukm.nama} (current category_id: {ukm.category_id})")
            
            # Auto-assign category based on name
            ukm_name_lower = ukm.nama.lower()
            assigned = False
            
            for keyword, cat_id in category_mapping.items():
                if keyword in ukm_name_lower:
                    if ukm.category_id != cat_id:
                        print(f"    → Updating category_id from {ukm.category_id} to {cat_id}")
                        ukm.category_id = cat_id
                        assigned = True
                    break
            
            if not assigned and (ukm.category_id is None or ukm.category_id > len(categories)):
                # Default to category 3 (Unit Kegiatan Khusus)
                print(f"    → Setting default category_id to 3")
                ukm.category_id = 3
        
        # 4. Commit changes
        try:
            db.session.commit()
            print("\n✅ Categories fixed successfully!")
            
            # 5. Verify the fix
            print("\n4. Verification:")
            ukms = UKM.query.all()
            for ukm in ukms:
                category = Category.query.get(ukm.category_id)
                category_name = category.name if category else "STILL UNKNOWN"
                print(f"  - {ukm.nama} → {category_name}")
                
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_categories()
