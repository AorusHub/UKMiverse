#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, UKM, Category

def quick_fix():
    """Quick fix for database relations without running server"""
    
    print("=== QUICK FIX: UKM-CATEGORY DATABASE RELATIONS ===")
    
    try:
        app = create_app()
        
        with app.app_context():
            # 1. Check and create categories if needed
            categories = Category.query.all()
            
            if len(categories) == 0:
                print("Creating default categories...")
                default_cats = [
                    Category(name="Unit Kegiatan Olahraga"),
                    Category(name="Unit Kegiatan Kesenian"),
                    Category(name="Unit Kegiatan Khusus")
                ]
                
                for cat in default_cats:
                    db.session.add(cat)
                
                db.session.commit()
                categories = Category.query.all()
                print(f"✅ Created {len(categories)} categories")
            
            # 2. Get category IDs
            olahraga_id = Category.query.filter_by(name="Unit Kegiatan Olahraga").first().id
            kesenian_id = Category.query.filter_by(name="Unit Kegiatan Kesenian").first().id
            khusus_id = Category.query.filter_by(name="Unit Kegiatan Khusus").first().id
            
            print(f"Category IDs: Olahraga={olahraga_id}, Kesenian={kesenian_id}, Khusus={khusus_id}")
            
            # 3. Fix UKM categories with simple rules
            ukms = UKM.query.all()
            
            for ukm in ukms:
                nama_lower = ukm.nama.lower()
                
                if any(word in nama_lower for word in ['catur', 'basket', 'badminton', 'futsal', 'sepak']):
                    ukm.category_id = olahraga_id
                elif any(word in nama_lower for word in ['musik', 'band', 'seni']):
                    ukm.category_id = kesenian_id
                else:
                    ukm.category_id = khusus_id
                
                print(f"Fixed: {ukm.nama} → category_id {ukm.category_id}")
            
            db.session.commit()
            
            # 4. Verify
            print("\nVerification:")
            for ukm in ukms:
                category = Category.query.get(ukm.category_id)
                print(f"✅ {ukm.nama} → {category.name}")
            
            print("\n🎉 Database relations fixed!")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    quick_fix()
