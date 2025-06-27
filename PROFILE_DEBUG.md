# Profile Debug Guide

## Problem: Profile tidak tampil

### Steps untuk debugging:

1. **Start Backend Server**
   ```bash
   cd backend
   python run_debug.py
   ```
   Server akan berjalan di http://127.0.0.1:5000

2. **Start Frontend Server**
   Frontend sudah berjalan di http://localhost:5176

3. **Test Login Flow**
   - Buka http://localhost:5176
   - Login dengan user yang sudah ada
   - Perhatikan console browser (F12) untuk logs

4. **Check Console Logs**
   Periksa browser console untuk:
   - Token status
   - Profile fetch request
   - Response status codes
   - Error messages

5. **Backend Console Logs**
   Periksa terminal backend untuk:
   - Profile GET request logs
   - User ID dari JWT
   - Database query results
   - Error traces

### Perbaikan yang sudah dilakukan:

1. ✅ **Enhanced Frontend Logging**
   - Detailed token checking
   - Response status logging
   - Better error messages

2. ✅ **Backend Debugging**
   - Added console logs in profile route
   - Better error handling
   - JWT user ID logging

3. ✅ **CORS Configuration**
   - Specific origins allowed
   - All necessary headers
   - All HTTP methods

4. ✅ **Token Dependency**
   - useEffect now depends on token
   - Profile fetch only when token exists

5. ✅ **Loading States**
   - Better loading indicators
   - Retry button when no data
   - Clear error messages

### Expected Console Output:

**Frontend:**
```
Fetching profile with token: Token exists
Token value: eyJhbGciOiJIUzI1NiIs...
Profile fetch response status: 200
Profile data received: {...}
```

**Backend:**
```
Profile GET request from user ID: 1
Found user: username (ID: 1)
Profile data prepared with keys: [...]
```

### If Still Not Working:

1. Check if backend server is running on port 5000
2. Verify token in localStorage
3. Check network requests in DevTools
4. Look for CORS errors
5. Verify database connection

### Test Commands:
```bash
# Test backend directly
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/profile/

# Check if server responds
curl http://localhost:5000/api/ukm/
```
