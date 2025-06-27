/**
 * Avatar Fix Utility - UKMiverse
 * Utility untuk memperbaiki masalah loading avatar secara otomatis
 */

class AvatarFixUtility {
    constructor() {
        this.fallbackUrls = [
            'https://via.placeholder.com/150/9333ea/FFFFFF?text=USER',
            'https://via.placeholder.com/150/0066cc/FFFFFF?text=AVATAR',
            'https://dummyimage.com/150x150/28a745/ffffff&text=OK',
            'https://ui-avatars.com/api/?name=User&size=150&background=9333ea&color=fff'
        ];
        
        this.emergencyUrls = [
            'https://via.placeholder.com/150/6c757d/FFFFFF?text=DEFAULT',
            'https://dummyimage.com/150x150/6c757d/ffffff&text=User'
        ];

        this.debugMode = true;
        this.retryCount = new Map(); // Track retry attempts per URL
        this.successfulUrls = new Set(); // Cache successful URLs
        this.failedUrls = new Set(); // Cache failed URLs
    }

    log(message, type = 'info') {
        if (!this.debugMode) return;
        
        const emoji = {
            'info': 'ℹ️',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'debug': '🔍'
        }[type] || 'ℹ️';
        
        console.log(`${emoji} [AvatarFix] ${message}`);
    }

    /**
     * Validate image URL with multiple strategies
     */
    async validateImageUrl(url, options = {}) {
        const {
            timeout = 5000,
            allowInsecure = false,
            skipNetworkTest = false
        } = options;

        this.log(`Validating URL: ${url?.substring(0, 100)}...`, 'debug');

        if (!url) {
            this.log('No URL provided', 'error');
            return { valid: false, reason: 'No URL provided' };
        }

        // Check if we've already tested this URL
        if (this.successfulUrls.has(url)) {
            this.log('URL found in success cache', 'success');
            return { valid: true, reason: 'Cached success' };
        }

        if (this.failedUrls.has(url)) {
            this.log('URL found in failure cache', 'warning');
            return { valid: false, reason: 'Cached failure' };
        }

        // Base64 image validation
        if (url.startsWith('data:image/')) {
            const isValid = this.validateBase64Image(url);
            if (isValid.valid) {
                this.successfulUrls.add(url);
            } else {
                this.failedUrls.add(url);
            }
            return isValid;
        }

        // URL format validation
        try {
            const urlObj = new URL(url);
            
            // Security check
            if (!allowInsecure && urlObj.protocol === 'http:' && window.location.protocol === 'https:') {
                this.log('HTTP URL on HTTPS site - may be blocked', 'warning');
                return { valid: false, reason: 'Mixed content (HTTP on HTTPS)' };
            }

            // Skip network test if requested
            if (skipNetworkTest) {
                this.log('Skipping network test', 'info');
                return { valid: true, reason: 'Format valid (network test skipped)' };
            }

            // Network validation
            return await this.testImageLoad(url, timeout);

        } catch (error) {
            this.log(`Invalid URL format: ${error.message}`, 'error');
            this.failedUrls.add(url);
            return { valid: false, reason: `Invalid URL format: ${error.message}` };
        }
    }

    /**
     * Validate base64 image
     */
    validateBase64Image(dataUrl) {
        this.log('Validating base64 image', 'debug');
        
        // Check basic format
        const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp|bmp|svg\+xml);base64,/i;
        if (!base64Regex.test(dataUrl)) {
            return { valid: false, reason: 'Invalid base64 format' };
        }

        // Check if base64 data exists and has reasonable length
        const base64Data = dataUrl.split(',')[1];
        if (!base64Data || base64Data.length < 100) {
            return { valid: false, reason: 'Base64 data too short or missing' };
        }

