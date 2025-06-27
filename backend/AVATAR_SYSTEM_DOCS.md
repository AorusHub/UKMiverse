# Dokumentasi Sistem Avatar Lokal UKMiverse

## 📋 Ringkasan

Sistem avatar lokal telah diimplementasikan dengan fitur lengkap:
- ✅ Upload file gambar dan konversi otomatis ke JPG
- ✅ Upload URL eksternal dan base64 dengan konversi ke JPG lokal
- ✅ Penyimpanan file lokal di server dengan nama unik
- ✅ Serving file statis dari backend
- ✅ Hapus avatar (termasuk file lokal)
- ✅ Resize dan optimasi gambar otomatis (300x300px)
- ✅ Fallback dan error handling

## 🏗️ Struktur Sistem

### Backend Structure
```
backend/
├── app/
│   ├── __init__.py              # Flask app + static serving
│   ├── models.py                # User model dengan avatar fields
│   ├── api/
│   │   └── profile_routes.py    # Avatar endpoints
│   ├── services/
│   │   └── file_upload.py       # File upload service
│   └── static/
│       └── uploads/
│           └── avatars/         # Avatar storage folder
├── requirements.txt             # Dependencies (termasuk Pillow)
└── test_avatar_local.py         # Test script
```

### Frontend Structure
```
frontend/src/
├── components/
│   └── SimpleAvatar.jsx         # Robust avatar component
└── pages/
    └── Profile.jsx              # Profile page dengan upload
```

## 📊 Database Schema

### User Model - Avatar Fields
```python
class User(db.Model):
    # Avatar fields
    avatar_url = db.Column(db.String(255), nullable=True)      # External URL atau base64
    avatar_filename = db.Column(db.String(255), nullable=True) # Local filename
    avatar_type = db.Column(db.String(10), default='url')     # 'url', 'local', 'base64'
    
    def get_avatar_url(self, request_host=None):
        """Return full avatar URL based on type"""
        if self.avatar_type == 'local' and self.avatar_filename:
            if request_host:
                return f"http://{request_host}/static/uploads/avatars/{self.avatar_filename}"
            else:
                return f"/static/uploads/avatars/{self.avatar_filename}"
        elif self.avatar_type in ['url', 'base64'] and self.avatar_url:
            return self.avatar_url
        else:
            return None
    
    def set_avatar_local(self, filename):
        """Set avatar sebagai local file"""
        self.avatar_filename = filename
        self.avatar_type = 'local'
        self.avatar_url = None
    
    def set_avatar_url(self, url):
        """Set avatar sebagai external URL atau base64"""
        self.avatar_url = url
        self.avatar_type = 'base64' if url and url.startswith('data:image/') else 'url'
        self.avatar_filename = None
    
    def remove_avatar(self):
        """Remove avatar"""
        self.avatar_url = None
        self.avatar_filename = None
        self.avatar_type = 'url'
```

## 🔧 API Endpoints

### 1. Get Profile
```
GET /api/profile/
Headers: Authorization: Bearer {token}
Response:
{
  "avatar_url": "http://localhost:5000/static/uploads/avatars/avatar_1_20251227_123456_abcd1234.jpg",
  "avatar_type": "local",
  "avatar_filename": "avatar_1_20251227_123456_abcd1234.jpg"
}
```

### 2. Upload File Avatar
```
POST /api/profile/avatar/upload
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
Body: avatar=[FILE]

Response:
{
  "message": "Avatar berhasil diupload sebagai JPG",
  "filename": "avatar_1_20251227_123456_abcd1234.jpg",
  "avatar_url": "http://localhost:5000/static/uploads/avatars/avatar_1_20251227_123456_abcd1234.jpg"
}
```

### 3. Upload URL/Base64 Avatar
```
PUT /api/profile/avatar
Headers: Authorization: Bearer {token}
Content-Type: application/json
Body:
{
  "avatar_url": "https://example.com/image.jpg"  // atau base64 data:image/...
}

Response:
{
  "message": "Avatar berhasil diupdate sebagai file lokal JPG"
}
```

### 4. Remove Avatar
```
DELETE /api/profile/avatar/remove
Headers: Authorization: Bearer {token}

Response:
{
  "message": "Avatar berhasil dihapus"
}
```

### 5. Serve Static Files
```
GET /static/uploads/avatars/{filename}
Response: [IMAGE FILE]
```

## ⚙️ File Upload Service

### FileUploadService Features
- **Allowed formats**: PNG, JPG, JPEG, GIF, WEBP
- **Max file size**: 5MB
- **Output format**: JPG (85% quality)
- **Image size**: 300x300px (dengan white background untuk transparansi)
- **Filename format**: `avatar_{user_id}_{timestamp}_{uuid}.jpg`
- **Auto resize & optimize**: Menggunakan PIL/Pillow

