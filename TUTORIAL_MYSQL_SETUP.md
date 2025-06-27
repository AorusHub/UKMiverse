# 🚀 Tutorial Setup Database MySQL dengan XAMPP

## Langkah-langkah Setup

### 1. Install XAMPP
1. Download XAMPP dari: https://www.apachefriends.org/
2. Install dengan memilih **Apache** dan **MySQL**
3. Buka **XAMPP Control Panel**

### 2. Start Services
1. Click **Start** pada **Apache** (untuk phpMyAdmin)
2. Click **Start** pada **MySQL** (untuk database)
3. Pastikan status keduanya hijau ✅

### 3. Setup Database
Jalankan script setup otomatis:
```bash
# Di root folder project
python setup_mysql.py
```

**Atau manual via phpMyAdmin:**
1. Buka: http://localhost/phpmyadmin
2. Buat database baru: `ukmiverse_db`

### 4. Install Dependencies Backend
```bash
cd backend
pip install -r requirements.txt
```

### 5. Jalankan Backend
```bash
python run.py
```

## ✅ Hasil yang Diharapkan

Saat backend jalan pertama kali, akan otomatis membuat:

### Tables:
- ✅ `roles` (admin, user)
- ✅ `users` (admin default + avatar columns)  
- ✅ `categories` (Olahraga, Kesenian, Khusus)
- ✅ `ukms` (contoh UKM)

### Avatar System:
- ✅ **avatar_url**: URL eksternal atau base64 data
- ✅ **avatar_filename**: Nama file untuk avatar lokal
- ✅ **avatar_type**: Tipe avatar (url/local/base64)

### Default Data:
- 👤 **Admin User**: username=`admin`, password=`admin123`
- 📋 **3 Kategori UKM** dengan contoh UKM

## 🔍 Monitoring Database

### phpMyAdmin (Web Interface)
- URL: http://localhost/phpmyadmin
- User: `root`, Password: (kosong)

### Backend Logs
Terminal akan menampilkan:
```
* Running on http://127.0.0.1:5000
Database tables created successfully!
Admin user created: admin
Sample categories created!
Sample UKMs created!
```

### API Testing
Test API dengan:
```bash
# Test login admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test get UKMs
curl http://localhost:5000/api/ukm/
```

## 🐛 Troubleshooting

### Error: "Can't connect to MySQL server"
**Solusi:**
1. Pastikan MySQL running di XAMPP Control Panel
2. Check port 3306 tidak bentrok
3. Restart XAMPP

### Error: "No module named 'pymysql'"
**Solusi:**
```bash
pip install pymysql
```

### Error: "Access denied for user 'root'"
**Solusi:**
1. Di phpMyAdmin, buat password untuk user `root`
2. Update `backend/config.py`:
```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:your_password@localhost/ukmiverse_db'
```

### Error: "Unknown column 'users.avatar_filename'"
**Solusi:**
```bash
# Jalankan migrasi avatar system
python migrate_avatar_db.py
```

### Error: "Database doesn't exist"
**Solusi:**
```bash
# Jalankan script setup lagi
python setup_mysql.py
```

## 🔄 Database Migration untuk Avatar System

Jika Anda mendapat error `Unknown column 'users.avatar_filename'`, jalankan migrasi database:

### Automatic Migration
```bash
cd backend
python migrate_avatar_db.py
```

### Manual Migration (via phpMyAdmin)
Buka phpMyAdmin dan jalankan SQL berikut:

```sql
-- Add avatar columns to users table
ALTER TABLE users 
ADD COLUMN avatar_filename VARCHAR(255) NULL AFTER avatar_url;

ALTER TABLE users 
ADD COLUMN avatar_type VARCHAR(10) DEFAULT 'url' AFTER avatar_filename;

-- Update existing avatar entries
UPDATE users 
SET avatar_type = 'base64' 
WHERE avatar_url LIKE 'data:image/%';

UPDATE users 
SET avatar_type = 'url' 
WHERE avatar_url IS NOT NULL 
AND avatar_url != '' 
AND avatar_url NOT LIKE 'data:image/%';
```

## 📊 Database Schema

```sql
-- Roles Table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users Table  
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    student_id VARCHAR(20),
    faculty VARCHAR(100),
    major VARCHAR(100),
    avatar_url VARCHAR(255),          -- Avatar URL atau base64
    avatar_filename VARCHAR(255),     -- Local avatar filename  
    avatar_type VARCHAR(10) DEFAULT 'url', -- Avatar type: url/local/base64
    role_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- UKMs Table
CREATE TABLE ukms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    contact VARCHAR(255),
    image VARCHAR(255),
    category_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## 🎯 Connection String

**Development (XAMPP default):**
```
mysql+pymysql://root:@localhost/ukmiverse_db
```

**Jika MySQL ada password:**
```
mysql+pymysql://root:password@localhost/ukmiverse_db
```

**Fallback ke SQLite (jika MySQL bermasalah):**
Uncomment di `config.py`:
```python
SQLALCHEMY_DATABASE_URI = 'sqlite:///ukmiverse.db'
```

## 🎉 Setelah Setup Berhasil

1. ✅ **Backend API** ready di: http://localhost:5000
2. ✅ **Frontend React** ready di: http://localhost:5176  
3. ✅ **Database MySQL** accessible via phpMyAdmin
4. ✅ **Full-stack application** siap digunakan!

**Login Admin:**
- Username: `admin`
- Password: `admin123`

Selamat! UKMiverse dengan MySQL database sudah siap untuk development! 🚀
