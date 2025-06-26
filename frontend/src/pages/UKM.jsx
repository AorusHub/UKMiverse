import React, { useState, useEffect } from 'react';
import './UKM.css';

const UKM = () => {
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

  // Fetch data dari backend API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ukm/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      // Transform data untuk menambahkan icon dan color
      const categoriesWithExtras = data.map(category => ({
        ...category,
        icon: categoryIcons[category.name] || categoryIcons[category.name.toLowerCase()] || '📋',
        color: categoryColors[category.name] || categoryColors[category.name.toLowerCase()] || '#666'
      }));
      
      setCategories(categoriesWithExtras);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Gagal memuat kategori UKM');
    }
  };

  const fetchUKMs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ukm/`);
      if (!response.ok) {
        throw new Error('Failed to fetch UKMs');
      }
      const data = await response.json();
      setUkmData(data);
    } catch (error) {
      console.error('Error fetching UKMs:', error);
      setError('Gagal memuat data UKM');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchCategories(), fetchUKMs()]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getUKMByCategory = () => {
    const result = {};
    categories.forEach(category => {
      let categoryUKMs = ukmData.filter(ukm => ukm.category_id === category.id);
      
      // Filter by search term if exists
      if (searchTerm) {
        categoryUKMs = categoryUKMs.filter(ukm =>
          ukm.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ukm.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      result[category.id] = categoryUKMs;
    });
    return result;
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
    if (activeFilters.length === 0) {
      // Jika tidak ada filter aktif, tampilkan semua kategori yang memiliki UKM
      return categories.filter(category => {
        const categoryUKMs = getUKMByCategory()[category.id];
        return categoryUKMs && categoryUKMs.length > 0;
      });
    } else {
      // Jika ada filter aktif, hanya tampilkan kategori yang difilter dan memiliki UKM
      return categories.filter(category => {
        const categoryUKMs = getUKMByCategory()[category.id];
        return activeFilters.includes(category.id) && categoryUKMs && categoryUKMs.length > 0;
      });
    }
  };

  if (loading) {
    return (
      <div className="ukm-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data UKM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ukm-page">
        <div className="error-container">
          <div className="error-message">
            <h2>⚠️ Terjadi Kesalahan</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-retry"
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

  return (
    <div className="ukm-page">
      {/* Hero Section */}
      <section className="ukm-hero">
        <div className="container">
          <div className="hero-content">
            <h1>🔍 TEMUKAN UKM YANG SESUAI DENGAN</h1>
            <h2>✨ PASSION DAN MINATMU!</h2>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="ukm-search">
        <div className="container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cari UKM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="ukm-filters">
        <div className="container">
          <div className="filter-header">
            <h3>Filter Kategori</h3>
            {activeFilters.length > 0 && (
              <button onClick={clearAllFilters} className="btn-clear-filters">
                Hapus Semua Filter
              </button>
            )}
          </div>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategoryFilter(category.id)}
                className={`filter-btn ${activeFilters.includes(category.id) ? 'active' : ''}`}
                style={{
                  '--category-color': category.color
                }}
              >
                <span className="filter-icon">{category.icon}</span>
                <span className="filter-name">{category.name}</span>
                <span className="filter-count">
                  ({ukmByCategory[category.id]?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* UKM Content by Category */}
      <section className="ukm-content">
        <div className="container">
          {filteredCategories.map(category => (
            <div key={category.id} className="category-section">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h2>{category.name}</h2>
                <span className="category-count">({ukmByCategory[category.id].length} UKM)</span>
              </div>
              
              <div className="ukm-grid">
                {ukmByCategory[category.id]?.map(ukm => (
                  <div key={ukm.id} className="ukm-card">
                    <div className="ukm-image">
                      <img src={ukm.image} alt={ukm.nama} />
                    </div>
                    <div className="ukm-info">
                      <h3>{ukm.nama}</h3>
                      <p>{ukm.deskripsi}</p>
                      <button className="btn-gabung">GABUNG</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Tampilkan pesan jika tidak ada UKM yang ditemukan */}
          {filteredCategories.length === 0 && (
            <div className="no-ukm-found">
              <div className="no-ukm-message">
                <h2>🔍 Tidak ada UKM ditemukan</h2>
                {searchTerm && activeFilters.length > 0 ? (
                  <p>Tidak ada UKM yang cocok dengan pencarian "{searchTerm}" pada kategori yang dipilih</p>
                ) : searchTerm ? (
                  <p>Tidak ada UKM yang cocok dengan pencarian "{searchTerm}"</p>
                ) : activeFilters.length > 0 ? (
                  <p>Tidak ada UKM pada kategori yang dipilih</p>
                ) : (
                  <p>Belum ada data UKM yang tersedia saat ini</p>
                )}
                <div className="no-ukm-actions">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="btn-clear-search"
                    >
                      Hapus Pencarian
                    </button>
                  )}
                  {activeFilters.length > 0 && (
                    <button 
                      onClick={clearAllFilters} 
                      className="btn-clear-filters"
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