### Base64 to JPG Conversion
- Deteksi base64 data dengan prefix `data:image/`
- Konversi PNG/RGBA ke RGB dengan white background
- Resize dan optimasi otomatis
- Simpan sebagai JPG dengan kualitas 85%

## 🎨 Frontend Implementation

### SimpleAvatar Component
```jsx
// Robust avatar component tanpa CORS issues
<SimpleAvatar
  src={profile.avatar_url}
  alt={profile.full_name}
  fallback={profile.full_name}
  size="large"
  key={avatarKey} // Force re-render saat avatar berubah
/>
```

### Profile Upload Features
- **Dual upload modes**: File upload atau URL input
- **Real-time preview**: Preview image sebelum upload
- **Progress indicator**: Loading state saat upload
- **Error handling**: User-friendly error messages
- **Auto refresh**: Profile state ter-update otomatis

## 🔐 Security Features

### File Security
- **Secure filename**: Menggunakan `secure_filename()` dari Werkzeug
- **File type validation**: Hanya format gambar yang diizinkan
- **File size limit**: Maksimal 5MB
- **Unique naming**: Timestamp + UUID untuk mencegah collision

### Upload Security
- **JWT Authentication**: Semua endpoint memerlukan valid token
- **User isolation**: File disimpan dengan user_id dalam nama
- **Old file cleanup**: File lama dihapus saat upload baru

## 🚀 Cara Menjalankan

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt  # Install Pillow dan dependencies lain
python run.py                    # Start Flask server
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev                      # Start React dev server
```

### 3. Test System
```bash
cd backend
python test_avatar_local.py      # Comprehensive test script
python basic_test.py             # Basic functionality test
```

## 📁 File Storage Structure

### Local Avatar Files
```
backend/app/static/uploads/avatars/
├── avatar_1_20251227_123456_abcd1234.jpg
├── avatar_2_20251227_124512_efgh5678.jpg
└── avatar_3_20251227_125634_ijkl9012.jpg
```

### File Naming Convention
Format: `avatar_{user_id}_{timestamp}_{uuid}.jpg`
- `user_id`: ID user yang upload
- `timestamp`: Format YYYYMMDD_HHMMSS
- `uuid`: 8 karakter pertama dari UUID4
- Extension: Selalu `.jpg`

## 🔍 Troubleshooting

### Common Issues

1. **Pillow Import Error**
   ```bash
   pip install Pillow
   ```

2. **Static Files Not Accessible**
   - Pastikan folder `app/static/uploads/avatars/` ada
   - Check Flask static serving route di `app/__init__.py`

3. **File Upload Fails**
   - Check file size (max 5MB)
   - Check file format (PNG, JPG, JPEG, GIF, WEBP)
   - Verify JWT token validity

4. **Avatar Not Displaying in Frontend**
   - Check network requests in browser DevTools
   - Verify avatar_url in profile response
   - Check CORS settings if different domains

### Debug Tips

1. **Check Backend Logs**
   ```bash
   python run.py  # Monitor console output
   ```

2. **Test with Scripts**
   ```bash
   python test_avatar_local.py  # Full end-to-end test
   ```

3. **Browser DevTools**
   - Check Network tab for failed requests
   - Check Console for JavaScript errors
   - Verify avatar URL in Elements tab

## 📈 Performance Optimizations

### Image Processing
- **Lazy loading**: SimpleAvatar component menggunakan lazy loading
- **Caching**: Browser cache untuk static files
- **Compression**: JPG dengan 85% quality untuk balance size/quality
- **Resize**: Semua avatar di-resize ke 300x300px

### Database
- **Indexed fields**: user_id untuk quick lookup
- **Minimal storage**: Hanya simpan filename untuk local files
- **Clean references**: Auto-cleanup old file references

## 🎯 Key Features Implemented

✅ **File Upload dengan Multipart Form Data**
✅ **Base64 to JPG Conversion**
✅ **URL to Local File Download & Conversion**
✅ **Automatic Image Resize & Optimization**
✅ **Secure File Storage dengan Unique Naming**
✅ **Old File Cleanup saat Update**
✅ **Static File Serving dari Backend**
✅ **Frontend Upload dengan Preview**
✅ **Robust Error Handling & Fallbacks**
✅ **JWT Authentication untuk Semua Endpoints**

## 💡 Next Steps

1. **Production Deployment**
   - Configure nginx untuk serve static files
   - Set up proper file permissions
   - Configure max file upload size

2. **Enhanced Features**
   - Multiple avatar sizes (thumbnail, medium, large)
   - Image cropping interface
   - Batch upload untuk admin

3. **Monitoring**
   - File storage usage monitoring
   - Upload success/failure metrics
   - Performance monitoring

---

**Sistem avatar lokal UKMiverse sudah siap digunakan!** 🎉

Semua gambar akan otomatis dikonversi ke JPG dan disimpan secara lokal di server, memberikan kontrol penuh atas file dan menghindari masalah CORS dengan external URLs.
