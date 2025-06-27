import React, { useState, useEffect } from 'react';
import { User, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Simple Avatar Component - No CORS, No Complex Logic
 * Fokus pada reliability dan simplicity
 */
const SimpleAvatar = ({ 
  src, 
  alt = "Avatar", 
  className = "", 
  size = "150",
  fallbackText = "U",
  onAvatarClick,
  showFallbackButton = true
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fallback URLs yang terbukti reliable (tested manually)
  const fallbackUrls = [
    `https://via.placeholder.com/${size}/9333ea/FFFFFF?text=${encodeURIComponent(fallbackText)}`,
    `https://via.placeholder.com/${size}/0066cc/FFFFFF?text=ALT`,
    `https://dummyimage.com/${size}x${size}/28a745/ffffff&text=OK`,
    `https://via.placeholder.com/${size}/dc2626/FFFFFF?text=ERR`,
    `https://dummyimage.com/${size}x${size}/6c757d/ffffff&text=DEF`
  ];

  // Reset when src prop changes
  useEffect(() => {
    if (src && src !== currentSrc) {
      console.log('🔄 SimpleAvatar: Src changed to:', src?.substring(0, 50) + '...');
      setCurrentSrc(src);
      setHasError(false);
      setRetryCount(0);
    }
  }, [src]);

  const handleImageError = (e) => {
    console.error('❌ SimpleAvatar: Image load failed:', currentSrc);
    
    if (retryCount < fallbackUrls.length) {
      const nextFallback = fallbackUrls[retryCount];
      console.log(`🔄 SimpleAvatar: Trying fallback ${retryCount + 1}:`, nextFallback);
      
      setRetryCount(prev => prev + 1);
      setCurrentSrc(nextFallback);
    } else {
      console.error('❌ SimpleAvatar: All fallbacks failed');
      setHasError(true);
    }
  };

  const handleImageLoad = () => {
    console.log('✅ SimpleAvatar: Image loaded successfully:', currentSrc?.substring(0, 50) + '...');
    setHasError(false);
  };

  const retryWithFirstFallback = () => {
    console.log('🔄 SimpleAvatar: Manual retry with first fallback');
    setRetryCount(0);
    setHasError(false);
    setCurrentSrc(fallbackUrls[0]);
  };

  // Error state - show placeholder
  if (hasError || !currentSrc) {
    return (
      <div 
        className={`${className} bg-gray-100 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-300`}
        onClick={onAvatarClick}
        style={{ cursor: onAvatarClick ? 'pointer' : 'default' }}
        title={hasError ? "Image failed to load" : "No image"}
      >
        {hasError ? (
          <>
            <AlertTriangle className="w-1/3 h-1/3 text-red-500 mb-2" />
            <span className="text-xs text-center mb-2">Load Error</span>
            {showFallbackButton && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  retryWithFirstFallback();
                }}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
          </>
        ) : (
          <>
            <User className="w-1/3 h-1/3 text-gray-400" />
            <span className="text-xs">No Image</span>
          </>
        )}
      </div>
    );
  }

  // Normal image
  return (
    <img
      key={`avatar-${currentSrc}`} // Force re-render when src changes
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
      onClick={onAvatarClick}
      style={{ 
        display: 'block',
        cursor: onAvatarClick ? 'pointer' : 'default'
      }}
      // NO crossOrigin or referrerPolicy - this is key!
    />
  );
};

export default SimpleAvatar;
