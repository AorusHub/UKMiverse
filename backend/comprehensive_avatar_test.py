#!/usr/bin/env python3
"""
Comprehensive Avatar Testing Script - UKMiverse
Test semua aspek avatar loading: backend, frontend, URL validation, dan fallback
"""

import requests
import json
import time
import base64
from urllib.parse import urlparse
import sys
import os

class AvatarTester:
    def __init__(self, api_base_url="http://localhost:5000/api"):
        self.api_base_url = api_base_url
        self.session = requests.Session()
        self.auth_token = None
        
        # Test URLs with different characteristics
        self.test_urls = [
            # Highly reliable placeholder services
            "https://via.placeholder.com/150/9333ea/FFFFFF?text=TEST1",
            "https://via.placeholder.com/150/0066cc/FFFFFF?text=TEST2", 
            "https://dummyimage.com/150x150/28a745/ffffff&text=OK",
            "https://ui-avatars.com/api/?name=Test+User&size=150&background=9333ea&color=fff",
            
            # Real image services (may have CORS issues)
            "https://picsum.photos/150/150?random=1",
            "https://www.gravatar.com/avatar/0?d=mp&s=150",
            "https://avatars.githubusercontent.com/u/1?v=4",
            
            # Problematic URLs for testing error handling
            "https://httpbin.org/status/404",  # 404 error
            "https://example.com/nonexistent.jpg",  # Non-existent
            "http://insecure-image.com/test.jpg",  # HTTP on HTTPS (mixed content)
            "invalid-url-format",  # Invalid format
            ""  # Empty URL
        ]
    
    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🔧 {title}")
        print('='*60)
    
    def print_section(self, title):
        print(f"\n🔍 {title}")
        print('-'*40)
    
    def login_and_get_token(self, username="testuser", password="testpass123"):
        """Login and get authentication token"""
        self.print_section("Authentication Test")
        
        try:
            response = self.session.post(f"{self.api_base_url}/auth/login", json={
                "username": username,
                "password": password
            })
            
            if response.status_code == 200:
                data = response.json()
                self.auth_token = data.get('access_token')
                print(f"✅ Login successful")
                print(f"   Token: {self.auth_token[:20]}...")
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False
    
    def test_url_accessibility(self, url, timeout=5):
        """Test if URL is accessible and returns image"""
        try:
            if not url:
                return {"success": False, "error": "Empty URL"}
            
            # Basic URL validation
            parsed = urlparse(url)
            if not parsed.scheme or not parsed.netloc:
                return {"success": False, "error": "Invalid URL format"}
            
            # Test HTTP request
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
            
            response = requests.head(url, timeout=timeout, headers=headers, allow_redirects=True)
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '').lower()
                if 'image' in content_type:
                    return {
                        "success": True, 
                        "content_type": content_type,
                        "size": response.headers.get('content-length', 'unknown')
                    }
                else:
                    return {"success": False, "error": f"Not an image: {content_type}"}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
        except requests.exceptions.Timeout:
            return {"success": False, "error": "Timeout"}
        except requests.exceptions.ConnectionError:
            return {"success": False, "error": "Connection failed"}
        except requests.exceptions.RequestException as e:
            return {"success": False, "error": f"Request error: {e}"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {e}"}
    
    def test_backend_avatar_update(self, avatar_url):
        """Test avatar update via backend API"""
        if not self.auth_token:
            return {"success": False, "error": "Not authenticated"}
        
        try:
            headers = {
                'Authorization': f'Bearer {self.auth_token}',
                'Content-Type': 'application/json'
            }
            
            response = self.session.put(
                f"{self.api_base_url}/profile/",
                headers=headers,
                json={"avatar_url": avatar_url}
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "profile": data,
                    "avatar_url": data.get('avatar_url')
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            return {"success": False, "error": f"Backend error: {e}"}
    
    def test_url_batch(self):
        """Test all URLs for accessibility"""
        self.print_section("URL Accessibility Test")
        
        results = []
        for i, url in enumerate(self.test_urls, 1):
            print(f"\n🔗 Testing URL {i}: {url[:50]}{'...' if len(url) > 50 else ''}")
            
            result = self.test_url_accessibility(url)
            results.append({"url": url, "result": result})
            
            if result["success"]:
                print(f"   ✅ Accessible")
                if "content_type" in result:
                    print(f"   📄 Type: {result['content_type']}")
                if "size" in result:
                    print(f"   📐 Size: {result['size']}")
            else:
                print(f"   ❌ {result['error']}")
            
            # Small delay to avoid overwhelming servers
            time.sleep(0.5)
        
        # Summary
        successful = [r for r in results if r["result"]["success"]]
        failed = [r for r in results if not r["result"]["success"]]
        
        print(f"\n📊 Summary:")
        print(f"   ✅ Accessible: {len(successful)}/{len(results)}")
        print(f"   ❌ Failed: {len(failed)}/{len(results)}")
        
        if successful:
            print(f"\n🎯 Recommended URLs (working):")
            for i, item in enumerate(successful[:3], 1):
                print(f"   {i}. {item['url']}")
        
        return results
    
    def test_backend_integration(self):
        """Test backend avatar update with working URLs"""
        self.print_section("Backend Integration Test")
        
        if not self.auth_token:
            print("❌ Skipping backend tests - not authenticated")
            return
        
        # Test with a known working URL
        working_url = "https://via.placeholder.com/150/28a745/FFFFFF?text=BACKEND"
        print(f"🔗 Testing backend update with: {working_url}")
        
        result = self.test_backend_avatar_update(working_url)
        
        if result["success"]:
            print("✅ Backend update successful")
            print(f"   Avatar URL stored: {result['avatar_url'][:50]}...")
            
            # Verify the stored URL is accessible
            print("\n🔍 Verifying stored avatar URL...")
            verify_result = self.test_url_accessibility(result['avatar_url'])
            
            if verify_result["success"]:
                print("✅ Stored avatar URL is accessible")
            else:
                print(f"❌ Stored avatar URL not accessible: {verify_result['error']}")
        else:
            print(f"❌ Backend update failed: {result['error']}")
    
    def test_base64_conversion(self):
        """Test base64 image conversion and validation"""
        self.print_section("Base64 Conversion Test")
        
        # Create a simple test image (1x1 pixel PNG)
        test_png_data = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        )
        test_base64 = f"data:image/png;base64,{base64.b64encode(test_png_data).decode()}"
        
        print(f"🖼️ Generated test base64 image")
        print(f"   Length: {len(test_base64)} characters")
        print(f"   Format: {test_base64[:50]}...")
        
        # Test backend update with base64
        if self.auth_token:
            print("\n🔗 Testing backend update with base64...")
            result = self.test_backend_avatar_update(test_base64)
            
            if result["success"]:
                print("✅ Base64 update successful")
                stored_url = result['avatar_url']
                if stored_url.startswith('data:image/'):
                    print("✅ Base64 format preserved in database")
                else:
                    print("⚠️ Base64 format changed in database")
            else:
                print(f"❌ Base64 update failed: {result['error']}")
        else:
            print("❌ Skipping base64 backend test - not authenticated")
    
    def generate_recommendations(self):
        """Generate recommendations based on test results"""
        self.print_section("Recommendations")
        
        print("🎯 Based on test results, here are recommendations:")
        print()
        print("1. ✅ SAFE URLS (use these for guaranteed success):")
        safe_urls = [
            "https://via.placeholder.com/150/9333ea/FFFFFF?text=USER",
            "https://dummyimage.com/150x150/28a745/ffffff&text=OK",
            "https://ui-avatars.com/api/?name=Your+Name&size=150&background=9333ea&color=fff"
        ]
        for i, url in enumerate(safe_urls, 1):
            print(f"   {i}. {url}")
        
        print()
        print("2. 🔧 ERROR HANDLING IMPROVEMENTS:")
        print("   - Use multiple fallback URLs")
        print("   - Implement retry logic with different CORS settings")
        print("   - Show user-friendly error messages")
        print("   - Provide quick-fix buttons with working URLs")
        
        print()
        print("3. 🌐 FRONTEND FIXES:")
        print("   - Add crossOrigin='anonymous' and referrerPolicy='no-referrer'")
        print("   - Implement progressive fallback (try different settings)")
        print("   - Cache successful URLs to avoid re-validation")
        print("   - Show loading states during validation")
        
        print()
        print("4. 🚀 BACKEND OPTIMIZATIONS:")
        print("   - Validate URLs before storing (with timeout)")
        print("   - Store fallback URL if original fails")
        print("   - Return validation status in API response")
        print("   - Consider image proxy for external URLs")
    
    def run_full_test(self):
        """Run comprehensive avatar testing suite"""
        self.print_header("COMPREHENSIVE AVATAR TESTING SUITE")
        
        print("🎯 This script will test:")
        print("   • URL accessibility and validation")
        print("   • Backend API avatar updates")  
        print("   • Base64 image conversion")
        print("   • Error handling scenarios")
        print("   • Generate recommendations")
        
        # Test URL accessibility
        url_results = self.test_url_batch()
        
        # Try to authenticate for backend tests
        if self.login_and_get_token():
            # Test backend integration
            self.test_backend_integration()
            
            # Test base64 conversion
            self.test_base64_conversion()
        else:
            print("\n⚠️ Skipping backend tests - authentication failed")
            print("   Make sure backend server is running and user exists")
        
        # Generate recommendations
        self.generate_recommendations()
        
        self.print_header("TEST COMPLETE")
        print("🏁 Avatar testing suite finished!")
        print("📋 Check the results above for recommendations")

def main():
    """Main function"""
    print("🔧 UKMiverse Avatar Testing Suite")
    print("="*50)
    
    # Check if backend is accessible
    try:
        response = requests.get("http://localhost:5000/api/auth/debug", timeout=5)
        print("✅ Backend server is accessible")
    except:
        print("❌ Backend server not accessible at http://localhost:5000")
        print("   Please start the backend server first")
        sys.exit(1)
    
    # Run tests
    tester = AvatarTester()
    tester.run_full_test()

if __name__ == "__main__":
    main()
