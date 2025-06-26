import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Pelantikan Bersama 32 UKM Universitas Hasanuddin",
      description: "Berbagai kegiatan pelantikan dan alumni UKM wartawan hasanuddin untuk menjalin pelantikan pengurus bersama tahun ini. Kegiatan Mahasiswa (UKM)"
    },
    {
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2049&q=80",
      title: "Festival Seni dan Budaya UKM",
      description: "Menampilkan berbagai karya seni dan budaya dari seluruh UKM kesenian Universitas Hasanuddin"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Kompetisi Olahraga Antar UKM",
      description: "Ajang kompetisi tahunan untuk menjalin kebersamaan dan sportivitas antar UKM olahraga"
    }
  ];

  const ukmCategories = [
    {
      title: "Unit Kegiatan Olahraga",
      icon: "🏃‍♂️",
      description: "Wadah pengembangan bakat olahraga"
    },
    {
      title: "Unit Kegiatan Kesenian", 
      icon: "🎭",
      description: "Tempat berkreasi seni dan budaya"
    },
    {
      title: "Unit Kegiatan Khusus",
      icon: "⭐",
      description: "Kegiatan khusus dan penalaran"
    }
  ];

  const ukmRecommendations = [
    {
      title: "Unit Persatuan Catur",
      description: "UKM Persatuan Catur Universitas UKM berdedikasi yang memfokuskan diri pada pembentukan karakter"
    },
    {
      title: "Unit Persatuan Catur", 
      description: "UKM Persatuan Catur Universitas UKM berdedikasi yang memfokuskan diri pada pembentukan karakter"
    },
    {
      title: "Unit Persatuan Catur",
      description: "UKM Persatuan Catur Universitas UKM berdedikasi yang memfokuskan diri pada pembentukan karakter"  
    },
    {
      title: "Unit Persatuan Catur",
      description: "UKM Persatuan Catur Universitas UKM berdedikasi yang memfokuskan diri pada pembentukan karakter"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home">
      {/* Hero Carousel Section */}
      <section className="hero-carousel">
        <div className="carousel-container">
          <div className="carousel-slide" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              <h1>{slides[currentSlide].title}</h1>
              <p>{slides[currentSlide].description}</p>
              <button className="btn-selengkapnya">Selengkapnya</button>
            </div>
          </div>
          <button className="carousel-nav prev" onClick={prevSlide}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="carousel-nav next" onClick={nextSlide}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Kegiatan Mahasiswa Section */}
      <section className="ukm-info">
        <div className="container">
          <h2>UNIT KEGIATAN MAHASISWA</h2>
          <div className="ukm-description">
            <p>
              Unit Kegiatan Mahasiswa (disingkat UKM) adalah wadah aktivitas kemahasiswaan 
              luar kelas untuk mengembangkan minat, bakat dan keahlian tertentu. Lembaga ini 
              merupakan partner organisasi kemahasiswaan intra kampus lainnya seperti senat 
              mahasiswa dan badan eksekutif mahasiswa, baik yang berada di tingkat program 
              studi, jurusan, maupun universitas. Lembaga ini bersifat otonom, dan bukan sebagai 
              cabang dari badan eksekutif maupun senat mahasiswa.
            </p>
          </div>
          
          <p className="ukm-subtitle">Unit kegiatan mahasiswa terdiri dari tiga kelompok minat:</p>
          
          <div className="ukm-categories">
            {ukmCategories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rekomendasi UKM Section */}
      <section className="ukm-recommendations">
        <div className="container">
          <h2>Rekomendasi UKM Buatmu</h2>
          <div className="recommendations-grid">
            {ukmRecommendations.map((ukm, index) => (
              <div key={index} className="recommendation-card">
                <div className="ukm-logo">
                  <img src="/logo-unhas.svg" alt="UKM Logo" />
                </div>
                <h3>{ukm.title}</h3>
                <p>{ukm.description}</p>
                <button className="btn-selengkapnya small">Selengkapnya</button>
              </div>
            ))}
          </div>
          
          {/* CTA Section inside Recommendations */}
          <div className="cta-content">
            <h2>Gabung sekarang dan jadilah bagian dari komunitas kampus yang aktif dan seru!</h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
