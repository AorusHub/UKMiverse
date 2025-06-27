# Setup Database MySQL dengan XAMPP untuk UKMiverse

## Langkah 1: Install dan Setup XAMPP

1. **Download XAMPP**:
   - Download dari: https://www.apachefriends.org/index.html
   - Install dengan memilih Apache dan MySQL

2. **Start Services**:
   - Buka XAMPP Control Panel
   - Start **Apache** dan **MySQL**
   - Pastikan Apache di port 80 dan MySQL di port 3306

## Langkah 2: Buat Database

1. **Akses phpMyAdmin**:
   - Buka browser ke: http://localhost/phpmyadmin
   - Username: `root`, Password: (kosong)

2. **Buat Database**:
   ```sql
   CREATE DATABASE ukmiverse_db;
   USE ukmiverse_db;
   ```

## Langkah 3: Install Dependencies Python

```bash
# Di folder backend, install MySQL connector
pip install pymysql
```

## Langkah 4: Update Backend Configuration

Konfigurasi sudah diupdate untuk menggunakan MySQL dengan XAMPP.

## Langkah 5: Jalankan Backend

```bash
cd backend
python run.py
```

Backend akan otomatis membuat tabel yang diperlukan!

## Struktur Database yang Akan Dibuat

### 1. Table: roles
- id (PRIMARY KEY)
- name (admin, user)
- description

### 2. Table: users  
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE) 
- password_hash
- role_id (FOREIGN KEY -> roles.id)
- created_at

### 3. Table: categories
- id (PRIMARY KEY)
- name
- description
- created_at

### 4. Table: ukms
- id (PRIMARY KEY)
- nama
- deskripsi
- contact
- image
- category_id (FOREIGN KEY -> categories.id)
- created_at

## Default Data

Backend akan otomatis menambahkan:
- Role admin dan user
- User admin default (username: admin, password: admin123)
- Kategori UKM default
- Beberapa contoh UKM

## Connection String

**Development (XAMPP)**:
```
mysql+pymysql://root:@localhost/ukmiverse_db
```

**Jika ada password MySQL**:
```
mysql+pymysql://root:your_password@localhost/ukmiverse_db
```

## Troubleshooting

### Error: "No module named 'pymysql'"
```bash
pip install pymysql
```

### Error: "Can't connect to MySQL server"
- Pastikan MySQL service running di XAMPP
- Check port 3306 tidak digunakan aplikasi lain
- Restart XAMPP jika perlu

### Error: "Access denied for user 'root'"
- Set password untuk user root di phpMyAdmin
- Update connection string dengan password

## Monitoring Database

- **phpMyAdmin**: http://localhost/phpmyadmin
- **Direct MySQL**: Connect dengan tools seperti MySQL Workbench
- **Backend Logs**: Check terminal untuk SQL queries

## Backup Database

```sql
-- Export via phpMyAdmin atau command line:
mysqldump -u root -p ukmiverse_db > backup.sql

-- Restore:
mysql -u root -p ukmiverse_db < backup.sql
```

Dengan setup ini, Anda akan memiliki database MySQL profesional untuk UKMiverse yang siap production!
