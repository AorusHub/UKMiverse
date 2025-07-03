import React, { useState, useEffect } from 'react';
import olahragaIcon from '../assets/sport.png';
import seniIcon from '../assets/seni.png';
import khususIcon from '../assets/khusus.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ukmRecommendations, setUkmRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Base URL untuk API backend
  const API_BASE_URL = 'http://localhost:5000/api';
  
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
      icon: olahragaIcon,
      description: "Wadah pengembangan bakat olahraga"
    },
    {
      title: "Unit Kegiatan Kesenian", 
      icon: seniIcon,
      description: "Tempat berkreasi seni dan budaya"
    },
    {
      title: "Unit Kegiatan Khusus",
      icon: khususIcon,
      description: "Kegiatan khusus dan penalaran"
    }
  ];

  // Fetch random UKM recommendations from database
  const fetchRandomUKMs = async () => {
    try {
      setLoading(true);
      console.log('Fetching random UKMs from database...');
      
      const response = await fetch(`${API_BASE_URL}/ukm/random?limit=4`);
      if (response.ok) {
        const randomUkms = await response.json();
        console.log('Random UKMs received:', randomUkms);
        
        const transformedUkms = randomUkms.map(ukm => ({
          title: ukm.nama,
          description: ukm.deskripsi,
          image: ukm.image || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1626224583764-f87db24ac4ea' : '1493225457124-a3eb161ffa5f'}?w=400&h=300&fit=crop`,
          category: ukm.category?.name || 'UKM'
        }));
        
        setUkmRecommendations(transformedUkms);
        console.log('✅ Random UKMs loaded:', transformedUkms);
      } else {
        throw new Error('Failed to fetch random UKMs');
      }
    } catch (error) {
      console.error('❌ Error fetching random UKMs:', error);
      // Fallback data if API fails
      setUkmRecommendations([
        {
          title: "UKM Catur",
          description: "Unit Kegiatan Mahasiswa untuk mengembangkan kemampuan strategi dan pemikiran logis melalui permainan catur.",
          category: "Unit Kegiatan Khusus"
        },
        {
          title: "UKM Badminton", 
          description: "Unit Kegiatan Mahasiswa untuk mengembangkan kemampuan olahraga badminton dan sportivitas.",
          category: "Unit Kegiatan Olahraga"
        },
        {
          title: "UKM Musik",
          description: "Unit Kegiatan Mahasiswa untuk mengembangkan bakat dan kreativitas di bidang musik.",
          category: "Unit Kegiatan Kesenian"
        },
        {
          title: "UKM Fotografi",
          description: "Unit Kegiatan Mahasiswa untuk mengembangkan kemampuan fotografi dan visual arts.",
          category: "Unit Kegiatan Khusus"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carousel timer
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    // Fetch random UKMs from database
    fetchRandomUKMs();
    
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Carousel Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden w-full">
        <div className="relative w-full h-full">
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>
            <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
                {slides[currentSlide].description}
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                Selengkapnya
              </button>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all duration-300 z-30"
            onClick={prevSlide}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all duration-300 z-30"
            onClick={nextSlide}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-110' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Kegiatan Mahasiswa Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            UNIT KEGIATAN MAHASISWA
          </h2>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-gray-600 leading-relaxed text-justify">
              Unit Kegiatan Mahasiswa (disingkat UKM) adalah wadah aktivitas kemahasiswaan 
              luar kelas untuk mengembangkan minat, bakat dan keahlian tertentu. Lembaga ini 
              merupakan partner organisasi kemahasiswaan intra kampus lainnya seperti senat 
              mahasiswa dan badan eksekutif mahasiswa, baik yang berada di tingkat program 
              studi, jurusan, maupun universitas. Lembaga ini bersifat otonom, dan bukan sebagai 
              cabang dari badan eksekutif maupun senat mahasiswa.
            </p>
          </div>
          
          <p className="text-xl font-semibold text-center text-gray-700 mb-12">
            Unit kegiatan mahasiswa terdiri dari tiga kelompok minat:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {ukmCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-gray-100">
                <div className="text-6xl mb-6 flex justify-center">
                  <img src={category.icon} alt={category.title} className="w-16 h-16 object-contain" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{category.title}</h3>
                <p className="text-gray-600 leading-relaxed">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rekomendasi UKM Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Rekomendasi UKM Buatmu
            </h2>
            <button 
              onClick={fetchRandomUKMs}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  🎲 Acak Lagi
                </>
              )}
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
              {ukmRecommendations.map((ukm, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center border border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    {ukm.category?.includes('Olahraga') ? '🏃‍♂️' : 
                     ukm.category?.includes('Kesenian') ? '🎭' : 
                     '⭐'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{ukm.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{ukm.description}</p>
                  <div className="mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {ukm.category || 'UKM'}
                    </span>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105">
                    Selengkapnya
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* CTA Section inside Recommendations */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              Gabung sekarang dan jadilah bagian dari komunitas kampus yang aktif dan seru!
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
