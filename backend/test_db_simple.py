import sqlite3
import json

def test_db_data():
    """Direct SQLite test"""
    db_path = 'instance/ukmiverse.db'
    
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # This enables column access by name
        cursor = conn.cursor()
        
        print("=== Database Direct Test ===")
        
        # Get categories
        cursor.execute("SELECT * FROM categories")
        categories = [dict(row) for row in cursor.fetchall()]
        print(f"Categories found: {len(categories)}")
        for cat in categories:
            print(f"  Category ID: {cat['id']} (type: {type(cat['id'])}), Name: {cat['name']}")
        
        # Get UKMs
        cursor.execute("SELECT * FROM ukms")
        ukms = [dict(row) for row in cursor.fetchall()]
        print(f"\nUKMs found: {len(ukms)}")
        for ukm in ukms:
            print(f"  UKM ID: {ukm['id']}")
            print(f"    Name: {ukm['nama']}")
            print(f"    Category ID: {ukm['category_id']} (type: {type(ukm['category_id'])})")
            
            # Test category mapping
            if ukm['category_id'] is not None:
                matching_cat = next((cat for cat in categories if cat['id'] == ukm['category_id']), None)
                if matching_cat:
                    print(f"    ✅ Maps to category: {matching_cat['name']}")
                else:
                    print(f"    ❌ No matching category found")
            else:
                print(f"    ❌ Category ID is None")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_db_data()
