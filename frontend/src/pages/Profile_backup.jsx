import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { User, Edit2, Check, X, Camera, Lock, Mail, Phone, MapPin, Calendar, GraduationCap, Users } from 'lucide-react';

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
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setFormData(profileData);
      } else {
        throw new Error('Gagal memuat profil');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Gagal memuat profil');
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
        
        // Update user context if necessary
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
    try {
      setUpdating(true);
      setError(null);

      if (passwordData.new_password !== passwordData.confirm_password) {
        throw new Error('Konfirmasi password tidak cocok');
      }

      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setShowPasswordForm(false);
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const ProfileField = ({ label, field, icon: Icon, type = 'text', placeholder }) => {
    const isEditing = editingField === field;
    const value = formData[field] || '';
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-gray-500" />
            <label className="font-medium text-gray-700">{label}</label>
          </div>
          {!isEditing ? (
            <button
              onClick={() => handleEdit(field)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(field)}
                disabled={updating}
                className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={updating}
                className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={updating}
            />
          ) : type === 'select' ? (
            <select
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={updating}
            >
              <option value="">Pilih {label.toLowerCase()}</option>
              {field === 'gender' && (
                <>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                  <option value="other">Lainnya</option>
                </>
              )}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={updating}
            />
          )
        ) : (
          <p className="text-gray-600 min-h-[1.5rem]">
            {value || <span className="text-gray-400 italic">{placeholder}</span>}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-gray-600">Memuat profil...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-red-600 mb-4 text-xl font-semibold">⚠️ Gagal Memuat Profil</h2>
            <p className="text-gray-600 mb-6">Terjadi kesalahan saat memuat profil Anda</p>
            <button 
              onClick={fetchProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
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
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-gray-600 mb-1">@{profile.username}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.role?.name === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {profile.role?.name === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
              
              <ProfileField
                label="Nama Lengkap"
                field="full_name"
                icon={User}
                placeholder="Masukkan nama lengkap Anda"
              />
              
              <ProfileField
                label="Email"
                field="email"
                icon={Mail}
                type="email"
                placeholder="Masukkan email Anda"
              />
              
              <ProfileField
                label="Nomor Telepon"
                field="phone"
                icon={Phone}
                type="tel"
                placeholder="Masukkan nomor telepon Anda"
              />
              
              <ProfileField
                label="Tanggal Lahir"
                field="date_of_birth"
                icon={Calendar}
                type="date"
                placeholder="Pilih tanggal lahir"
              />
              
              <ProfileField
                label="Jenis Kelamin"
                field="gender"
                icon={Users}
                type="select"
                placeholder="Pilih jenis kelamin"
              />
            </div>

            {/* Academic & Contact Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Akademik</h2>
              
              <ProfileField
                label="NIM"
                field="student_id"
                icon={GraduationCap}
                placeholder="Masukkan NIM Anda"
              />
              
              <ProfileField
                label="Fakultas"
                field="faculty"
                icon={GraduationCap}
                placeholder="Masukkan fakultas Anda"
              />
              
              <ProfileField
                label="Jurusan"
                field="major"
                icon={GraduationCap}
                placeholder="Masukkan jurusan Anda"
              />
              
              <ProfileField
                label="Alamat"
                field="address"
                icon={MapPin}
                type="textarea"
                placeholder="Masukkan alamat lengkap Anda"
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tentang Saya</h2>
            <ProfileField
              label="Bio"
              field="bio"
              icon={User}
              type="textarea"
              placeholder="Ceritakan tentang diri Anda..."
            />
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">Keamanan</h2>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ubah Password
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      current_password: e.target.value
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      new_password: e.target.value
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength="6"
                    disabled={updating}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirm_password: e.target.value
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={updating}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Menyimpan...' : 'Simpan Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                      });
                    }}
                    disabled={updating}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Informasi Akun</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{user?.username}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{user?.email || 'Tidak tersedia'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 capitalize">{user?.role}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bergabung Sejak
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : 'Tidak tersedia'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role-specific information */}
                  {user?.role === 'admin' && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Akses Administrator</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        Sebagai administrator, Anda memiliki akses penuh untuk mengelola UKM, 
                        kategori, dan pengguna dalam sistem UKMiverse.
                      </p>
                    </div>
                  )}

                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Catatan Keamanan</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Jangan bagikan informasi login Anda kepada orang lain</li>
                      <li>• Selalu logout setelah selesai menggunakan aplikasi</li>
                      <li>• Gunakan password yang kuat dan unik</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
