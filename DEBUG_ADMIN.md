# 🔧 DEBUGGING ADMIN PANEL - Data Tidak Berubah

## 🎯 MASALAH
Panel admin menampilkan count yang benar (UKM 5, Users 2) tapi data tidak loading dari database.

## 🔍 LANGKAH DEBUGGING

### Step 1: Cek Backend Status
1. **Buka Terminal/Command Prompt**
2. **Jalankan backend:**
   ```bash
   # Option 1: Double-click file
   start_backend_manual.bat
   
   # Option 2: Manual
   cd backend
   python run.py
   ```
3. **Pastikan melihat pesan:**
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   ```

### Step 2: Test API Endpoints Manual
1. **Buka browser baru**
2. **Test endpoints ini:**
   - `http://localhost:5000/api/ukm/` (harus return JSON array UKM)
   - `http://localhost:5000/api/ukm/categories` (harus return categories)

### Step 3: Cek Browser Console
1. **Buka admin panel:** http://localhost:3000/admin
2. **Buka Developer Tools:** F12
3. **Lihat Console tab**
4. **Cari pesan error atau log:**
   ```
   🔄 AdminPanel - Starting to load data...
   📡 AdminPanel - Fetching UKMs from: http://localhost:5000/api/ukm/
   ```

### Step 4: Clear Cache & Reload
1. **Hard refresh:** Ctrl + Shift + R
2. **Clear storage:**
   - F12 → Application tab → Storage → Clear storage
3. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔧 SOLUSI BERDASARKAN PROBLEM

### Jika Backend Tidak Running:
```bash
cd backend
python run.py
```

### Jika CORS Error:
- Check backend console untuk CORS error
- Add CORS headers di backend

### Jika 404 Not Found:
- Check API routes di backend
- Pastikan endpoints `/api/ukm/` ada

### Jika Data Kosong tapi API Working:
- Check database connection
- Run migration scripts ulang

### Jika Tab Users Aktif (bukan UKM):
- Clear browser cache
- Check localStorage untuk activeTab

## 🎯 EXPECTED BEHAVIOR

Ketika admin panel loading dengan benar:

1. **Console logs:**
   ```
   ✅ AdminPanel - UKMs loaded successfully: [array of UKMs]
   📊 AdminPanel - UKMs count: 5
   ✅ AdminPanel - Categories loaded successfully: [array of categories]
   ```

2. **UI shows:**
   - Tab "UKM (5)" active by default
   - Table dengan 5 UKM dari database
   - Tombol Add, Edit, Delete working

3. **Browser Network tab:**
   - GET http://localhost:5000/api/ukm/ → 200 OK
   - GET http://localhost:5000/api/ukm/categories → 200 OK

## 🚀 QUICK FIX SEQUENCE

1. Start backend: `start_backend_manual.bat`
2. Wait for "Running on http://127.0.0.1:5000"
3. Test: http://localhost:5000/api/ukm/
4. Clear browser cache: Ctrl+Shift+R
5. Open admin panel: http://localhost:3000/admin
6. Check console logs

Jika masih tidak work, check console error dan laporkan!
