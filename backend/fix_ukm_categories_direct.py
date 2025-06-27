#!/usr/bin/env python3

import sqlite3
import os

def fix_ukm_category_ids():
    """Fix UKM category_id values directly in SQLite database"""
    
    db_path = 'instance/ukmiverse.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Database file not found: {db_path}")
        return
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("=== Fixing UKM Category IDs ===")
        
        # First, check current categories
        cursor.execute("SELECT id, name FROM categories")
        categories = cursor.fetchall()
        print(f"Available categories: {categories}")
        
        if not categories:
            print("❌ No categories found in database")
            return
            
        default_category_id = categories[0][0]  # Use first category as default
        print(f"Default category ID: {default_category_id}")
        
        # Check current UKMs
        cursor.execute("SELECT id, nama, category_id FROM ukms")
        ukms = cursor.fetchall()
        print(f"Found {len(ukms)} UKMs")
        
        fixed_count = 0
        for ukm_id, nama, category_id in ukms:
            print(f"UKM: {nama} -> Category ID: {category_id}")
            
            if category_id is None:
                print(f"  ❌ Fixing NULL category_id for UKM: {nama}")
                cursor.execute("UPDATE ukms SET category_id = ? WHERE id = ?", (default_category_id, ukm_id))
                fixed_count += 1
            else:
                # Check if category_id is valid
                cursor.execute("SELECT id FROM categories WHERE id = ?", (category_id,))
                if not cursor.fetchone():
                    print(f"  ❌ Invalid category_id {category_id} for UKM: {nama}, fixing...")
                    cursor.execute("UPDATE ukms SET category_id = ? WHERE id = ?", (default_category_id, ukm_id))
                    fixed_count += 1
                else:
                    print(f"  ✅ Valid category_id for UKM: {nama}")
        
        if fixed_count > 0:
            print(f"\n🔧 Fixed {fixed_count} UKMs")
            conn.commit()
            print("✅ Changes committed to database")
        else:
            print("\n✅ All UKMs already have valid category_id values")
        
        # Verify the fix
        print("\n=== Verification ===")
        cursor.execute("""
            SELECT u.id, u.nama, u.category_id, c.name as category_name 
            FROM ukms u 
            LEFT JOIN categories c ON u.category_id = c.id
        """)
        results = cursor.fetchall()
        
        for ukm_id, nama, category_id, category_name in results:
            if category_name:
                print(f"✅ UKM: {nama} -> Category: {category_name} (ID: {category_id})")
            else:
                print(f"❌ UKM: {nama} -> No matching category for ID: {category_id}")
        
        conn.close()
        print("\n✅ Database fix completed successfully")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_ukm_category_ids()
