import React, { useState } from 'react';

const UKMNoAuth = () => {
  const [testState, setTestState] = useState('Component loaded successfully');

  console.log('🔥 UKMNoAuth: Component rendering');
  console.log('🔥 UKMNoAuth: Test state:', testState);

  // Simulate admin user for testing
  const mockUser = {
    username: 'test-admin',
    role: 'admin',
    role_id: 1,
    id: 1
  };

  const isAuthenticated = true; // Mock authentication
  const user = mockUser;

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
          
          {/* Mock Admin Panel - Always Show for Testing */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Panel Admin (Mock - No Auth)</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => {
                  console.log('🔥 Add UKM button clicked');
                  alert('Add UKM button works! (Mock)');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>➕</span>
                Tambah UKM
              </button>
              <button 
                onClick={() => {
                  console.log('🔥 Manage Categories button clicked');
                  alert('Manage Categories button works! (Mock)');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>⚙️</span>
                Kelola Kategori
              </button>
            </div>
          </div>
          
          {/* Mock User Status */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800">
              👋 Selamat datang, <strong>{user.username}</strong>! (Mock User)
            </p>
          </div>

          {/* Debug Info */}
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2">Debug Info (No AuthContext)</h4>
            <div className="text-sm text-yellow-700 text-left">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Role ID:</strong> {user.role_id}</p>
              <p><strong>Test State:</strong> {testState}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Cari UKM..."
              onChange={(e) => {
                console.log('🔥 Search input changed:', e.target.value);
                setTestState(`Search: ${e.target.value}`);
              }}
              className="w-full py-3 pl-5 pr-12 border-2 border-gray-200 rounded-full bg-gray-50 text-base transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>
      </section>

      {/* Sample UKM Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Sample UKM Cards (No Auth)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(id => (
              <div key={id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2 group relative">
                {/* Mock Admin buttons - Always show for testing */}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <button 
                    onClick={() => {
                      console.log(`🔥 Edit UKM ${id} clicked`);
                      alert(`Edit UKM ${id} clicked!`);
                    }}
                    className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all"
                    title="Edit UKM"
                  >
                    <span className="text-sm">✏️</span>
                  </button>
                  <button 
                    onClick={() => {
                      console.log(`🔥 Delete UKM ${id} clicked`);
                      if (confirm(`Delete UKM ${id}?`)) {
                        alert(`UKM ${id} deleted!`);
                      }
                    }}
                    className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all"
                    title="Hapus UKM"
                  >
                    <span className="text-sm">🗑️</span>
                  </button>
                </div>
                
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={`https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop`}
                    alt={`UKM Test ${id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">UKM Test {id}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Deskripsi UKM test nomor {id} untuk testing admin functionality tanpa AuthContext.
                  </p>
                  
                  <button 
                    onClick={() => {
                      console.log(`🔥 View details UKM ${id} clicked`);
                      alert(`View details UKM ${id}!`);
                    }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-600 w-full"
                  >
                    LIHAT DETAIL
                  </button>
                  
                  {/* Mock admin edit button - Always show */}
                  <button 
                    onClick={() => {
                      console.log(`🔥 Admin edit UKM ${id} clicked`);
                      alert(`Admin edit UKM ${id}!`);
                    }}
                    className="bg-white text-blue-500 border-2 border-blue-500 px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-500 hover:text-white w-full mt-2 text-sm"
                  >
                    EDIT UKM (Admin)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Debug */}
      <div className="bg-gray-800 text-white py-4 text-center">
        <p>🔥 UKMNoAuth Component - No AuthContext Dependencies - Test State: {testState}</p>
      </div>
    </div>
  );
};

export default UKMNoAuth;
