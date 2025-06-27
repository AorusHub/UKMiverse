// Debug script untuk memeriksa state login dan profile
// Jalankan di console browser untuk troubleshooting

console.log('=== UKMiverse Debug Info ===');

// Check localStorage
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

console.log('📦 localStorage:');
console.log('  - Token:', token ? token.substring(0, 20) + '...' : 'null');
console.log('  - User string:', userStr);

if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('  - User object:', user);
    console.log('  - User avatar_url:', user.avatar_url);
  } catch (e) {
    console.error('  - Error parsing user:', e);
  }
}

// Check if currently logged in
console.log('\n🔐 Auth Status:');
console.log('  - Has token:', !!token);
console.log('  - Has user:', !!userStr);

// Test API connection
if (token) {
  console.log('\n🌐 Testing API...');
  
  fetch('http://localhost:5000/api/profile/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('📡 API Response:');
    console.log('  - Status:', response.status);
    console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(profile => {
    console.log('✅ Profile data:');
    console.log('  - Full profile:', profile);
    console.log('  - Avatar URL:', profile.avatar_url);
    console.log('  - Avatar type:', typeof profile.avatar_url);
    console.log('  - Avatar length:', profile.avatar_url ? profile.avatar_url.length : 0);
    
    if (profile.avatar_url) {
      console.log('  - Is base64?', profile.avatar_url.startsWith('data:'));
      console.log('  - Preview:', profile.avatar_url.substring(0, 100) + '...');
    }
  })
  .catch(error => {
    console.error('❌ API Error:', error);
  });
} else {
  console.log('⚠️ No token found - user not logged in');
}

// Check if backend is running
console.log('\n🏠 Testing backend...');
fetch('http://localhost:5000/api/auth/debug')
  .then(response => {
    console.log('✅ Backend is running');
    console.log('  - Status:', response.status);
  })
  .catch(error => {
    console.error('❌ Backend not accessible:', error.message);
    console.log('💡 Make sure to start backend with: python run.py');
  });

console.log('\n🎯 Next Steps:');
console.log('1. Make sure backend is running (python run.py)');
console.log('2. Make sure you are logged in');
console.log('3. Check console for avatar upload errors');
console.log('4. Try uploading a simple image URL like: https://via.placeholder.com/150');
console.log('\n=== End Debug ===');
