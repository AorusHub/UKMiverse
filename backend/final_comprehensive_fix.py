#!/usr/bin/env python3

"""
Comprehensive fix for UKM category display issue.
This script will:
1. Fix database category_id values
2. Test backend data structure  
3. Provide frontend debugging info
"""

import sqlite3
import os
import sys
import json

def fix_database():
    """Fix category_id values in database"""
    db_path = 'instance/ukmiverse.db'
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found: {db_path}")
        return False
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("=== Step 1: Database Fix ===")
        
        # Get categories
        cursor.execute("SELECT id, name FROM categories")
        categories = cursor.fetchall()
        
        if not categories:
            print("❌ No categories in database")
            return False
            
        print(f"✅ Found {len(categories)} categories:")
        for cat_id, cat_name in categories:
            print(f"  {cat_id}: {cat_name}")
        
        # Fix UKMs with NULL category_id
        default_category_id = categories[0][0]
        
        cursor.execute("UPDATE ukms SET category_id = ? WHERE category_id IS NULL", (default_category_id,))
        null_fixes = cursor.rowcount
        
        # Fix UKMs with invalid category_id
        valid_category_ids = [str(cat[0]) for cat in categories]
        placeholders = ','.join(['?' for _ in valid_category_ids])
        cursor.execute(f"UPDATE ukms SET category_id = ? WHERE category_id NOT IN ({placeholders})", 
                      [default_category_id] + valid_category_ids)
        invalid_fixes = cursor.rowcount
        
        conn.commit()
        
        if null_fixes > 0 or invalid_fixes > 0:
            print(f"✅ Fixed {null_fixes} NULL category_id and {invalid_fixes} invalid category_id values")
        else:
            print("✅ All category_id values were already valid")
        
        # Verify fix
        cursor.execute("""
            SELECT u.id, u.nama, u.category_id, c.name 
            FROM ukms u 
            LEFT JOIN categories c ON u.category_id = c.id
        """)
        results = cursor.fetchall()
        
        print(f"\n=== Verification ===")
        all_valid = True
        for ukm_id, ukm_name, cat_id, cat_name in results:
            if cat_name:
                print(f"✅ '{ukm_name}' -> '{cat_name}' (ID: {cat_id})")
            else:
                print(f"❌ '{ukm_name}' -> Invalid category ID: {cat_id}")
                all_valid = False
        
        conn.close()
        return all_valid
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def test_flask_model():
    """Test Flask model data structure"""
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    
    try:
        from app import create_app
        from app.models import db, UKM, Category
        
        app = create_app()
        
        with app.app_context():
            print("\n=== Step 2: Flask Model Test ===")
            
            # Test UKM model
            ukms = UKM.query.limit(3).all()
            categories = Category.query.all()
            
            print(f"✅ Loaded {len(ukms)} UKMs and {len(categories)} categories")
            
            print("\n=== UKM Data Structure ===")
            for ukm in ukms:
                ukm_dict = ukm.to_dict()
                print(f"\nUKM: {ukm_dict.get('nama')}")
                print(f"  ID: {ukm_dict.get('id')}")
                print(f"  category_id: {ukm_dict.get('category_id')} (type: {type(ukm_dict.get('category_id'))})")
                print(f"  has category_id field: {'category_id' in ukm_dict}")
                print(f"  category_id is not None: {ukm_dict.get('category_id') is not None}")
                
                # Test relationship
                if ukm.category:
                    print(f"  ✅ Relationship: {ukm.category.name}")
                else:
                    print(f"  ❌ No category relationship")
            
            # Create sample API response
            api_response = [ukm.to_dict() for ukm in ukms]
            
            print(f"\n=== Simulated API Response ===")
            print("Sample API response structure:")
            print(json.dumps(api_response, indent=2, default=str))
            
            return True
            
    except ImportError as e:
        print(f"❌ Cannot import Flask models: {e}")
        return False
    except Exception as e:
        print(f"❌ Flask model test error: {e}")
        return False

def generate_frontend_debug_data():
    """Generate data for frontend debugging"""
    
    print("\n=== Step 3: Frontend Debug Information ===")
    
    print("Frontend debugging checklist:")
    print("1. Check browser console for AdminPanel debug logs")
    print("2. Look for these specific log messages:")
    print("   - 'UKM Data Analysis' logs showing category_id values")
    print("   - 'Backend test response' showing API status")
    print("   - 'Categories loaded from database' showing categories")
    print("3. Verify these values in browser console:")
    print("   - ukm.category_id should not be undefined")
    print("   - categories array should contain objects with id and name")
    print("   - category mapping should find matching categories")
    
    print("\nExpected frontend behavior:")
    print("✅ UKMs should show actual category names instead of 'Unknown (ID: undefined)'")
    print("✅ AdminPanel should load real data from backend instead of fallback data")
    print("✅ Category mapping should work: categories.find(cat => parseInt(cat.id) === parseInt(ukm.category_id))")
    
    # Frontend fix suggestions
    print("\nIf issue persists, try these frontend fixes:")
    print("1. Hard refresh AdminPanel page (Ctrl+F5)")
    print("2. Clear browser cache")
    print("3. Check if backend is actually running on http://localhost:5000")
    print("4. Verify API endpoints return data (use browser dev tools Network tab)")

def main():
    """Main execution function"""
    print("=" * 60)
    print("COMPREHENSIVE UKM CATEGORY DISPLAY FIX")
    print("=" * 60)
    
    # Step 1: Fix database
    db_fixed = fix_database()
    
    # Step 2: Test Flask models
    if db_fixed:
        flask_ok = test_flask_model()
    else:
        flask_ok = False
    
    # Step 3: Generate debug info
    generate_frontend_debug_data()
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Database fixed: {'✅' if db_fixed else '❌'}")
    print(f"Flask models OK: {'✅' if flask_ok else '❌'}")
    
    if db_fixed and flask_ok:
        print("\n🎉 Backend should now return correct UKM data with category_id!")
        print("Next steps:")
        print("1. Start backend: python run.py")
        print("2. Refresh AdminPanel in browser")
        print("3. Check browser console for debug logs")
    else:
        print("\n❌ Issues found - check error messages above")

if __name__ == "__main__":
    main()