        // Try to decode base64 to check validity
        try {
            atob(base64Data);
            this.log('Base64 validation successful', 'success');
            return { valid: true, reason: 'Valid base64 image' };
        } catch (error) {
            return { valid: false, reason: 'Invalid base64 encoding' };
        }
    }

    /**
     * Test image loading with Promise
     */
    testImageLoad(url, timeout = 5000) {
        return new Promise((resolve) => {
            const img = new Image();
            let resolved = false;

            const cleanup = () => {
                if (!resolved) {
                    resolved = true;
                    img.onload = img.onerror = null;
                }
            };

            const timeoutId = setTimeout(() => {
                cleanup();
                this.log(`Timeout testing URL: ${url}`, 'warning');
                this.failedUrls.add(url);
                resolve({ valid: false, reason: 'Timeout' });
            }, timeout);

            img.onload = () => {
                cleanup();
                clearTimeout(timeoutId);
                this.log(`Successfully loaded: ${url}`, 'success');
                this.successfulUrls.add(url);
                resolve({ 
                    valid: true, 
                    reason: `Loaded successfully (${img.naturalWidth}x${img.naturalHeight})` 
                });
            };

            img.onerror = () => {
                cleanup();
                clearTimeout(timeoutId);
                this.log(`Failed to load: ${url}`, 'error');
                this.failedUrls.add(url);
                resolve({ valid: false, reason: 'Failed to load' });
            };

            // Set image properties for better compatibility
            img.crossOrigin = 'anonymous';
            img.referrerPolicy = 'no-referrer';
            img.src = url;
        });
    }

    /**
     * Get fallback URL for failed avatar
     */
    getFallbackUrl(originalUrl = '', userInfo = {}) {
        const { name = 'User', id = '', preferred_color = '9333ea' } = userInfo;
        
        // Generate different fallbacks based on user info
        const fallbacks = [
            `https://via.placeholder.com/150/${preferred_color}/FFFFFF?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=${preferred_color}&color=fff`,
            `https://dummyimage.com/150x150/${preferred_color}/ffffff&text=${encodeURIComponent(name.substring(0, 2).toUpperCase())}`,
            ...this.fallbackUrls,
            ...this.emergencyUrls
        ];

        // Return first fallback that hasn't failed before
        for (const fallback of fallbacks) {
            if (!this.failedUrls.has(fallback)) {
                this.log(`Using fallback: ${fallback}`, 'info');
                return fallback;
            }
        }

        // If all fallbacks failed, return the most reliable emergency URL
        this.log('All fallbacks failed, using emergency URL', 'warning');
        return this.emergencyUrls[0];
    }

    /**
     * Fix avatar image element with retry logic
     */
    async fixAvatarElement(imgElement, options = {}) {
        const {
            userInfo = {},
            maxRetries = 3,
            retryDelay = 1000,
            onSuccess = null,
            onFailure = null,
            onRetry = null
        } = options;

        const originalSrc = imgElement.src;
        const retryKey = originalSrc;
        
        if (!this.retryCount.has(retryKey)) {
            this.retryCount.set(retryKey, 0);
        }

        const currentRetry = this.retryCount.get(retryKey);
        
        this.log(`Fixing avatar element (retry ${currentRetry}/${maxRetries})`, 'debug');

        if (currentRetry >= maxRetries) {
            this.log('Max retries reached, using fallback', 'warning');
            const fallbackUrl = this.getFallbackUrl(originalSrc, userInfo);
            imgElement.src = fallbackUrl;
            if (onFailure) onFailure(fallbackUrl);
            return fallbackUrl;
        }

        // Increment retry count
        this.retryCount.set(retryKey, currentRetry + 1);

        // Validate current URL
        const validation = await this.validateImageUrl(originalSrc, {
            timeout: 3000,
            skipNetworkTest: currentRetry > 1 // Skip network test on later retries
        });

        if (validation.valid) {
            this.log('URL validation passed, reloading image', 'success');
            // Force reload by adding cache buster
            const cacheBuster = `_retry=${Date.now()}`;
            const separator = originalSrc.includes('?') ? '&' : '?';
            imgElement.src = originalSrc + separator + cacheBuster;
            if (onSuccess) onSuccess(imgElement.src);
            return imgElement.src;
        }

        // Try different loading strategies
        if (currentRetry === 1) {
            this.log('Trying without CORS restrictions', 'info');
            imgElement.crossOrigin = '';
            imgElement.referrerPolicy = '';
            if (onRetry) onRetry('no-cors');
            
            // Wait and retry
            setTimeout(() => {
                imgElement.src = originalSrc + `?_nocors=${Date.now()}`;
            }, retryDelay);
            
        } else if (currentRetry === 2) {
            this.log('Trying with proxy/different approach', 'info');
            if (onRetry) onRetry('proxy');
            
            // Try a different approach or use fallback
            const fallbackUrl = this.getFallbackUrl(originalSrc, userInfo);
            
            setTimeout(() => {
                imgElement.src = fallbackUrl;
                if (onSuccess) onSuccess(fallbackUrl);
            }, retryDelay);
            
            return fallbackUrl;
        }

        return originalSrc;
    }

    /**
     * Setup automatic avatar fixing for all avatar images
     */
    setupAutoFix(options = {}) {
        const {
            selector = '.avatar-image, .user-avatar, img[data-avatar]',
            userInfoSelector = '[data-user-info]',
            retryDelay = 2000
        } = options;

        this.log('Setting up automatic avatar fixing', 'info');

        // Find all avatar images
        const avatarImages = document.querySelectorAll(selector);
        
        avatarImages.forEach((img, index) => {
            this.log(`Setting up auto-fix for avatar ${index + 1}`, 'debug');
            
            // Get user info if available
            let userInfo = {};
            const userInfoElement = img.closest('[data-user-info]') || 
                                   document.querySelector(userInfoSelector);
            if (userInfoElement) {
                try {
                    userInfo = JSON.parse(userInfoElement.dataset.userInfo || '{}');
                } catch (e) {
                    this.log('Failed to parse user info', 'warning');
                }
            }

            // Setup error handler
            const originalOnError = img.onerror;
            img.onerror = async (event) => {
                this.log(`Avatar load failed, applying fix...`, 'warning');
                
                await this.fixAvatarElement(img, {
                    userInfo,
                    onSuccess: (newSrc) => {
                        this.log(`Avatar fixed with: ${newSrc.substring(0, 50)}...`, 'success');
                    },
                    onFailure: (fallbackSrc) => {
                        this.log(`Used fallback: ${fallbackSrc.substring(0, 50)}...`, 'warning');
                    },
                    onRetry: (strategy) => {
                        this.log(`Retrying with strategy: ${strategy}`, 'info');
                    }
                });

                // Call original error handler if it exists
                if (originalOnError) {
                    originalOnError.call(img, event);
                }
            };

            // Also setup load success handler for caching
            const originalOnLoad = img.onload;
            img.onload = (event) => {
                this.successfulUrls.add(img.src);
                this.log(`Avatar loaded successfully: ${img.src.substring(0, 50)}...`, 'success');
                
                if (originalOnLoad) {
                    originalOnLoad.call(img, event);
                }
            };
        });

        this.log(`Auto-fix setup complete for ${avatarImages.length} avatars`, 'success');
        return avatarImages.length;
    }

    /**
     * Test and recommend best URLs from a list
     */
    async testAndRecommendUrls(urls, options = {}) {
        const { timeout = 3000, maxConcurrent = 5 } = options;
        
        this.log(`Testing ${urls.length} URLs for recommendations`, 'info');
        
        const results = [];
        
        // Test URLs in batches to avoid overwhelming the network
        for (let i = 0; i < urls.length; i += maxConcurrent) {
            const batch = urls.slice(i, i + maxConcurrent);
            const batchPromises = batch.map(async (url) => {
                const validation = await this.validateImageUrl(url, { timeout });
                return {
                    url,
                    valid: validation.valid,
                    reason: validation.reason,
                    score: this.scoreUrl(url, validation)
                };
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            // Small delay between batches
            if (i + maxConcurrent < urls.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Sort by score (higher is better)
        results.sort((a, b) => b.score - a.score);
        
        const validUrls = results.filter(r => r.valid);
        const invalidUrls = results.filter(r => !r.valid);
        
        this.log(`Testing complete: ${validUrls.length} valid, ${invalidUrls.length} invalid`, 'success');
        
        return {
            valid: validUrls,
            invalid: invalidUrls,
            recommended: validUrls.slice(0, 5), // Top 5 recommendations
            all: results
        };
    }

    /**
     * Score URL based on reliability factors
     */
    scoreUrl(url, validation) {
        let score = 0;
        
        if (validation.valid) score += 100;
        
        // Prefer HTTPS
        if (url.startsWith('https://')) score += 20;
        
        // Prefer known reliable services
        const reliableServices = ['placeholder.com', 'dummyimage.com', 'gravatar.com'];
        if (reliableServices.some(service => url.includes(service))) score += 15;
        
        // Prefer shorter URLs (less likely to break)
        if (url.length < 100) score += 10;
        
        // Prefer URLs without special characters
        if (!/[^a-zA-Z0-9:\/\.\-_?&=]/.test(url)) score += 5;
        
        return score;
    }

    /**
     * Clear caches and reset retry counts
     */
    reset() {
        this.successfulUrls.clear();
        this.failedUrls.clear();
        this.retryCount.clear();
        this.log('Utility reset - all caches cleared', 'info');
    }

    /**
     * Get debug information
     */
    getDebugInfo() {
        return {
            successfulUrls: Array.from(this.successfulUrls),
            failedUrls: Array.from(this.failedUrls),
            retryCount: Object.fromEntries(this.retryCount),
            cacheStats: {
                successful: this.successfulUrls.size,
                failed: this.failedUrls.size,
                retries: this.retryCount.size
            }
        };
    }
}

// Global instance
window.AvatarFixUtility = AvatarFixUtility;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.avatarFixer = new AvatarFixUtility();
        console.log('🔧 AvatarFixUtility initialized and ready');
    });
} else {
    window.avatarFixer = new AvatarFixUtility();
    console.log('🔧 AvatarFixUtility initialized and ready');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarFixUtility;
}
