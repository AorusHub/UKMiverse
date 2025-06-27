#!/usr/bin/env python3
"""
Migration script untuk menambahkan field prestasi dan kegiatan_rutin ke tabel UKMs
"""

from app import create_app
from app.models import db

app = create_app()

def migrate_ukm_fields():
    """Add prestasi and kegiatan_rutin fields to UKM table"""
    
    with app.app_context():
        try:
            print("🔄 Starting UKM fields migration...")
            
            # Check if columns already exist
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('ukms')]
            
            print(f"📋 Current columns in ukms table: {columns}")
            
            if 'prestasi' not in columns:
                print("➕ Adding prestasi column...")
                db.engine.execute('ALTER TABLE ukms ADD COLUMN prestasi TEXT')
                print("✅ prestasi column added successfully")
            else:
                print("⚠️  prestasi column already exists")
                
            if 'kegiatan_rutin' not in columns:
                print("➕ Adding kegiatan_rutin column...")
                db.engine.execute('ALTER TABLE ukms ADD COLUMN kegiatan_rutin TEXT')
                print("✅ kegiatan_rutin column added successfully")
            else:
                print("⚠️  kegiatan_rutin column already exists")
            
            # Update existing UKMs with sample data
            print("\n🔄 Adding sample data to existing UKMs...")
            
            from app.models import UKM
            ukms = UKM.query.all()
            
            for ukm in ukms:
                if not ukm.prestasi:
                    if 'catur' in ukm.nama.lower():
                        ukm.prestasi = """• Juara I Catur Fakultas 2023
• Juara 2 Antar Universitas Sulawesi 2022
• Finalis Nasional Kemenpura 2023
• Peserta Terbaik Pelatihan Percasi 2021
• Juara Harapan I Catur Se-Kampus 2024"""
                    elif 'badminton' in ukm.nama.lower():
                        ukm.prestasi = """• Juara I Badminton Fakultas 2023
• Medali Emas POMNAS 2022
• Juara 2 Kejurnas Mahasiswa 2023
• Best Player Award 2022
• Juara Regional Sulawesi 2024"""
                    elif 'musik' in ukm.nama.lower():
                        ukm.prestasi = """• Juara I Festival Musik Kampus 2023
• Best Performance Award 2022
• Finalis Kompetisi Band Nasional 2023
• Juara Favorit Audience 2022
• Best Original Song Award 2024"""
                    else:
                        ukm.prestasi = """• Prestasi Terbaik Fakultas 2023
• Juara 2 Kompetisi Regional 2022
• Finalis Kompetisi Nasional 2023
• Penghargaan Organisasi Terbaik 2022
• Juara Harapan Kompetisi 2024"""
                
                if not ukm.kegiatan_rutin:
                    if 'catur' in ukm.nama.lower():
                        ukm.kegiatan_rutin = """• Latihan mingguan setiap Jumat sore
• Sparring & simulasi antar anggota
• Kelas pemula untuk anggota baru
• Analisis pertandingan bersama senior
• Turnamen internal tiap semester"""
                    elif 'badminton' in ukm.nama.lower():
                        ukm.kegiatan_rutin = """• Latihan rutin 3x seminggu
• Sparring dengan UKM lain
• Pelatihan teknik dengan pelatih profesional
• Turnamen internal bulanan
• Conditioning dan fitness training"""
                    elif 'musik' in ukm.nama.lower():
                        ukm.kegiatan_rutin = """• Latihan band setiap Selasa & Kamis
• Workshop musik bulanan
• Jam session bersama anggota
• Recording lagu original
• Performa di acara kampus"""
                    else:
                        ukm.kegiatan_rutin = """• Pertemuan rutin mingguan
• Workshop dan pelatihan bulanan
• Kegiatan sosial dan bakti masyarakat
• Event dan kompetisi internal
• Kolaborasi dengan UKM lain"""
            
            db.session.commit()
            print("✅ Sample data added successfully")
            
            print("\n🎉 Migration completed successfully!")
            print("📋 Summary:")
            print("   ✅ prestasi column added/verified")
            print("   ✅ kegiatan_rutin column added/verified")
            print(f"   ✅ {len(ukms)} UKMs updated with sample data")
            
        except Exception as e:
            print(f"❌ Migration failed: {str(e)}")
            db.session.rollback()
            raise e

if __name__ == "__main__":
    migrate_ukm_fields()
