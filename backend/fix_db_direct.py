#!/usr/bin/env python3

import sqlite3
import os

def fix_database_with_sql():
    """Fix database relations using direct SQL"""
    
    # Find database file
    db_paths = [
        'instance/ukmiverse.db',
        'ukmiverse.db',
        '../ukmiverse.db'
    ]
    
    db_path = None
    for path in db_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("❌ Database file not found! Tried:")
        for path in db_paths:
            print(f"  - {path}")
        return
    
    print(f"📁 Found database: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 1. Check existing categories
        print("\n1. Checking categories...")
        cursor.execute("SELECT id, name FROM category")
        categories = cursor.fetchall()
        
        if not categories:
            print("Creating categories...")
            categories_to_create = [
                "Unit Kegiatan Olahraga",
                "Unit Kegiatan Kesenian", 
                "Unit Kegiatan Khusus"
            ]
            
            for cat_name in categories_to_create:
                cursor.execute("INSERT INTO category (name) VALUES (?)", (cat_name,))
            
            conn.commit()
            
            # Get categories again
            cursor.execute("SELECT id, name FROM category")
            categories = cursor.fetchall()
        
        print(f"Categories: {categories}")
        
        # 2. Check UKMs
        print("\n2. Checking UKMs...")
        cursor.execute("SELECT id, nama, category_id FROM ukm")
        ukms = cursor.fetchall()
        
        print(f"Found {len(ukms)} UKMs:")
        for ukm in ukms:
            print(f"  ID: {ukm[0]}, Name: '{ukm[1]}', category_id: {ukm[2]}")
        
        # 3. Create mapping
        cat_mapping = {}
        for cat_id, cat_name in categories:
            cat_mapping[cat_name] = cat_id
        
        print(f"\nCategory mapping: {cat_mapping}")
        
        # 4. Fix UKM categories
        print("\n3. Fixing UKM categories...")
        
        for ukm_id, ukm_nama, current_cat_id in ukms:
            nama_lower = ukm_nama.lower()
            
            # Determine correct category
            if any(word in nama_lower for word in ['catur', 'basket', 'badminton', 'futsal', 'sepak', 'bola']):
                new_cat_id = cat_mapping.get("Unit Kegiatan Olahraga")
                category_name = "Unit Kegiatan Olahraga"
            elif any(word in nama_lower for word in ['musik', 'band', 'seni', 'tari']):
                new_cat_id = cat_mapping.get("Unit Kegiatan Kesenian")
                category_name = "Unit Kegiatan Kesenian"
            else:
                new_cat_id = cat_mapping.get("Unit Kegiatan Khusus")
                category_name = "Unit Kegiatan Khusus"
            
            if current_cat_id != new_cat_id:
                print(f"  📝 Updating '{ukm_nama}': {current_cat_id} → {new_cat_id} ({category_name})")
                cursor.execute("UPDATE ukm SET category_id = ? WHERE id = ?", (new_cat_id, ukm_id))
            else:
                print(f"  ✅ '{ukm_nama}': Already correct ({category_name})")
        
        # 5. Commit changes
        conn.commit()
        
        # 6. Verify
        print("\n4. Verification:")
        cursor.execute("""
            SELECT u.nama, u.category_id, c.name 
            FROM ukm u 
            LEFT JOIN category c ON u.category_id = c.id
        """)
        
        results = cursor.fetchall()
        for ukm_nama, cat_id, cat_name in results:
            print(f"  ✅ '{ukm_nama}' → '{cat_name}' (ID: {cat_id})")
        
        conn.close()
        print(f"\n🎉 Database fixed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_database_with_sql()
