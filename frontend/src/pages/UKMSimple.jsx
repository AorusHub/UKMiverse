import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import RoleBasedComponent from '../components/RoleBasedComponent';
import AddUKMModal from '../components/AddUKMModal';
import EditUKMModal from '../components/EditUKMModal';
import UserDebug from '../components/UserDebug';
import { Plus, Edit2, Settings, Trash2 } from 'lucide-react';

const UKMSimple = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🐛 UKMSimple: Component rendering');
  console.log('🐛 User:', user);
  console.log('🐛 isAuthenticated:', isAuthenticated);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
          
          {/* Debug User Info */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Debug Info</h3>
            <p className="text-yellow-700">
              User: {user ? user.username : 'Not logged in'} | 
              Role: {user?.role || 'N/A'} | 
              Role ID: {user?.role_id || 'N/A'} |
              Authenticated: {isAuthenticated ? 'Yes' : 'No'}
            </p>
          </div>
          
          {/* Admin Actions - Test with simple logic */}
          {user && (user.role === 'admin' || user.role_id === 1) && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Panel Admin (Direct Check)</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Tambah UKM
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  Kelola Kategori
                </button>
              </div>
            </div>
          )}

          {/* Admin Actions - Test with RoleBasedComponent */}
          <div className="mt-4">
            <RoleBasedComponent allowedRoles={['admin', 1]}>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Panel Admin (RoleBasedComponent)</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Tambah UKM (RBC)
                  </button>
                </div>
              </div>
            </RoleBasedComponent>
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

      {/* Simple UKM List */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Daftar UKM Sederhana</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(id => (
              <div key={id} className="card group relative">
                {/* Admin Edit and Delete Buttons - Only visible to admins */}
                <RoleBasedComponent allowedRoles={['admin', 1]}>
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all">
                      <Edit2 className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                    </button>
                    <button className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all">
                      <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </RoleBasedComponent>
                
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={`https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop`}
                    alt={`UKM ${id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">UKM Test {id}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">Deskripsi UKM test nomor {id}</p>
                  
                  <button className="btn-primary w-full">
                    LIHAT DETAIL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Debug Component */}
      <UserDebug />
    </div>
  );
};

export default UKMSimple;
