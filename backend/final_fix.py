#!/usr/bin/env python3

def main():
    try:
        import sqlite3
        
        print("🔧 Connecting to database...")
        conn = sqlite3.connect('instance/ukmiverse.db')
        cursor = conn.cursor()
        
        # Check current state
        print("\n📊 Current Categories:")
        cursor.execute("SELECT id, name FROM category")
        categories = cursor.fetchall()
        
        if not categories:
            print("❌ No categories found! Creating default categories...")
            
            # Create default categories
            default_categories = [
                "Unit Kegiatan Olahraga",
                "Unit Kegiatan Kesenian", 
                "Unit Kegiatan Khusus"
            ]
            
            for cat_name in default_categories:
                cursor.execute("INSERT INTO category (name) VALUES (?)", (cat_name,))
                print(f"✅ Created: {cat_name}")
            
            conn.commit()
            
            # Refresh categories
            cursor.execute("SELECT id, name FROM category")
            categories = cursor.fetchall()
        
        # Display categories
        for cat_id, cat_name in categories:
            print(f"  📂 ID {cat_id}: {cat_name}")
        
        # Check UKMs
        print(f"\n🏛️ Current UKMs:")
        cursor.execute("SELECT id, nama, category_id FROM ukm")
        ukms = cursor.fetchall()
        
        print(f"Found {len(ukms)} UKMs")
        
        # Show current mapping
        print(f"\n🔗 Current UKM-Category mapping:")
        cursor.execute("""
            SELECT u.nama, u.category_id, c.name 
            FROM ukm u 
            LEFT JOIN category c ON u.category_id = c.id
        """)
        
        mappings = cursor.fetchall()
        broken_count = 0
        
        for ukm_name, cat_id, cat_name in mappings:
            if cat_name is None:
                print(f"  ❌ {ukm_name} (category_id: {cat_id}) → BROKEN")
                broken_count += 1
            else:
                print(f"  ✅ {ukm_name} → {cat_name}")
        
        if broken_count > 0:
            print(f"\n⚠️ Found {broken_count} broken relations! Fixing...")
            
            # Fix broken relations
            category_lookup = {name: cat_id for cat_id, name in categories}
            
            # Simple assignment rules
            for ukm_id, ukm_nama, current_cat_id in ukms:
                nama_lower = ukm_nama.lower()
                
                if any(keyword in nama_lower for keyword in ['catur', 'basket', 'badminton', 'futsal', 'sepak']):
                    new_cat_id = category_lookup.get("Unit Kegiatan Olahraga")
                elif any(keyword in nama_lower for keyword in ['musik', 'band', 'seni']):
                    new_cat_id = category_lookup.get("Unit Kegiatan Kesenian")
                else:
                    new_cat_id = category_lookup.get("Unit Kegiatan Khusus")
                
                if current_cat_id != new_cat_id:
                    cursor.execute("UPDATE ukm SET category_id = ? WHERE id = ?", (new_cat_id, ukm_id))
                    print(f"  🔧 Fixed: {ukm_nama} → category_id {new_cat_id}")
            
            conn.commit()
            print(f"✅ Fixed all broken relations!")
            
            # Verify
            print(f"\n✅ Final verification:")
            cursor.execute("""
                SELECT u.nama, c.name 
                FROM ukm u 
                LEFT JOIN category c ON u.category_id = c.id
            """)
            
            final_mappings = cursor.fetchall()
            for ukm_name, cat_name in final_mappings:
                print(f"  ✅ {ukm_name} → {cat_name}")
        
        conn.close()
        print(f"\n🎉 Database fix completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
