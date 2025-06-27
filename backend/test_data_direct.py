#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.models import db, UKM, Category

def test_ukm_data():
    """Test UKM data directly from database"""
    app = create_app()
    
    with app.app_context():
        try:
            print("=== Direct Database Test ===")
            
            # Get all UKMs
            ukms = UKM.query.all()
            print(f"Found {len(ukms)} UKMs in database")
            
            # Get all categories  
            categories = Category.query.all()
            print(f"Found {len(categories)} categories in database")
            
            print("\n=== Categories ===")
            for category in categories:
                cat_dict = category.to_dict()
                print(f"Category ID: {cat_dict['id']} (type: {type(cat_dict['id'])}), Name: {cat_dict['name']}")
            
            print("\n=== UKMs ===")
            for ukm in ukms:
                ukm_dict = ukm.to_dict()
                print(f"UKM ID: {ukm_dict['id']}")
                print(f"  Name: {ukm_dict.get('nama', 'N/A')}")
                print(f"  Name field: {ukm_dict.get('name', 'N/A')}")
                print(f"  Category ID: {ukm_dict.get('category_id')} (type: {type(ukm_dict.get('category_id'))})")
                print(f"  Has category_id: {'category_id' in ukm_dict}")
                print(f"  Category object: {ukm_dict.get('category')}")
                print(f"  All fields: {list(ukm_dict.keys())}")
                print("  ---")
                
            print("\n=== Test Category Mapping Logic ===")
            for ukm in ukms:
                ukm_dict = ukm.to_dict()
                ukm_category_id = ukm_dict.get('category_id')
                
                if ukm_category_id is not None:
                    # Simulate frontend logic
                    parsed_category_id = int(ukm_category_id)
                    
                    # Find matching category
                    matching_category = None
                    for category in categories:
                        cat_dict = category.to_dict()
                        if int(cat_dict['id']) == parsed_category_id:
                            matching_category = cat_dict
                            break
                    
                    if matching_category:
                        print(f"✅ UKM '{ukm_dict.get('nama')}' -> Category '{matching_category['name']}'")
                    else:
                        print(f"❌ UKM '{ukm_dict.get('nama')}' -> No matching category for ID {parsed_category_id}")
                        print(f"   Available category IDs: {[int(c.to_dict()['id']) for c in categories]}")
                else:
                    print(f"❌ UKM '{ukm_dict.get('nama')}' -> No category_id field")
                    
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    test_ukm_data()
