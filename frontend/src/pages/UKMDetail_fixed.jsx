import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RoleBasedComponent from '../components/RoleBasedComponent';
import EditUKMModal from '../components/EditUKMModal';
import Login from '../components/Login';
import Register from '../components/Register';
import { Edit2, Trash2, LogIn } from 'lucide-react';

const UKMDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [ukm, setUkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPageNotFound, setShowPageNotFound] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Only fetch UKM detail if user is logged in or auth is still loading
    if (!authLoading) {
      if (user) {
        fetchUKMDetail();
      } else {
        // User is not logged in, show login modal immediately
        setShowLoginModal(true);
        setLoading(false);
      }
    }
  }, [id, user, authLoading]);

  // Watch for user changes to fetch data after login
  useEffect(() => {
    if (user && !loading) {
      // User just logged in, fetch UKM data
      setShowPageNotFound(false);
      setShowLoginModal(false);
      setShowRegisterModal(false);
      fetchUKMDetail();
    }
  }, [user]);

  const fetchUKMDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ukm/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUkm(data);
      } else {
        setError('UKM tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching UKM detail:', error);
      setError('Gagal memuat detail UKM');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close for non-logged-in users
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    setShowPageNotFound(true);
  };

  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
    setShowPageNotFound(true);
  };

  const handleJoinUKM = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setJoining(true);
      // TODO: Implement join UKM functionality
      // For now, just show success message
      alert(`Anda berhasil bergabung dengan ${ukm.nama}!`);
    } catch (error) {
      console.error('Error joining UKM:', error);
      alert('Gagal bergabung dengan UKM. Silakan coba lagi.');
    } finally {
      setJoining(false);
    }
  };

  // Function untuk fetch categories (diperlukan untuk edit modal)
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ukm/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function untuk edit UKM
  const handleEditUKM = async (ukmId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ukm/${ukmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('UKM berhasil diupdate!');
        await fetchUKMDetail(); // Refresh data
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate UKM');
      }
    } catch (error) {
      console.error('Error updating UKM:', error);
      alert(`Gagal mengupdate UKM: ${error.message}`);
    }
  };

  // Function untuk delete UKM
  const handleDeleteUKM = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus UKM "${ukm.nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/ukm/${ukm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('UKM berhasil dihapus!');
        navigate('/daftar-ukm'); // Redirect ke halaman daftar UKM
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus UKM');
      }
    } catch (error) {
      console.error('Error deleting UKM:', error);
      alert(`Gagal menghapus UKM: ${error.message}`);
    }
  };

  // Load categories saat komponen mount
  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  // Helper functions untuk generate placeholder links yang berbeda tiap UKM
  const getInstagramHandle = (ukmName) => {
    if (!ukmName) return 'ukm.catur_x';
    
    const name = ukmName.toLowerCase();
    if (name.includes('catur')) return 'ukm.catur_x';
    if (name.includes('basket')) return 'ukm.basket_unhas';
    if (name.includes('volly') || name.includes('voli')) return 'ukm.volly_official';
    if (name.includes('tenis')) return 'ukm.tenis_unhas';
    if (name.includes('badminton')) return 'ukm.badminton_unhas';
    if (name.includes('musik')) return 'ukm.musik_unhas';
    if (name.includes('tari')) return 'ukm.tari_tradisional';
    if (name.includes('teater')) return 'ukm.teater_unhas';
    if (name.includes('seni')) return 'ukm.seni_rupa';
    if (name.includes('fotografi')) return 'ukm.fotografi_unhas';
    if (name.includes('jurnalistik')) return 'ukm.pers_mahasiswa';
    if (name.includes('debat')) return 'ukm.debat_english';
    if (name.includes('rohani')) return 'ukm.rohani_islam';
    if (name.includes('pramuka')) return 'ukm.pramuka_unhas';
    
    // Default berdasarkan kategori atau nama generik
    const sanitizedName = name.replace(/[^a-z0-9]/g, '').substring(0, 8);
    return `ukm.${sanitizedName}_unhas`;
  };

  const getEmailHandle = (ukmName) => {
    if (!ukmName) return 'ukmcatur@unhas.ac.id';
    
    const name = ukmName.toLowerCase();
    if (name.includes('catur')) return 'ukmcatur@unhas.ac.id';
    if (name.includes('basket')) return 'ukmbasket@unhas.ac.id';
    if (name.includes('volly') || name.includes('voli')) return 'ukmvolly@unhas.ac.id';
    if (name.includes('tenis')) return 'ukmtenis@unhas.ac.id';
    if (name.includes('badminton')) return 'ukmbadminton@unhas.ac.id';
    if (name.includes('musik')) return 'ukmmusik@unhas.ac.id';
    if (name.includes('tari')) return 'ukmtari@unhas.ac.id';
    if (name.includes('teater')) return 'ukmteater@unhas.ac.id';
    if (name.includes('seni')) return 'ukmseni@unhas.ac.id';
    if (name.includes('fotografi')) return 'ukmfoto@unhas.ac.id';
    if (name.includes('jurnalistik')) return 'ukmpers@unhas.ac.id';
    if (name.includes('debat')) return 'ukmdebat@unhas.ac.id';
    if (name.includes('rohani')) return 'ukmrohani@unhas.ac.id';
    if (name.includes('pramuka')) return 'ukmpramuka@unhas.ac.id';
    
    // Default berdasarkan nama generik
    const sanitizedName = name.replace(/[^a-z0-9]/g, '').substring(0, 8);
    return `ukm${sanitizedName}@unhas.ac.id`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail UKM...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in and auth loading is complete
  if (!authLoading && !user) {
    // Show page not found if user closed modals without logging in
    if (showPageNotFound) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">Anda harus login untuk mengakses halaman ini.</p>
            <div className="space-y-3">
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => {
                    setShowPageNotFound(false);
                    setShowLoginModal(true);
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/daftar-ukm')}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Kembali ke Daftar UKM
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Show login modal by default for non-logged-in users
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Login Modal */}
        {showLoginModal && (
          <Login
            onClose={handleLoginModalClose}
            switchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <Register
            onClose={handleRegisterModalClose}
            switchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">UKM Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/daftar-ukm')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Kembali ke Daftar UKM
          </button>
        </div>
      </div>
    );
  }

  if (!ukm) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/daftar-ukm')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar UKM
        </button>

        {/* Main Content - Match Screenshot Layout */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Header Section - Exact Match to Screenshot */}
          <div className="bg-gradient-to-br from-purple-100 to-blue-50 p-8 relative">
            {/* Admin Controls - Top Right */}
            <RoleBasedComponent allowedRoles={['admin', 1]}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  title="Edit UKM"
                >
                  <Edit2 className="w-5 h-5 text-blue-600" />
                </button>
                <button 
                  onClick={handleDeleteUKM}
                  className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
                  title="Hapus UKM"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </RoleBasedComponent>
            
            <div className="flex items-start gap-6">
              {/* Logo - Large Square with Border */}
              <div className="w-32 h-32 bg-white rounded-2xl shadow-md p-4 flex items-center justify-center flex-shrink-0">
                {ukm.image ? (
                  <img 
                    src={ukm.image} 
                    alt={ukm.nama}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">♟️</div>
                    <div className="text-xs text-gray-500 font-medium">UKM LOGO</div>
                  </div>
                )}
              </div>
              
              {/* UKM Info - Match Screenshot Typography */}
              <div className="flex-1 pt-2">
                <h1 className="text-4xl font-bold text-purple-700 mb-4 tracking-wide">
                  {ukm.nama?.toUpperCase() || 'UKM CATUR'}
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                  🏛️ {ukm.deskripsi || 'UKM Catur adalah tempat bagi mahasiswa yang ingin mengasah logika dan strategi melalui permainan catur. Kami rutin mengadakan latihan mingguan dan sering mengikuti turnamen tingkat kampus maupun nasional.'}
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Content - Exact Match to Screenshot */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Kegiatan Rutin - Purple Theme like Screenshot */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                  <span className="text-purple-600 mr-3 text-2xl">📅</span>
                  Kegiatan Rutin
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Latihan mingguan setiap Jumat sore</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Sparring & simulasi antar anggota</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Kelas pemula untuk anggota baru</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Analisis pertandingan bersama senior</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <span>Turnamen internal tiap semester</span>
                  </li>
                </ul>
              </div>

              {/* Prestasi - Yellow Theme like Screenshot */}
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                  <span className="text-yellow-600 mr-3 text-2xl">🏆</span>
                  Prestasi
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 mt-1">•</span>
                    <span>Juara I Catur Fakultas 2023</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 mt-1">•</span>
                    <span>Juara 2 Antar Universitas Sulawesi 2022</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 mt-1">•</span>
                    <span>Finalis Nasional Kemenpura 2023</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 mt-1">•</span>
                    <span>Peserta Terbaik Pelatihan Percasi 2021</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 mt-1">•</span>
                    <span>Juara Harapan I Catur Se-Kampus 2024</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Call to Action - Match New Screenshot */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-3">
                  Tertarik bergabung dengan {ukm.nama || 'UKM Catur'}?
                </h3>
              </div>
              
              {/* Two Column Layout for CTA Content */}
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Left Side - Description */}
                <div className="bg-purple-500/30 rounded-xl p-6 text-center md:text-left">
                  <p className="text-purple-100 text-lg leading-relaxed mb-4">
                    Yuk, jadi bagian dari komunitas pecinta strategi dan logika!
                  </p>
                  
                  {/* Join Button - User is guaranteed to be logged in here */}
                  <button
                    onClick={handleJoinUKM}
                    disabled={joining}
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {joining ? 'Memproses...' : 'Gabung Sekarang'}
                  </button>
                </div>
                
                {/* Right Side - Social Links */}
                <div className="space-y-3">
                  {/* Instagram Link */}
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📷</span>
                    </div>
                    <span className="text-white font-medium">
                      @{getInstagramHandle(ukm.nama)}
                    </span>
                  </div>
                  
                  {/* Email Link */}
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">✉️</span>
                    </div>
                    <span className="text-white font-medium">
                      {getEmailHandle(ukm.nama)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit UKM Modal */}
        <EditUKMModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          categories={categories}
          ukm={ukm}
          onSubmit={handleEditUKM}
        />

        {/* Login Modal - Only shown if user somehow gets here without being logged in */}
        {showLoginModal && (
          <Login
            onClose={handleLoginModalClose}
            switchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
          />
        )}

        {/* Register Modal - Only shown if user somehow gets here without being logged in */}
        {showRegisterModal && (
          <Register
            onClose={handleRegisterModalClose}
            switchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UKMDetail;
