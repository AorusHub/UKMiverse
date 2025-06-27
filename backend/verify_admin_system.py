#!/usr/bin/env python3
"""
Quick verification script to check admin credentials and UKM system readiness
"""

from app import create_app
from app.models import db, User, UKM, Category

app = create_app()

def verify_admin_system():
    """Verify admin user exists and system is ready for CRUD operations"""
    
    with app.app_context():
        print("🔍 Verifying UKM CRUD system readiness...")
        
        # Check admin user
        print("\n1. Checking admin user...")
        admin = User.query.filter_by(username='admin').first()
        if admin:
            print(f"✅ Admin user found: {admin.username} (role: {admin.role})")
            print(f"   Password hash exists: {bool(admin.password_hash)}")
        else:
            print("❌ Admin user not found!")
            return False
        
        # Check categories exist
        print("\n2. Checking categories...")
        categories = Category.query.all()
        print(f"✅ Found {len(categories)} categories:")
        for cat in categories:
            print(f"   - {cat.name} (ID: {cat.id})")
        
        # Check UKM table structure
        print("\n3. Checking UKM table structure...")
        inspector = db.inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('ukms')]
        print(f"📋 UKM table columns: {columns}")
        
        required_fields = ['nama', 'deskripsi', 'category_id', 'prestasi', 'kegiatan_rutin']
        missing_fields = [field for field in required_fields if field not in columns]
        
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            print("💡 Run migration script: python migrate_ukm_fields.py")
            return False
        else:
            print("✅ All required fields present")
        
        # Check existing UKMs
        print("\n4. Checking existing UKMs...")
        ukms = UKM.query.all()
        print(f"📋 Found {len(ukms)} UKMs:")
        for ukm in ukms[:3]:  # Show first 3
            print(f"   - {ukm.nama} (Category: {ukm.category_id})")
            print(f"     Has prestasi: {bool(ukm.prestasi)}")
            print(f"     Has kegiatan_rutin: {bool(ukm.kegiatan_rutin)}")
        
        print("\n✅ System verification complete!")
        print("📝 To test:")
        print("   1. Run: python run.py")
        print("   2. Login as admin (username: admin, password: password123)")
        print("   3. Click 'Tambah UKM' button")
        print("   4. Fill form with prestasi and kegiatan rutin")
        
        return True

if __name__ == "__main__":
    verify_admin_system()
