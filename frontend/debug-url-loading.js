// Debug Script untuk masalah "URL gambar tidak dapat dimuat"
// Copy dan paste script ini ke browser console (F12)

console.log('🔧 UKMiverse Avatar Debug - URL Loading Issues');
console.log('================================================');

// Test URLs that are guaranteed to work
const workingUrls = [
    'https://via.placeholder.com/150/9333ea/FFFFFF?text=TEST1',
    'https://via.placeholder.com/150/dc2626/FFFFFF?text=TEST2',
    'https://dummyimage.com/150x150/9333ea/ffffff&text=Avatar',
    'https://httpbin.org/image/png'
];

// Function to test URL
function testImageUrl(url, name = '') {
    return new Promise((resolve) => {
        console.log(`🔍 Testing ${name}: ${url}`);
        
        const img = new Image();
        const startTime = Date.now();
        
        img.onload = function() {
            const loadTime = Date.now() - startTime;
            console.log(`✅ ${name} SUCCESS (${loadTime}ms) - ${img.naturalWidth}x${img.naturalHeight}`);
            resolve({ url, success: true, loadTime, dimensions: `${img.naturalWidth}x${img.naturalHeight}` });
        };
        
        img.onerror = function() {
            const loadTime = Date.now() - startTime;
            console.log(`❌ ${name} FAILED (${loadTime}ms)`);
            resolve({ url, success: false, loadTime });
        };
        
        img.src = url;
    });
}

// Test all working URLs
async function testWorkingUrls() {
    console.log('\n📋 Testing Working URLs:');
    const results = [];
    
    for (let i = 0; i < workingUrls.length; i++) {
        const result = await testImageUrl(workingUrls[i], `Test ${i + 1}`);
        results.push(result);
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n📊 Results: ${successCount}/${results.length} URLs working`);
    
    if (successCount > 0) {
        console.log('\n✅ Recommended URLs for UKMiverse:');
        results.filter(r => r.success).forEach((r, i) => {
            console.log(`${i + 1}. ${r.url}`);
        });
        console.log('\nCopy salah satu URL di atas dan paste ke form upload avatar UKMiverse');
    } else {
        console.log('\n❌ No URLs working - possible network issues');
    }
    
    return results;
}

// Check current user avatar
function checkCurrentAvatar() {
    console.log('\n👤 Current User Avatar:');
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        
        console.log('User:', user.username || 'Not found');
        console.log('Token:', token ? 'EXISTS' : 'MISSING');
        console.log('Avatar URL:', user.avatar_url || 'None');
        
        if (user.avatar_url) {
            testImageUrl(user.avatar_url, 'Current Avatar').then(result => {
                if (!result.success) {
                    console.log('\n⚠️ Current avatar URL is broken!');
                    console.log('💡 Solution: Upload new avatar with working URL from test above');
                }
            });
        }
        
        return user;
    } catch (e) {
        console.log('❌ Error reading user data:', e);
        return null;
    }
}

// Test API connectivity
async function testApiConnection() {
    console.log('\n🌐 Testing API Connection:');
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('❌ No token found - user not logged in');
            return false;
        }
        
        const response = await fetch('http://localhost:5000/api/profile/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API working - Profile data retrieved');
            console.log('Avatar in API:', data.avatar_url || 'None');
            return true;
        } else {
            console.log('❌ API error:', response.statusText);
            return false;
        }
    } catch (e) {
        console.log('❌ API connection failed:', e.message);
        console.log('💡 Make sure backend is running: python run.py');
        return false;
    }
}

// Emergency fix function
async function emergencyAvatarFix() {
    console.log('\n🚨 Emergency Avatar Fix:');
    
    const workingUrl = 'https://via.placeholder.com/150/9333ea/FFFFFF?text=FIXED';
    
    // Test if URL works first
    const testResult = await testImageUrl(workingUrl, 'Emergency URL');
    if (!testResult.success) {
        console.log('❌ Emergency URL also not working - network issues');
        return false;
    }
    
    // Try to upload
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('❌ No login token - please login first');
        return false;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/profile/', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ avatar_url: workingUrl })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Emergency avatar uploaded successfully!');
            console.log('New avatar URL:', data.avatar_url);
            
            // Update localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.avatar_url = data.avatar_url;
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('💡 Refresh page to see changes');
            return true;
        } else {
            console.log('❌ Upload failed:', response.status);
            return false;
        }
    } catch (e) {
        console.log('❌ Upload error:', e.message);
        return false;
    }
}

// Main diagnostic function
async function runFullDiagnostic() {
    console.log('🏁 Running Full Diagnostic...\n');
    
    // Step 1: Check user status
    const user = checkCurrentAvatar();
    
    // Step 2: Test API
    const apiWorking = await testApiConnection();
    
    // Step 3: Test working URLs
    const urlResults = await testWorkingUrls();
    
    // Step 4: Summary and recommendations
    console.log('\n📋 DIAGNOSTIC SUMMARY:');
    console.log('=====================');
    console.log('User logged in:', !!user && !!localStorage.getItem('token'));
    console.log('API working:', apiWorking);
    console.log('Working URLs available:', urlResults.filter(r => r.success).length);
    
    console.log('\n💡 RECOMMENDED ACTIONS:');
    if (!user || !localStorage.getItem('token')) {
        console.log('1. Login ke UKMiverse terlebih dahulu');
    } else if (!apiWorking) {
        console.log('1. Start backend server: python run.py');
        console.log('2. Check if backend is running on http://localhost:5000');
    } else if (urlResults.filter(r => r.success).length === 0) {
        console.log('1. Check internet connection');
        console.log('2. Try using mobile hotspot');
        console.log('3. Check firewall/antivirus blocking image requests');
    } else {
        console.log('1. Use one of the working URLs from test above');
        console.log('2. Or run emergencyAvatarFix() to auto-fix with working URL');
    }
}

// Auto-run diagnostic
runFullDiagnostic();

// Export functions for manual use
window.ukmiverse_debug = {
    testImageUrl,
    testWorkingUrls,
    checkCurrentAvatar, 
    testApiConnection,
    emergencyAvatarFix,
    runFullDiagnostic
};

console.log('\n🛠️ Available Commands:');
console.log('- ukmiverse_debug.testWorkingUrls() - Test working URLs');
console.log('- ukmiverse_debug.emergencyAvatarFix() - Auto-fix with working URL');
console.log('- ukmiverse_debug.runFullDiagnostic() - Run full diagnostic');
console.log('- ukmiverse_debug.testImageUrl("URL") - Test specific URL');
