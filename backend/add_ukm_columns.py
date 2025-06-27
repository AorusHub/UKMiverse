import pymysql
import sys

def add_ukm_columns():
    try:
        # Database connection
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='ukmiverse_db',
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        print("Connected to database")
        
        # Check if columns exist
        cursor.execute("DESCRIBE ukms")
        columns = [row[0] for row in cursor.fetchall()]
        print(f"Current columns: {columns}")
        
        # Add prestasi column if not exists
        if 'prestasi' not in columns:
            print("Adding prestasi column...")
            cursor.execute("ALTER TABLE ukms ADD COLUMN prestasi TEXT")
            print("prestasi column added")
        else:
            print("prestasi column already exists")
        
        # Add kegiatan_rutin column if not exists
        if 'kegiatan_rutin' not in columns:
            print("Adding kegiatan_rutin column...")
            cursor.execute("ALTER TABLE ukms ADD COLUMN kegiatan_rutin TEXT")
            print("kegiatan_rutin column added")
        else:
            print("kegiatan_rutin column already exists")
        
        # Commit changes
        connection.commit()
        print("Migration completed successfully!")
        
        # Add sample data
        print("Adding sample data...")
        cursor.execute("SELECT id, nama FROM ukms")
        ukms = cursor.fetchall()
        
        for ukm_id, nama in ukms:
            if 'catur' in nama.lower():
                prestasi = "• Juara I Catur Fakultas 2023\n• Juara 2 Antar Universitas Sulawesi 2022"
                kegiatan = "• Latihan rutin setiap Senin dan Rabu\n• Turnamen internal bulanan"
            elif 'musik' in nama.lower():
                prestasi = "• Juara I Lomba Band Kampus 2023\n• Best Performance Festival Musik"
                kegiatan = "• Latihan band setiap Selasa dan Kamis\n• Pentas bulanan di kampus"
            elif 'badminton' in nama.lower():
                prestasi = "• Juara 2 POMNAS Badminton 2023\n• Juara I Turnamen Universitas"
                kegiatan = "• Latihan teknik setiap Senin, Rabu, Jumat\n• Sparring match setiap Minggu"
            else:
                prestasi = "• Prestasi Tingkat Regional\n• Penghargaan Partisipasi Terbaik"
                kegiatan = "• Pertemuan rutin setiap minggu\n• Workshop bulanan"
            
            cursor.execute(
                "UPDATE ukms SET prestasi = %s, kegiatan_rutin = %s WHERE id = %s AND (prestasi IS NULL OR prestasi = '')",
                (prestasi, kegiatan, ukm_id)
            )
        
        connection.commit()
        print("Sample data added successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        if connection:
            connection.close()
            print("Database connection closed")

if __name__ == "__main__":
    add_ukm_columns()
