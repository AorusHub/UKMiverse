#!/usr/bin/env python3
"""
Migration script to add prestasi and kegiatan_rutin fields to UKM table
"""

from app import create_app
from app.models import db

app = create_app()

def migrate_ukm_fields():
    """Add prestasi and kegiatan_rutin fields to UKM table"""
    
    with app.app_context():
        try:
            print("Starting UKM fields migration...")
            
            # Check if columns already exist
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('ukms')]
            
            print(f"Current columns in ukms table: {columns}")
            
            if 'prestasi' not in columns:
                print("Adding prestasi column...")
                db.engine.execute('ALTER TABLE ukms ADD COLUMN prestasi TEXT')
                print("prestasi column added successfully")
            else:
                print("prestasi column already exists")
                
            if 'kegiatan_rutin' not in columns:
                print("Adding kegiatan_rutin column...")
                db.engine.execute('ALTER TABLE ukms ADD COLUMN kegiatan_rutin TEXT')
                print("kegiatan_rutin column added successfully")
            else:
                print("kegiatan_rutin column already exists")
            
            # Update existing UKMs with sample data
            print("\nAdding sample data to existing UKMs...")
            
            from app.models import UKM
            ukms = UKM.query.all()
            
            for ukm in ukms:
                if not ukm.prestasi:
                    if 'catur' in ukm.nama.lower():
                        ukm.prestasi = """• Juara I Catur Fakultas 2023
• Juara 2 Antar Universitas Sulawesi 2022
• Finalis Nasional Kemenpura 2023
• Peserta Terbaik Pelatihan Percasi 2021"""
                        ukm.kegiatan_rutin = """• Latihan rutin setiap Senin dan Rabu pukul 16:00-18:00
• Simultan catur setiap Jumat sore
• Turnamen internal bulanan
• Workshop strategi catur setiap bulan"""
                    elif 'musik' in ukm.nama.lower():
                        ukm.prestasi = """• Juara I Lomba Band Kampus 2023
• Best Performance Festival Musik Daerah 2022
• Penampil Terbaik Dies Natalis Universitas
• Kolaborasi dengan Artis Lokal Makassar"""
                        ukm.kegiatan_rutin = """• Latihan band setiap Selasa dan Kamis pukil 19:00-21:00
• Vocal training setiap Sabtu pagi
• Pentas bulanan di kampus
• Workshop alat musik setiap bulan"""
                    elif 'badminton' in ukm.nama.lower():
                        ukm.prestasi = """• Juara 2 POMNAS Badminton 2023
• Juara I Turnamen Antar Universitas Sulawesi 2022
• Medali Emas Kejuaraan Regional 2021
• Tim Terbaik Liga Badminton Mahasiswa"""
                        ukm.kegiatan_rutin = """• Latihan teknik setiap Senin, Rabu, Jumat pukul 17:00-19:00
• Sparring match setiap Minggu pagi
• Turnamen internal setiap bulan
• Pelatihan fisik setiap Sabtu pagi"""
                    else:
                        ukm.prestasi = """• Prestasi Tingkat Regional
• Penghargaan Partisipasi Terbaik
• Kontributor Aktif Kegiatan Kampus
• Pengabdian Masyarakat Terbaik"""
                        ukm.kegiatan_rutin = """• Pertemuan rutin setiap minggu
• Workshop dan pelatihan bulanan
• Kegiatan sosial setiap bulan
• Evaluasi dan planning setiap semester"""
            
            db.session.commit()
            print("Sample data added successfully")
            
            print("\nMigration completed successfully!")
            
        except Exception as e:
            print(f"Error during migration: {e}")
            db.session.rollback()

if __name__ == "__main__":
    migrate_ukm_fields()
