import pymysql
from sqlalchemy.engine.url import make_url

from config import Config
from app import create_app, db

# ————————————————
# 1) Parse DATABASE_URI dari config
# ————————————————
# Contoh: 'mysql+pymysql://root:password@localhost/ukmiverse_db'
url = make_url(Config.SQLALCHEMY_DATABASE_URI)
user     = url.username or 'root'
password = url.password or ''
host     = url.host or 'localhost'
port     = url.port or 3306
db_name  = url.database

# ——————————————————————————————————————————————————————————————
# 2) Koneksi ke server MySQL (tanpa memilih database), lalu buat DB
# ——————————————————————————————————————————————————————————————
conn = pymysql.connect(
    host=host,
    user=user,
    password=password,
    port=port,
    cursorclass=pymysql.cursors.DictCursor
)
try:
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    conn.commit()
    print(f"✅ Database `{db_name}` sudah siap (dibuat jika belum ada).")
finally:
    conn.close()

# ————————————————————————————————————————
# 3) Buat app, tabel, dan jalankan server Flask
# ————————————————————————————————————————
app = create_app()

with app.app_context():
    db.create_all()  # bikin tabel-tabel kalau belum ada

if __name__ == '__main__':
    app.run(debug=True, port=5000)
