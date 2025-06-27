import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Simple version without RoleBasedComponent and modals to test if those are causing issues
const UKMTest = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🔥 UKMTest: Component is rendering');
  console.log('🔥 User:', user);
  console.log('🔥 isAuthenticated:', isAuthenticated);

  useEffect(() => {
    console.log('🔥 UKMTest: useEffect running');
    // Simulate loading
    setTimeout(() => {
      console.log('🔥 UKMTest: Setting loading to false');
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    console.log('🔥 UKMTest: Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96 flex-col text-center p-8">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data UKM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🔥 UKMTest: Rendering error state');
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 max-w-md">
            <h2 className="text-red-600 mb-4 text-xl font-semibold">⚠️ Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔥 UKMTest: Rendering main content');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white text-gray-800 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
              🔍 TEMUKAN UKM YANG SESUAI DENGAN
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold">
              ✨ PASSION DAN MINATMU!
            </h2>
          </div>
          
          {/* Simple Admin Check without RoleBasedComponent */}
          {user && (user.role === 'admin' || user.role_id === 1) && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Panel Admin (Direct Check)</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <span>➕</span>
                  Tambah UKM
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <span>⚙️</span>
                  Kelola Kategori
                </button>
              </div>
            </div>
          )}
          
          {/* Simple Authentication Status */}
          {isAuthenticated ? (
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                👋 Selamat datang, <strong>{user?.username}</strong>! Jelajahi UKM yang menarik minatmu.
              </p>
            </div>
          ) : (
            <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">
                💡 <strong>Tips:</strong> Masuk untuk mendapatkan rekomendasi UKM yang dipersonalisasi!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Cari UKM..."
              className="w-full py-3 pl-5 pr-12 border-2 border-gray-200 rounded-full bg-gray-50 text-base transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
      </section>

      {/* Sample UKM Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Daftar UKM Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(id => (
              <div key={id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2 group relative">
                {/* Admin buttons for testing */}
                {user && (user.role === 'admin' || user.role_id === 1) && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all">
                      <span className="w-4 h-4 text-gray-600 hover:text-blue-600">✏️</span>
                    </button>
                    <button className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all">
                      <span className="w-4 h-4 text-gray-600 hover:text-red-600">🗑️</span>
                    </button>
                  </div>
                )}
                
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={`https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop`}
                    alt={`UKM Test ${id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">UKM Test {id}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">Deskripsi UKM test nomor {id} untuk testing purposes.</p>
                  
                  <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 w-full">
                    LIHAT DETAIL
                  </button>
                  
                  {user && (user.role === 'admin' || user.role_id === 1) && (
                    <button className="bg-white text-blue-500 border-2 border-blue-500 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-500 hover:text-white w-full mt-2 text-sm">
                      EDIT UKM
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Debug info */}
      <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-sm">
        <h4 className="font-bold text-blue-800">Debug: User Info</h4>
        <div className="text-sm text-blue-700 mt-2">
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
          {user && (
            <>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Role:</strong> {user.role || 'undefined'}</p>
              <p><strong>Role ID:</strong> {user.role_id || 'undefined'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UKMTest;
