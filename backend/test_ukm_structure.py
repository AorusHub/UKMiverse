#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def test_ukm_data_structure():
    """Test the exact data structure returned by UKM model"""
    
    try:
        from app import create_app
        from app.models import db, UKM, Category
        
        app = create_app()
        
        with app.app_context():
            print("=== UKM Data Structure Test ===")
            
            # Get sample UKM and category
            ukm = UKM.query.first()
            if not ukm:
                print("❌ No UKM found in database")
                return
                
            category = Category.query.first()
            if not category:
                print("❌ No category found in database")
                return
            
            print("\n=== Testing UKM.to_dict() ===")
            ukm_dict = ukm.to_dict()
            print("UKM dictionary structure:")
            for key, value in ukm_dict.items():
                print(f"  {key}: {value} (type: {type(value)})")
            
            print("\n=== Frontend Compatibility Check ===")
            # Simulate what frontend does
            print(f"ukm.nama: {ukm_dict.get('nama')}")
            print(f"ukm.name: {ukm_dict.get('name')}")
            print(f"ukm.category_id: {ukm_dict.get('category_id')}")
            print(f"'category_id' in ukm_dict: {'category_id' in ukm_dict}")
            print(f"ukm.category_id is None: {ukm_dict.get('category_id') is None}")
            
            # Test category mapping simulation
            category_id = ukm_dict.get('category_id')
            if category_id is not None:
                try:
                    parsed_id = int(category_id)
                    print(f"✅ category_id can be parsed as int: {parsed_id}")
                except (ValueError, TypeError) as e:
                    print(f"❌ category_id cannot be parsed as int: {e}")
            else:
                print(f"❌ category_id is None")
            
            print("\n=== Category Data Structure ===")
            cat_dict = category.to_dict()
            print("Category dictionary structure:")
            for key, value in cat_dict.items():
                print(f"  {key}: {value} (type: {type(value)})")
            
            print("\n=== Relationship Test ===")
            if hasattr(ukm, 'category') and ukm.category:
                print(f"✅ UKM-Category relationship works")
                print(f"UKM '{ukm.nama}' belongs to category '{ukm.category.name}'")
            else:
                print(f"❌ UKM-Category relationship broken")
                
    except ImportError as e:
        print(f"❌ Import error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ukm_data_structure()
