#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, UKM, Category

def fix_database_relations():
    app = create_app()
    
    with app.app_context():
        print("=== FIXING DATABASE CATEGORIES & UKM RELATIONS ===")
        
        # 1. Check existing categories
        print("\n1. Checking existing categories...")
        categories = Category.query.all()
        print(f"Found {len(categories)} categories:")
        for cat in categories:
            print(f"  ID: {cat.id}, Name: '{cat.name}'")
        
        # 2. Create default categories if needed
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
                print(f"  + Created: {cat_name}")
            
            try:
                db.session.commit()
                print("  ✅ Categories created successfully!")
                
                # Refresh categories
                categories = Category.query.all()
                print(f"  Updated categories count: {len(categories)}")
                for cat in categories:
                    print(f"    ID: {cat.id}, Name: '{cat.name}'")
                    
            except Exception as e:
                db.session.rollback()
                print(f"  ❌ Error creating categories: {e}")
                return
        
        # 3. Check UKMs
        print("\n3. Checking UKMs...")
        ukms = UKM.query.all()
        print(f"Found {len(ukms)} UKMs:")
        for ukm in ukms:
            print(f"  ID: {ukm.id}, Name: '{ukm.nama}', category_id: {ukm.category_id}")
        
        # 4. Create category mapping
        category_lookup = {cat.name: cat.id for cat in categories}
        print(f"\n4. Category lookup: {category_lookup}")
        
        # 5. Fix UKM category assignments
        print("\n5. Fixing UKM category assignments...")
        
        # Define mapping rules
        mapping_rules = [
            (["catur", "basket", "badminton", "futsal", "bola"], "Unit Kegiatan Olahraga"),
            (["musik", "band", "seni", "tari", "vocal"], "Unit Kegiatan Kesenian"),
            (["debat", "persatuan", "fotografi", "bahasa", "english", "sastra"], "Unit Kegiatan Khusus")
        ]
        
        changes_made = 0
        
        for ukm in ukms:
            ukm_name_lower = ukm.nama.lower()
            new_category_id = None
            matched_rule = None
            
            # Try to match with rules
            for keywords, category_name in mapping_rules:
                for keyword in keywords:
                    if keyword in ukm_name_lower:
                        new_category_id = category_lookup.get(category_name)
                        matched_rule = category_name
                        break
                if new_category_id:
                    break
            
            # If no match, assign to "Unit Kegiatan Khusus" as default
            if not new_category_id:
                new_category_id = category_lookup.get("Unit Kegiatan Khusus")
                matched_rule = "Unit Kegiatan Khusus (default)"
            
            # Update if needed
            if ukm.category_id != new_category_id:
                print(f"  📝 Updating '{ukm.nama}': {ukm.category_id} → {new_category_id} ({matched_rule})")
                ukm.category_id = new_category_id
                changes_made += 1
            else:
                print(f"  ✅ '{ukm.nama}': Already correct ({matched_rule})")
        
        # 6. Commit changes
        if changes_made > 0:
            try:
                db.session.commit()
                print(f"\n✅ Successfully updated {changes_made} UKM category assignments!")
            except Exception as e:
                db.session.rollback()
                print(f"\n❌ Error updating UKMs: {e}")
                return
        else:
            print(f"\n✅ No changes needed - all UKMs already have correct categories!")
        
        # 7. Verify the fix
        print("\n7. VERIFICATION - Final UKM-Category mapping:")
        ukms = UKM.query.all()  # Refresh data
        for ukm in ukms:
            category = Category.query.get(ukm.category_id)
            category_name = category.name if category else "STILL BROKEN"
            print(f"  ✅ '{ukm.nama}' → '{category_name}' (ID: {ukm.category_id})")
        
        print(f"\n🎉 Database relations fixed successfully!")
        print(f"📊 Summary: {len(ukms)} UKMs mapped to {len(categories)} categories")

if __name__ == "__main__":
    fix_database_relations()
