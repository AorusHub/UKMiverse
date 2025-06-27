#!/usr/bin/env python3
"""
Script untuk memperbaiki category_id pada UKM yang kosong atau null
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, UKM, Category

def fix_ukm_categories():
    """Fix missing category_ids untuk UKM"""
    app = create_app()
    
    with app.app_context():
        print("🔍 Checking UKM categories...")
        
        # Get all UKMs
        ukms = UKM.query.all()
        print(f"📊 Found {len(ukms)} UKMs in database")
        
        # Get all categories
        categories = Category.query.all()
        print(f"📊 Found {len(categories)} categories in database")
        
        if not categories:
            print("❌ No categories found! Creating default categories...")
            # Create default categories
            default_categories = [
                {'name': 'Unit Kegiatan Olahraga'},
                {'name': 'Unit Kegiatan Kesenian'}, 
                {'name': 'Unit Kegiatan Khusus'}
            ]
            
            for cat_data in default_categories:
                category = Category(name=cat_data['name'])
                db.session.add(category)
            
            db.session.commit()
            categories = Category.query.all()
            print(f"✅ Created {len(categories)} default categories")
        
        # Check and fix UKMs without category_id
        fixed_count = 0
        for ukm in ukms:
            print(f"\n🔍 Checking UKM: {ukm.nama}")
            print(f"   Category ID: {ukm.category_id}")
            
            if ukm.category_id is None:
                print(f"   ⚠️ Missing category_id, assigning default...")
                
                # Smart assignment based on name
                nama_lower = ukm.nama.lower()
                if any(word in nama_lower for word in ['basket', 'futsal', 'badminton', 'voli', 'sepak', 'renang', 'tenis', 'atletik', 'olahraga']):
                    category = next((c for c in categories if 'olahraga' in c.name.lower()), categories[0])
                elif any(word in nama_lower for word in ['musik', 'seni', 'tari', 'teater', 'paduan suara', 'band']):
                    category = next((c for c in categories if 'kesenian' in c.name.lower()), categories[1] if len(categories) > 1 else categories[0])
                else:
                    category = next((c for c in categories if 'khusus' in c.name.lower()), categories[-1])
                
                ukm.category_id = category.id
                fixed_count += 1
                print(f"   ✅ Assigned to category: {category.name} (ID: {category.id})")
        
        if fixed_count > 0:
            db.session.commit()
            print(f"\n✅ Fixed {fixed_count} UKMs with missing category_id")
        else:
            print("\n✅ All UKMs already have valid category_id")
        
        # Show final status
        print("\n📊 Final Status:")
        for ukm in UKM.query.all():
            category_name = ukm.category.name if ukm.category else "No Category"
            print(f"   - {ukm.nama}: Category ID {ukm.category_id} ({category_name})")

if __name__ == '__main__':
    fix_ukm_categories()
