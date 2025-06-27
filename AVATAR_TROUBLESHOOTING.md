# 🔧 Avatar Troubleshooting Guide - UKMiverse

## ❌ Problem: Avatar tidak menampilkan apapun

### 🔍 Diagnosis Steps

1. **Buka Browser Console** (F12 → Console tab)
2. **Jalankan Debug Script**:
   ```javascript
   // Copy dan paste script ini ke console:
   const token = localStorage.getItem('token');
   const user = localStorage.getItem('user');
   console.log('Token:', token ? 'EXISTS' : 'NULL');
   console.log('User:', user);
   if (user) {
     const userData = JSON.parse(user);
     console.log('Avatar URL:', userData.avatar_url);
   }
   ```

3. **Test Backend Connection**:
   ```javascript
   fetch('http://localhost:5000/api/auth/debug')
     .then(r => console.log('Backend Status:', r.status))
     .catch(e => console.error('Backend Error:', e));
   ```

### 🛠️ Solutions Applied

#### 1. **Enhanced Avatar Display Logic**
```jsx
// Improved avatar rendering with better error handling
{profile?.avatar_url ? (
  <img
    key={`avatar-img-${avatarKey}`}
    src={profile.avatar_url}
    alt="Avatar"
    className="w-full h-full object-cover"
    style={{ display: 'block' }}
    onLoad={() => console.log('✅ Avatar loaded')}
    onError={(e) => {
      console.error('❌ Avatar error');
      e.target.style.border = '2px solid red';
    }}
  />
) : (
  <div className="flex flex-col items-center justify-center">
    <User className="w-12 h-12" />
    <span className="text-xs">No Image</span>
  </div>
)}
```

#### 2. **Forced Re-rendering System**
```jsx
// Added avatarKey counter for forced re-renders
const [avatarKey, setAvatarKey] = useState(0);

// Increment on avatar updates
setAvatarKey(prev => prev + 1);
```

#### 3. **Comprehensive Logging**
```jsx
// Detailed console logging for debugging
console.log('🔍 Profile component render:');
console.log('  - profile:', profile);
console.log('  - avatar_url:', profile?.avatar_url);
console.log('  - avatarKey:', avatarKey);
```

#### 4. **Enhanced Upload Handler**
```jsx
// Better state management in upload handler
if (response.ok) {
  const updatedProfile = await response.json();
  
  // Update all states
  setProfile(updatedProfile);
  setFormData(updatedProfile);
  updateUser(updatedProfile);
  
  // Force re-render
  setAvatarKey(prev => prev + 1);
  
  // Delayed state refresh
  setTimeout(() => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  }, 100);
}
```

### 🧪 Testing Tools Created

#### 1. **Debug Script** (`frontend/debug-profile.js`)
- Check localStorage data
- Test API connectivity
- Verify token validity

#### 2. **Avatar Debug Page** (`frontend/avatar-debug.html`)
- Standalone avatar testing
- Visual feedback
- Multiple test scenarios

#### 3. **Backend Test Script** (`backend/test_avatar_display.py`)
- API endpoint testing
- Upload verification
- Response validation

### 📋 Step-by-Step Troubleshooting

#### Step 1: Check if Backend is Running
```bash
cd backend
python run.py
```
Expected: Server running on http://localhost:5000

#### Step 2: Check Login Status
1. Open browser console (F12)
2. Check if logged in:
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   console.log('User:', localStorage.getItem('user'));
   ```

#### Step 3: Test Avatar Display
1. Open: `frontend/avatar-debug.html`
2. Try test URLs:
   - `https://via.placeholder.com/150/FF0000/FFFFFF?text=Test`
   - Upload a small image file

#### Step 4: Check Profile Data
1. Go to Profile page
2. Open console
3. Look for logs starting with "🔍 Profile component render"
4. Check if `profile.avatar_url` exists

#### Step 5: Test Avatar Upload
1. In Profile page, click "Ubah Foto Profil"
2. Try URL: `https://via.placeholder.com/150`
3. Check console for upload logs starting with "📤 Sending avatar update"

### 🚨 Common Issues & Fixes

#### Issue 1: "Profile tidak dimuat"
**Solution:**
- Restart backend server
- Clear localStorage and login again
- Check if token expired

#### Issue 2: "Avatar upload berhasil tapi tidak tampil"
**Solution:**
- Check console for error messages
- Try simple URL like `https://via.placeholder.com/150`
- Force refresh dengan Ctrl+F5

#### Issue 3: "Base64 image tidak tampil"
**Solution:**
- Check file size (max ~1MB recommended)
- Verify base64 format
- Use debug tool to test conversion

#### Issue 4: "CORS Error"
**Solution:**
```python
# In backend/app/__init__.py
from flask_cors import CORS
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])
```

### 🎯 Expected Results

After applying all fixes:

✅ **Avatar should display immediately after upload**  
✅ **Both URL and file upload should work**  
✅ **Consistent display across profile page and header**  
✅ **Graceful error handling for broken images**  
✅ **No page refresh needed for updates**

### 📞 Quick Debug Commands

```javascript
// In browser console - check current state
console.log('=== AVATAR DEBUG ===');
console.log('Profile:', window.React?.version ? 'React app detected' : 'No React');
console.log('Token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
console.log('User data:', JSON.parse(localStorage.getItem('user') || '{}'));

// Test backend
fetch('http://localhost:5000/api/profile/', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
.then(r => r.json())
.then(data => console.log('Profile API:', data))
.catch(e => console.error('API Error:', e));
```

### 🔧 Manual Override (Emergency Fix)

If avatar still not showing, use this in browser console:

```javascript
// Force set avatar in localStorage
const user = JSON.parse(localStorage.getItem('user'));
user.avatar_url = 'https://via.placeholder.com/150/0000FF/FFFFFF?text=TEST';
localStorage.setItem('user', JSON.stringify(user));
window.location.reload();
```

---

**Files Modified:**
- `frontend/src/pages/Profile.jsx` - Enhanced avatar logic
- `frontend/debug-profile.js` - Debug script
- `frontend/avatar-debug.html` - Testing tool
- `backend/test_avatar_display.py` - API testing

**Next Steps:**
1. Test dengan debug tools
2. Check console logs
3. Verify backend is running
4. Try simple URL upload first
5. Report specific error messages if still failing
