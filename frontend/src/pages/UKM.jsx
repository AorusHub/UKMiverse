import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import RoleBasedComponent from '../components/RoleBasedComponent';
import { Trash2 } from 'lucide-react';

const UKM = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [ukmData, setUkmData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]); // Array untuk filter kategori yang aktif

  // Base URL untuk API backend
  const API_BASE_URL = 'http://localhost:5000/api';

  // Icon mapping untuk kategori
  const categoryIcons = {
    'Unit Kegiatan Olahraga': '🏃‍♂️',
    'Unit Kegiatan Kesenian': '🎭',
    'Unit Kegiatan Khusus': '⭐',
    'olahraga': '🏃‍♂️',
    'kesenian': '�',
    'khusus': '⭐'
  };

  // Color mapping untuk kategori
  const categoryColors = {
    'Unit Kegiatan Olahraga': '#FF6B6B',
    'Unit Kegiatan Kesenian': '#4ECDC4',
    'Unit Kegiatan Khusus': '#45B7D1',
    'olahraga': '#FF6B6B',
    'kesenian': '#4ECDC4',
    'khusus': '#45B7D1'
  };



  // Function untuk menghapus UKM
  const handleDeleteUKM = async (ukmId, ukmName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus UKM "${ukmName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${API_BASE_URL}/ukm/${ukmId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('✅ UKM berhasil dihapus');
        
        // Refresh data UKM
        await loadData();
        
        alert('UKM berhasil dihapus!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus UKM');
      }
    } catch (error) {
      console.error('❌ Error deleting UKM:', error);
      alert(`Gagal menghapus UKM: ${error.message}`);
    }
  };

  // Function untuk reload data (extract dari useEffect)
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch categories
      console.log('Fetching categories from:', `${API_BASE_URL}/ukm/categories`);
      const categoriesResponse = await fetch(`${API_BASE_URL}/ukm/categories`);
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log('Categories received:', categoriesData);
        const categoriesWithExtras = categoriesData.map(category => ({
          ...category,
          icon: categoryIcons[category.name] || categoryIcons[category.name.toLowerCase()] || '📋',
          color: categoryColors[category.name] || categoryColors[category.name.toLowerCase()] || '#666'
        }));
        setCategories(categoriesWithExtras);
      } else {
        console.error('Categories fetch failed:', categoriesResponse.status);
        throw new Error('Failed to fetch categories');
      }

      // Fetch UKMs
      console.log('Fetching UKMs from:', `${API_BASE_URL}/ukm/`);
      const ukmsResponse = await fetch(`${API_BASE_URL}/ukm/`);
      if (ukmsResponse.ok) {
        const ukmsData = await ukmsResponse.json();
        console.log('UKMs received:', ukmsData);
        console.log('🔍 Sample UKM structure:', ukmsData[0]);
        console.log('🔍 UKM fields:', ukmsData[0] ? Object.keys(ukmsData[0]) : 'No UKMs');
        
        // Transform data for frontend compatibility
        const transformedUkms = ukmsData.map(ukm => {
          console.log('🔄 Transforming UKM:', ukm);
          const transformed = {
            ...ukm,
            image: ukm.image || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1626224583764-f87db24ac4ea' : '1493225457124-a3eb161ffa5f'}?w=400&h=300&fit=crop`
          };
          console.log('✅ Transformed UKM:', transformed);
          return transformed;
        });
        console.log('🎯 Final transformed UKMs:', transformedUkms);
        setUkmData(transformedUkms);
      } else {
        console.error('UKMs fetch failed:', ukmsResponse.status);
        throw new Error('Failed to fetch UKMs');
      }
      
      console.log('✅ Data loaded successfully from database!');
    } catch (error) {
      console.error('❌ Error loading data from backend:', error);
      setError(`Gagal memuat data: ${error.message}`);
      
      // Use fallback data if backend fails
      console.log('🔄 Using fallback data...');
      setCategories([
        { id: 1, name: 'Unit Kegiatan Olahraga', icon: '🏃‍♂️', color: '#FF6B6B' },
        { id: 2, name: 'Unit Kegiatan Kesenian', icon: '🎭', color: '#4ECDC4' },
        { id: 3, name: 'Unit Kegiatan Khusus', icon: '⭐', color: '#45B7D1' }
      ]);
      setUkmData([
        {
          id: 1,
          nama: 'UKM Badminton',
          deskripsi: 'Unit Kegiatan Mahasiswa Badminton untuk mengembangkan kemampuan olahraga dan sportivitas.',
          category_id: 1,
          image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop'
        },
        {
          id: 2,
          nama: 'UKM Musik',
          deskripsi: 'Unit Kegiatan Mahasiswa Musik untuk mengembangkan bakat dan kreativitas di bidang musik.',
          category_id: 2,
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
        },
        {
          id: 3,
          nama: 'UKM Bahasa',
          deskripsi: 'Unit Kegiatan Mahasiswa Bahasa untuk mengembangkan kemampuan komunikasi dan linguistik.',
          category_id: 3,
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getUKMByCategory = () => {
    try {
      const result = {};
      console.log('🔍 getUKMByCategory called');
      console.log('📂 Categories:', categories);
      console.log('📋 UKM Data:', ukmData);
      
      categories.forEach(category => {
        let categoryUKMs = ukmData.filter(ukm => {
          // Handle both category_id and category.id for backward compatibility
          const ukmCategoryId = ukm.category_id || (ukm.category && ukm.category.id);
          return ukmCategoryId === category.id;
        });
        console.log(`📂 Category ${category.name} (ID: ${category.id}):`, categoryUKMs);
        
        // Filter by search term if exists
        if (searchTerm) {
          categoryUKMs = categoryUKMs.filter(ukm =>
            ukm.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ukm.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          console.log(`🔍 After search filter "${searchTerm}":`, categoryUKMs);
        }
        
        result[category.id] = categoryUKMs;
      });
      
      console.log('🎯 Final result by category:', result);
      return result;
    } catch (error) {
      console.error('❌ Error in getUKMByCategory:', error);
      return {};
    }
  };

  // Toggle filter kategori
  const toggleCategoryFilter = (categoryId) => {
    setActiveFilters(prev => {
      if (prev.includes(categoryId)) {
        // Jika sudah aktif, remove dari filter
        return prev.filter(id => id !== categoryId);
      } else {
        // Jika belum aktif, tambah ke filter
        return [...prev, categoryId];
      }
    });
  };

  // Clear semua filter
  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  // Get kategori yang akan ditampilkan berdasarkan filter aktif
  const getFilteredCategories = () => {
    try {
      console.log('🎛️ getFilteredCategories called');
      console.log('🔍 Active filters:', activeFilters);
      
      const ukmByCategory = getUKMByCategory();
      
      if (activeFilters.length === 0) {
        // Jika tidak ada filter aktif, tampilkan semua kategori yang memiliki UKM
        const result = categories.filter(category => {
          const categoryUKMs = ukmByCategory[category.id];
          const hasUKMs = categoryUKMs && categoryUKMs.length > 0;
          console.log(`📂 Category ${category.name}: ${categoryUKMs?.length || 0} UKMs, hasUKMs: ${hasUKMs}`);
          return hasUKMs;
        });
        console.log('📑 Filtered categories (no active filters):', result);
        return result;
      } else {
        // Jika ada filter aktif, hanya tampilkan kategori yang difilter dan memiliki UKM
        const result = categories.filter(category => {
          const categoryUKMs = ukmByCategory[category.id];
          const isFiltered = activeFilters.includes(category.id);
          const hasUKMs = categoryUKMs && categoryUKMs.length > 0;
          console.log(`📂 Category ${category.name}: filtered: ${isFiltered}, hasUKMs: ${hasUKMs}`);
          return isFiltered && hasUKMs;
        });
        console.log('📑 Filtered categories (with active filters):', result);
        return result;
      }
    } catch (error) {
      console.error('❌ Error in getFilteredCategories:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96 flex-col text-center p-8">
          <div className="loading-spinner mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data UKM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 max-w-md">
            <h2 className="text-red-600 mb-4 text-xl font-semibold">⚠️ Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ukmByCategory = getUKMByCategory();
  const filteredCategories = getFilteredCategories();
  
  // SAFETY CHECK: Ensure filteredCategories is always an array
  const safeFilteredCategories = Array.isArray(filteredCategories) ? filteredCategories : [];
  
  console.log('🎨 RENDER - UKM by Category:', ukmByCategory);
  console.log('🎨 RENDER - Filtered Categories:', safeFilteredCategories);
  console.log('🎨 RENDER - Total categories:', categories.length);
  console.log('🎨 RENDER - Total UKM data:', ukmData.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white text-gray-800 py-12 text-center">
        <div className="container">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
              🔍 TEMUKAN UKM YANG SESUAI DENGAN
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold">
              ✨ PASSION DAN MINATMU!
            </h2>
          </div>
          
          {/* User Authentication Status */}
          <RoleBasedComponent requireAuth={true} fallback={
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                💡 <strong>Tips:</strong> Masuk untuk mendapatkan rekomendasi UKM yang dipersonalisasi!
              </p>
            </div>
          }>
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                👋 Selamat datang, <strong>{user?.username}</strong>! Jelajahi UKM yang menarik minatmu.
              </p>
            </div>
          </RoleBasedComponent>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="container">
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Cari UKM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-5 pr-12 border-2 border-gray-200 rounded-full bg-gray-50 text-base transition-all focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800">Filter Kategori</h3>
            {activeFilters.length > 0 && (
              <button 
                onClick={clearAllFilters} 
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition-colors font-medium"
              >
                Hapus Semua Filter
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategoryFilter(category.id)}
                className={`flex items-center gap-3 py-3 px-6 border-2 rounded-full transition-all min-w-0 md:min-w-52 justify-center ${
                  activeFilters.includes(category.id)
                    ? 'text-white shadow-lg transform hover:-translate-y-1'
                    : 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-1'
                }`}
                style={{
                  backgroundColor: activeFilters.includes(category.id) ? category.color : '',
                  borderColor: activeFilters.includes(category.id) ? category.color : '',
                }}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium flex-1 text-left">{category.name}</span>
                <span className={`text-sm font-semibold ${
                  activeFilters.includes(category.id) ? 'opacity-100' : 'opacity-60'
                }`}>
                  ({ukmByCategory[category.id]?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* UKM Content by Category */}
      <section className="py-12">
        <div className="container">
          {safeFilteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">🔍 Tidak ada UKM yang ditemukan</p>
              <p className="text-gray-500 text-sm mt-2">Coba ubah filter pencarian Anda</p>
            </div>
          ) : (
            safeFilteredCategories.map(category => {
              const categoryUKMs = ukmByCategory[category.id] || [];
              console.log(`🎨 RENDERING Category ${category.name}: ${categoryUKMs.length} UKMs`);
              
              return (
                <div key={category.id} className="mb-16">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-3xl">{category.icon}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{category.name}</h2>
                    <span className="text-gray-500 text-lg">({categoryUKMs.length} UKM)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryUKMs.map(ukm => {
                      console.log(`🃏 RENDERING UKM Card:`, ukm);
                      return (
                        <div key={ukm.id} className="card group relative">
                    {/* Admin Delete Button - Only visible to role_id = 1 */}
                    <RoleBasedComponent allowedRoles={[1]}>
                      <div className="absolute top-2 right-2 z-10 flex gap-1">
                        <button 
                          onClick={() => handleDeleteUKM(ukm.id, ukm.nama)}
                          className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all"
                          title="Hapus UKM"
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>
                      </div>
                    </RoleBasedComponent>
                    
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={ukm.image} 
                        alt={ukm.nama} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{ukm.nama}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{ukm.deskripsi}</p>
                      
                      {/* Role-based action buttons */}
                      <RoleBasedComponent 
                        requireAuth={true}
                        fallback={
                          <div className="space-y-2">
                            <button 
                              onClick={() => navigate(`/ukm/${ukm.id}`)}
                              className="btn-primary w-full"
                            >
                              LIHAT DETAIL
                            </button>
                            <p className="text-xs text-center text-gray-500">Masuk untuk bergabung dengan UKM</p>
                          </div>
                        }
                      >
                        <div className="space-y-2">
                          <button 
                            onClick={() => navigate(`/ukm/${ukm.id}`)}
                            className="btn-primary w-full"
                          >
                            LIHAT DETAIL
                          </button>
                        </div>
                      </RoleBasedComponent>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          );
        })
          )}
          
          {/* Tampilkan pesan jika tidak ada UKM yang ditemukan */}
          {safeFilteredCategories.length === 0 && (
            <div className="flex justify-center items-center min-h-96">
              <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">🔍 Tidak ada UKM ditemukan</h2>
                {searchTerm && activeFilters.length > 0 ? (
                  <p className="text-gray-600 mb-6">Tidak ada UKM yang cocok dengan pencarian "{searchTerm}" pada kategori yang dipilih</p>
                ) : searchTerm ? (
                  <p className="text-gray-600 mb-6">Tidak ada UKM yang cocok dengan pencarian "{searchTerm}"</p>
                ) : activeFilters.length > 0 ? (
                  <p className="text-gray-600 mb-6">Tidak ada UKM pada kategori yang dipilih</p>
                ) : (
                  <p className="text-gray-600 mb-6">Belum ada data UKM yang tersedia saat ini</p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="btn-primary"
                    >
                      Hapus Pencarian
                    </button>
                  )}
                  {activeFilters.length > 0 && (
                    <button 
                      onClick={clearAllFilters} 
                      className="btn-secondary"
                    >
                      Hapus Filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UKM;
