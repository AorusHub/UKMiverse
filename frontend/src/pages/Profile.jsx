import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { User, Edit2, Check, X, Camera, Lock, Mail, Upload, Link, Trash2, Eye, XCircle } from 'lucide-react';
import SimpleAvatar from '../components/SimpleAvatar';

const Profile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [avatarUploadType, setAvatarUploadType] = useState('url'); // 'url' or 'file'
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [avatarKey, setAvatarKey] = useState(0); // Counter to force avatar re-render

  const API_BASE_URL = 'http://localhost:5000/api';

  // Enhanced fallback URLs dengan prioritas tinggi
  const getFallbackAvatarUrls = () => [
    // Priority 1: Guaranteed working placeholder services
    'https://via.placeholder.com/150/9333ea/FFFFFF?text=USER',
    'https://via.placeholder.com/150/0066cc/FFFFFF?text=AVATAR',
    'https://dummyimage.com/150x150/28a745/ffffff&text=OK',
    
    // Priority 2: UI Avatars service (very reliable)
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || profile?.username || 'User')}&size=150&background=9333ea&color=fff`,
    
    // Priority 3: Additional backups
    'https://via.placeholder.com/150/6c757d/FFFFFF?text=DEFAULT',
    'https://dummyimage.com/150x150/6c757d/ffffff&text=User',
    
    // Priority 4: Test URLs
    'https://via.placeholder.com/150/dc2626/FFFFFF?text=TEST',
    'https://dummyimage.com/150x150/17a2b8/ffffff&text=BK'
  ];

  // Advanced avatar loading strategies
  const avatarLoadStrategies = [
    { crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' },
    { crossOrigin: '', referrerPolicy: 'no-referrer' },
    { crossOrigin: '', referrerPolicy: '' },
    { crossOrigin: 'anonymous', referrerPolicy: 'strict-origin-when-cross-origin' }
  ];

  // Debug: Always show current profile state
  console.log('🔍 Profile component render:');
  console.log('  - profile:', profile);
  console.log('  - profile.avatar_url:', profile?.avatar_url);
  console.log('  - user:', user);
  console.log('  - token exists:', !!token);
  console.log('  - loading:', loading);
  console.log('  - avatarKey:', avatarKey);

  // Watch for avatar changes
  React.useEffect(() => {
    console.log('🎯 Avatar state changed:');
    console.log('  - avatarKey:', avatarKey);
    console.log('  - avatar_url:', profile?.avatar_url);
    console.log('  - profile object:', profile);
  }, [avatarKey, profile?.avatar_url]);

  // Simplified loading check - if no token after 3 seconds, assume not logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token) {
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    console.log('Profile useEffect - token:', token);
    console.log('Profile useEffect - user:', user);
    if (token) {
      fetchProfile();
    } else {
      console.log('No token available, setting loading to false');
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching profile...');
      console.log('  - Token exists:', !!token);
      console.log('  - Token preview:', token ? token.substring(0, 20) + '...' : 'null');
      console.log('  - API URL:', `${API_BASE_URL}/profile/`);
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Profile fetch response:');
      console.log('  - Status:', response.status);
      console.log('  - Status text:', response.statusText);
      console.log('  - Headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Profile data received:');
        console.log('  - Full profile:', profileData);
        console.log('  - Avatar URL:', profileData.avatar_url);
        console.log('  - Avatar type:', typeof profileData.avatar_url);
        console.log('  - Avatar length:', profileData.avatar_url ? profileData.avatar_url.length : 0);
        
        setProfile(profileData);
        setFormData(profileData);
        
        // Force avatar re-render if avatar exists
        if (profileData.avatar_url) {
          console.log('🎯 Avatar found, forcing re-render');
          setAvatarKey(prev => prev + 1);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Profile fetch failed:', response.status, errorText);
        if (response.status === 401) {
          // Token expired or invalid - clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        } else if (response.status === 404) {
          throw new Error('Profile not found');
        } else {
          throw new Error(`Failed to load profile: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('💥 Error fetching profile:', error);
      setError(error.message || 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData(profile);
    setError(null);
  };

  const handleSave = async (field) => {
    try {
      setUpdating(true);
      setError(null);
      
      const updatePayload = {
        [field]: formData[field]
      };

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        setEditingField(null);
        setSuccess('Profil berhasil diperbarui!');
        
        if (['full_name', 'username', 'email'].includes(field)) {
          updateUser(updatedProfile);
        }
        
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validasi input tidak kosong
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      setError('Semua field password harus diisi');
      return;
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setError('Password baru harus minimal 6 karakter');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      console.log('Sending password update request with data:', {
        current_password: passwordData.current_password ? 'PROVIDED' : 'MISSING',
        new_password: passwordData.new_password ? 'PROVIDED' : 'MISSING',
        confirm_password: passwordData.confirm_password ? 'PROVIDED' : 'MISSING'
      });

      const requestBody = {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      };

      console.log('Request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Password update response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Password update success:', result);
        
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setShowPasswordModal(false);
        setShowPasswordForm(false);
        setSuccess('Password berhasil diperbarui!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        console.error('Password update error:', errorData);
        throw new Error(errorData.message || 'Gagal memperbarui password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    console.log(`Password field changed: ${field} = ${value ? 'PROVIDED' : 'EMPTY'}`);
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const renderEditableField = (field, label, type = 'text', options = null) => {
    const isEditing = editingField === field;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isEditing ? (
          <div className="flex">
            {type === 'select' ? (
              <select
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 h-8 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
                rows="2"
              />
            ) : (
              <input
                type={type}
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 h-8 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            )}
            <button
              onClick={() => handleSave(field)}
              disabled={updating}
              className="w-8 h-8 ml-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50 flex items-center justify-center"
              title="Simpan"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={handleCancel}
              disabled={updating}
              className="w-8 h-8 ml-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 flex items-center justify-center"
              title="Batal"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <div className="flex-1">
              <p className="text-gray-900">
                {field === 'gender' ? (
                  profile[field] === 'L' ? 'Laki-laki' : profile[field] === 'P' ? 'Perempuan' : 'Belum diisi'
                ) : field === 'date_of_birth' ? (
                  profile[field] ? new Date(profile[field]).toLocaleDateString('id-ID') : 'Belum diisi'
                ) : (
                  profile[field] || 'Belum diisi'
                )}
              </p>
            </div>
            <button
              onClick={() => handleEdit(field)}
              className="ml-2 w-7 h-7 text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded hover:bg-gray-50"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Enhanced avatar loading with multiple fallback strategies
  const handleAvatarError = (imgElement, retryCount = 0) => {
    const maxRetries = 4;
    const originalSrc = imgElement.dataset.originalSrc || imgElement.src;
    
    console.error('❌ Avatar load failed:', originalSrc);
    console.error('Retry count:', retryCount);
    
    if (retryCount < maxRetries && retryCount < avatarLoadStrategies.length) {
      // Try different loading strategy
      const strategy = avatarLoadStrategies[retryCount];
      console.log(`� Trying strategy ${retryCount + 1}:`, strategy);
      
      imgElement.crossOrigin = strategy.crossOrigin;
      imgElement.referrerPolicy = strategy.referrerPolicy;
      
      // Add cache buster
      const separator = originalSrc.includes('?') ? '&' : '?';
      const newSrc = originalSrc + separator + `_retry=${retryCount}_${Date.now()}`;
      
      // Store original src for reference
      if (!imgElement.dataset.originalSrc) {
        imgElement.dataset.originalSrc = originalSrc;
      }
      
      // Store retry count
      imgElement.dataset.retryCount = retryCount + 1;
      
      // Retry after short delay
      setTimeout(() => {
        imgElement.src = newSrc;
      }, 500 * (retryCount + 1)); // Increasing delay
      
    } else {
      // All strategies failed, try fallback URLs
      console.log('❌ All retry strategies failed, trying fallback URLs');
      
      const fallbackUrls = getFallbackAvatarUrls();
      const fallbackIndex = parseInt(imgElement.dataset.fallbackIndex || '0');
      
      if (fallbackIndex < fallbackUrls.length) {
        const fallbackUrl = fallbackUrls[fallbackIndex];
        console.log(`🔄 Trying fallback ${fallbackIndex + 1}:`, fallbackUrl);
        
        imgElement.dataset.fallbackIndex = fallbackIndex + 1;
        imgElement.dataset.retryCount = 0; // Reset retry count for fallback
        
        // Reset to default strategy for fallback
        imgElement.crossOrigin = 'anonymous';
        imgElement.referrerPolicy = 'no-referrer';
        
        imgElement.src = fallbackUrl;
      } else {
        // All fallbacks failed, show error state
        console.log('❌ All fallbacks failed, showing error state');
        showAvatarErrorState(imgElement);
      }
    }
  };

  const showAvatarErrorState = (imgElement) => {
    imgElement.style.display = 'none';
    const container = imgElement.parentElement;
    
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center text-red-600 h-full">
        <svg class="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-xs text-center">Image Error</span>
        <button onclick="window.location.reload()" class="text-xs text-purple-600 underline mt-1 hover:text-purple-800">
          Refresh Page
        </button>
      </div>
    `;
  };

  const handleAvatarClick = () => {
    if (profile?.avatar_url) {
      setShowAvatarPreview(true);
    } else {
      setShowAvatarModal(true);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      console.log('File selected:', file.name, file.type, file.size);
      setSelectedFile(file);
      setAvatarUploadType('file');
      setAvatarUrl(''); // Clear URL when file is selected
      setError(null);
    } else {
      setError('Silakan pilih file gambar yang valid');
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarUrl && !selectedFile) {
      setError('Silakan pilih file atau masukkan URL gambar');
      return;
    }

    // Prevent double submission
    if (uploading) {
      return;
    }

    try {
      setUploading(true);
      setError(null);

      let response;

      // If file is selected, upload as multipart form
      if (selectedFile && avatarUploadType === 'file') {
        console.log('📁 Uploading file...');
        console.log('  - File name:', selectedFile.name);
        console.log('  - File size:', selectedFile.size, 'bytes');
        console.log('  - File type:', selectedFile.type);
        
        // Use file upload endpoint
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        
        response = await fetch(`${API_BASE_URL}/profile/avatar/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });
        
        console.log('📡 File upload response:', response.status);
        
      } else if (avatarUrl) {
        // URL upload (including base64)
        console.log('🌐 Uploading URL/Base64...');
        console.log('  - URL type:', avatarUrl.startsWith('data:') ? 'base64' : 'URL');
        console.log('  - URL length:', avatarUrl.length);
        
        response = await fetch(`${API_BASE_URL}/profile/avatar`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            avatar_url: avatarUrl
          })
        });
        
        console.log('📡 URL upload response:', response.status);
      }

      if (response && response.ok) {
        const result = await response.json();
        console.log('✅ Avatar update successful!');
        console.log('  - Response:', result);
        
        // Refresh profile to get updated avatar info
        const profileResponse = await fetch(`${API_BASE_URL}/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (profileResponse.ok) {
          const updatedProfile = await profileResponse.json();
          console.log('✅ Profile refreshed with updated avatar');
          console.log('  - Avatar URL:', updatedProfile.avatar_url);
          console.log('  - Avatar Type:', updatedProfile.avatar_type);
          console.log('  - Avatar Filename:', updatedProfile.avatar_filename);
          
          // Update all states
          setProfile(updatedProfile);
          setFormData(updatedProfile);
          updateUser(updatedProfile);
          
          // Force avatar re-render
          setAvatarKey(prev => prev + 1);
          
          // Close modal and show success
          setShowAvatarModal(false);
          setSuccess('Foto profil berhasil diperbarui dan disimpan sebagai JPG!');
          setTimeout(() => setSuccess(null), 3000);
          
          // Reset form
          resetAvatarForm();
        }
      } else {
        const errorData = await response.json();
        console.error('Avatar update error:', errorData);
        throw new Error(errorData.message || 'Gagal memperbarui foto profil');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      setError(error.message || 'Terjadi kesalahan saat memperbarui foto profil');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      setUploading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile/avatar/remove`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        console.log('✅ Avatar deleted successfully');
        
        // Refresh profile to get updated state
        const profileResponse = await fetch(`${API_BASE_URL}/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (profileResponse.ok) {
          const updatedProfile = await profileResponse.json();
          console.log('✅ Profile refreshed after avatar deletion');
          
          setProfile(updatedProfile);
          setFormData(updatedProfile);
          updateUser(updatedProfile);
          
          // Force avatar re-render
          setAvatarKey(prev => prev + 1);
          
          setShowAvatarModal(false);
          setShowAvatarPreview(false);
          setSuccess('Foto profil berhasil dihapus dari server!');
          setTimeout(() => setSuccess(null), 3000);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus foto profil');
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Password modal functions
  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setError(null);
  };

  // Reset avatar form
  const resetAvatarForm = () => {
    setAvatarUrl('');
    setSelectedFile(null);
    setAvatarUploadType('url');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('Avatar form reset');
  };

  const handleAvatarModalClose = () => {
    setShowAvatarModal(false);
    resetAvatarForm();
  };

  // Enhanced image validation with multiple strategies
  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      if (!url) {
        console.log('❌ No URL provided');
        resolve(false);
        return;
      }

      // For base64 images, just check basic format
      if (url.startsWith('data:image/')) {
        console.log('🖼️ Base64 image detected, validating format...');
        const isValid = url.match(/^data:image\/(png|jpeg|jpg|gif|webp|bmp|svg\+xml);base64,/i);
        console.log('✅ Base64 format valid:', !!isValid);
        resolve(!!isValid);
        return;
      }

      // For URL images, be more lenient - just check if it looks like a URL
      if (url.startsWith('http://') || url.startsWith('https://')) {
        console.log('🌐 HTTP(S) URL detected, basic validation...');
        
        try {
          new URL(url);
          console.log('✅ URL format valid:', url);
          
          // Quick network test with very short timeout for better UX
          const img = new Image();
          const timeoutId = setTimeout(() => {
            console.log('⚠️ Quick validation timeout, assuming valid');
            resolve(true); // Assume valid on timeout to avoid blocking UX
          }, 2000);
          
          img.onload = () => {
            clearTimeout(timeoutId);
            console.log('✅ Quick validation successful');
            resolve(true);
          };
          
          img.onerror = () => {
            clearTimeout(timeoutId);
            console.log('⚠️ Quick validation failed, but may work with different settings');
            resolve(true); // Still allow upload, let the full error handling deal with it
          };
          
          img.src = url;
          
        } catch (e) {
          console.log('❌ Invalid URL format:', url);
          resolve(false);
        }
        return;
      }

      // For other protocols or invalid formats
      console.log('❌ Unsupported URL format:', url);
      resolve(false);
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat profil...</p>
            <p className="mt-2 text-sm text-gray-500">Token: {token ? 'Available' : 'Not available'}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!token) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Authentication required</p>
            <p className="text-sm text-gray-500 mt-2">Please login to view your profile</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile && !error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No profile data available</p>
            <button 
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profil Pengguna</h1>
            <p className="text-gray-600 mt-2">Kelola informasi profil dan pengaturan akun Anda</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4" key={`avatar-container-${avatarKey}`}>
                    <SimpleAvatar
                      src={profile?.avatar_url}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-purple-200 hover:opacity-80 transition-opacity"
                      size="96"
                      fallbackText={profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                      onAvatarClick={handleAvatarClick}
                      showFallbackButton={true}
                    />
                    <button
                      onClick={() => setShowAvatarModal(true)}
                      className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                      title="Ubah Foto Profil"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900">{profile?.full_name || profile?.username}</h2>
                  <p className="text-gray-600">@{profile?.username}</p>
                  <p className="text-gray-600 flex items-center justify-center gap-1 mt-1">
                    <Mail className="w-4 h-4" />
                    {profile?.email}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={openPasswordModal}
                    className="w-full flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Ubah Password
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Detail Profil</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Informasi Dasar</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderEditableField('full_name', 'Nama Lengkap')}
                        {renderEditableField('username', 'Username')}
                        {renderEditableField('email', 'Email', 'email')}
                        {renderEditableField('phone', 'No. Telepon', 'tel')}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Informasi Pribadi</h4>
                      <div className="space-y-4">
                        {renderEditableField('bio', 'Bio', 'textarea')}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderEditableField('date_of_birth', 'Tanggal Lahir', 'date')}
                          {renderEditableField('gender', 'Jenis Kelamin', 'select', [
                            { value: '', label: 'Pilih jenis kelamin' },
                            { value: 'L', label: 'Laki-laki' },
                            { value: 'P', label: 'Perempuan' }
                          ])}
                        </div>
                        {renderEditableField('address', 'Alamat')}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Informasi Akademik</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderEditableField('student_id', 'NIM')}
                        {renderEditableField('faculty', 'Fakultas')}
                        {renderEditableField('major', 'Program Studi')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Preview Modal */}
      {showAvatarPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAvatarPreview(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Foto Profil</h3>
              <button
                onClick={() => setShowAvatarPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <SimpleAvatar
                src={profile?.avatar_url}
                alt="Avatar Preview"
                className="w-64 h-64 object-cover rounded-lg mx-auto"
                size="256"
                fallbackText={profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                showFallbackButton={true}
              />
              <div className="mt-4 flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setShowAvatarPreview(false);
                    setShowAvatarModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Ubah Foto
                </button>
                <button
                  onClick={handleAvatarDelete}
                  disabled={uploading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Menghapus...' : 'Hapus Foto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleAvatarModalClose}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {profile?.avatar_url ? 'Ubah Foto Profil' : 'Tambah Foto Profil'}
              </h3>
              <button
                onClick={handleAvatarModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Preview Section */}
              {(avatarUrl || selectedFile) && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-2 border-gray-200">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('✅ Preview loaded (URL)')}
                          onError={() => {
                            console.error('❌ Preview failed (URL)');
                            setError('URL gambar tidak dapat dimuat');
                          }}
                        />
                      ) : selectedFile ? (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('✅ Preview loaded (File)')}
                          onError={() => {
                            console.error('❌ Preview failed (File)');
                            setError('File gambar tidak dapat dimuat');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih cara upload:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setAvatarUploadType('url');
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      setError(null);
                    }}
                    className={`p-3 border rounded-lg flex items-center gap-2 ${
                      avatarUploadType === 'url' 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Link className="w-4 h-4" />
                    <span className="text-sm">URL</span>
                  </button>
                  <button
                    onClick={() => {
                      setAvatarUploadType('file');
                      setAvatarUrl('');
                      setError(null);
                    }}
                    className={`p-3 border rounded-lg flex items-center gap-2 ${
                      avatarUploadType === 'file' 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">File</span>
                  </button>
                </div>
              </div>

              {/* URL Input */}
              {avatarUploadType === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar:</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => {
                      setAvatarUrl(e.target.value);
                      if (e.target.value) {
                        setSelectedFile(null); // Clear file when URL is entered
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }
                      setError(null);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Quick test URLs (guaranteed working):</p>
                    <div className="flex flex-wrap gap-1">
                      {getFallbackAvatarUrls().slice(0, 4).map((url, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(url);
                            setError(null);
                            console.log('📌 Quick test URL selected:', url);
                          }}
                          className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded border border-green-300"
                          title={`Click to use test URL ${index + 1}`}
                        >
                          Safe {index + 1}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const emergencyUrl = 'https://via.placeholder.com/150/28a745/FFFFFF?text=EMERGENCY';
                          setAvatarUrl(emergencyUrl);
                          setError(null);
                          console.log('🆘 Emergency URL selected:', emergencyUrl);
                        }}
                        className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded border border-red-300"
                        title="Emergency fallback URL - guaranteed to work"
                      >
                        Emergency
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Green buttons = Verified safe URLs | Red = Emergency fallback
                    </p>
                  </div>
                </div>
              )}

              {/* File Input */}
              {avatarUploadType === 'file' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih File:</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {selectedFile && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">File terpilih: {selectedFile.name}</p>
                      <div className="text-center mt-2">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-full mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Preview */}
              {(avatarUrl && avatarUploadType === 'url') && (
                <div className="text-center">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full mx-auto"
                    onError={() => setError('URL gambar tidak valid')}
                  />
                </div>
              )}

              {/* Emergency URLs Section */}
              {error && error.includes('tidak dapat dimuat') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">🚨 Quick Fix - URL yang Pasti Bekerja:</h4>
                  <div className="space-y-2">
                    {getTestAvatarUrls().slice(0, 3).map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(url);
                          setError(null);
                          setAvatarUploadType('url');
                        }}
                        className="w-full text-left px-3 py-2 text-xs bg-white border border-amber-300 rounded hover:bg-amber-50 transition-colors"
                      >
                        📎 Test URL {index + 1}: {url.substring(0, 40)}...
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-amber-700 mt-2">Pilih salah satu URL di atas untuk test cepat</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleAvatarUpload}
                  disabled={uploading || (!avatarUrl && !selectedFile)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
                {profile?.avatar_url && (
                  <button
                    onClick={handleAvatarDelete}
                    disabled={uploading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleAvatarModalClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closePasswordModal}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ubah Password</h3>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  minLength="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  minLength="6"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Menyimpan...' : 'Simpan Password'}
                </button>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </ProtectedRoute>
  );
};

export default Profile;
