import sys
import os

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

try:
    # Import Flask app
    from app import create_app
    from app.models import db, UKM, Category
    
    # Create app context
    app = create_app()
    
    with app.app_context():
        print("=== Flask App Test ===")
        
        # Test database connection
        try:
            categories = Category.query.all()
            ukms = UKM.query.all()
            
            print(f"Categories: {len(categories)}")
            print(f"UKMs: {len(ukms)}")
            
            print("\n=== Categories ===")
            for cat in categories:
                cat_dict = cat.to_dict()
                print(f"ID: {cat_dict['id']}, Name: {cat_dict['name']}")
            
            print("\n=== UKMs ===")
            for ukm in ukms:
                ukm_dict = ukm.to_dict()
                print(f"UKM: {ukm_dict['nama']}")
                print(f"  Category ID: {ukm_dict.get('category_id')} (present: {'category_id' in ukm_dict})")
                print(f"  Raw category_id attribute: {ukm.category_id}")
                
                # Test the relationship
                if ukm.category:
                    print(f"  ✅ Category relationship works: {ukm.category.name}")
                else:
                    print(f"  ❌ Category relationship broken")
                    
                print("  ---")
                
        except Exception as e:
            print(f"Database error: {e}")
            import traceback
            traceback.print_exc()
            
except ImportError as e:
    print(f"Import error: {e}")
    print("This might indicate missing packages or incorrect setup")
except Exception as e:
    print(f"General error: {e}")
    import traceback
    traceback.print_exc()

print("\nScript completed.")
