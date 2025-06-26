import React, { useState, useEffect } from 'react';
import './UKM.css';

const UKM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ukmData, setUkmData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data dummy untuk demo (nanti akan diambil dari API)
  const dummyCategories = [
    {
      id: 1,
      name: 'Unit Kegiatan Olahraga',
      icon: '🏃‍♂️',
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Unit Kegiatan Kesenian',
      icon: '🎭',
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Unit Kegiatan Khusus',
      icon: '⭐',
      color: '#45B7D1'
    }
  ];

  const dummyUkmData = [
    // Unit Kegiatan Olahraga
    {
      id: 1,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 1,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 1,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 1,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },

    // Unit Kegiatan Kesenian
    {
      id: 4,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 2,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 2,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 2,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },

    // Unit Kegiatan Khusus
    {
      id: 7,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 3,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },
    {
      id: 8,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 3,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    },
    {
      id: 9,
      nama: 'UKM CATUR',
      deskripsi: 'Di UKM Catur Anda dapat belajar strategi yang dapat mengembangkan kemampuan berpikir dengan menggunakan strategi.',
      category_id: 3,
      image: 'https://images.unsplash.com/photo-1606166187734-a4cb7d4a3c6e?w=400&h=300&fit=crop'
    }
  ];

  useEffect(() => {
    // Simulasi loading data dari API
    setLoading(true);
    setTimeout(() => {
      setCategories(dummyCategories);
      setUkmData(dummyUkmData);
      setLoading(false);
    }, 1000);
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

  const ukmByCategory = getUKMByCategory();

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

      {/* UKM Content by Category */}
      <section className="ukm-content">
        <div className="container">
          {categories.map(category => (
            <div key={category.id} className="category-section">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h2>{category.name}</h2>
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
        </div>
      </section>
    </div>
  );
};

export default UKM;
