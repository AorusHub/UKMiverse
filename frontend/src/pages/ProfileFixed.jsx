import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { User, Edit2, Check, X, Camera, Lock, Mail, Upload, Link, Trash2, Eye, XCircle } from 'lucide-react';

const ProfileFixed = () => {
  const authContext = useContext(AuthContext);
  
  // Check if AuthContext is available
  if (!authContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">AuthContext Error</h2>
          <p className="text-gray-600">Authentication context is not available</p>
        </div>
      </div>
    );
  }

  const { user, token, updateUser, loading: authLoading, isAuthenticated } = authContext;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
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

  const API_BASE_URL = 'http://localhost:5000/api';

  // Debug information
  console.log('ProfileFixed - Auth State:', {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated,
    authLoading
  });

  const fetchProfile = async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching profile...');
      
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);

      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile data received:', profileData);
        setProfile(profileData);
        setFormData(profileData);
      } else {
        const errorText = await response.text();
        console.error('Profile fetch failed:', response.status, errorText);
        throw new Error(`Failed to load profile: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Failed to load profile');
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });

      if (response.ok) {
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setShowPasswordModal(false);
        setSuccess('Password berhasil diperbarui!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // Avatar handling functions
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

    if (uploading) {
      return;
    }

    try {
      setUploading(true);
      setError(null);

      let finalAvatarUrl = avatarUrl;

      if (selectedFile && avatarUploadType === 'file') {
        console.log('Converting file to base64...');
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(new Error('Gagal membaca file'));
          reader.readAsDataURL(selectedFile);
        });
        finalAvatarUrl = await base64Promise;
        console.log('Base64 conversion complete, length:', finalAvatarUrl.length);
      }

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar_url: finalAvatarUrl
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        updateUser(updatedProfile);
        setShowAvatarModal(false);
        setSuccess('Foto profil berhasil diperbarui!');
        setTimeout(() => setSuccess(null), 3000);
        
        resetAvatarForm();
      } else {
        const errorData = await response.json();
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

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar_url: null
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setFormData(updatedProfile);
        updateUser(updatedProfile);
        setShowAvatarModal(false);
        setShowAvatarPreview(false);
        setSuccess('Foto profil berhasil dihapus!');
        setTimeout(() => setSuccess(null), 3000);
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

  const renderEditableField = (field, label, type = 'text', options = null) => {
    const isEditing = editingField === field;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isEditing ? (
          <div className="flex gap-2">
            {type === 'select' ? (
              <select
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="3"
              />
            ) : (
              <input
                type={type}
                value={formData[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            )}
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => handleSave(field)}
                disabled={updating}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Simpan"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={updating}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Batal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
              className="ml-3 p-2 text-gray-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-gray-50"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isAuthenticated && token && !authLoading) {
      fetchProfile();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
      setError('User not authenticated');
    }
  }, [token, isAuthenticated, authLoading]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing authentication...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show loading while profile is loading
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
                  <div className="relative inline-block mb-4">
                    <div 
                      className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleAvatarClick}
                      title={profile?.avatar_url ? "Lihat foto profil" : "Tambah foto profil"}
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-purple-600" />
                      )}
                    </div>
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
              <img
                src={profile?.avatar_url}
                alt="Avatar"
                className="w-64 h-64 object-cover rounded-lg mx-auto"
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

      {/* Password Update Modal */}
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

export default ProfileFixed;
