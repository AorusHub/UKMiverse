import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">ABOUT US</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">UKMiverse</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  adalah dunia interaktif organisasi kampus yang memungkinkan mahasiswa untuk mengeksplorasi, 
                  mengenal, dan bergabung dengan Unit Kegiatan Mahasiswa (UKM) sesuai dengan minat dan bakat 
                  mereka.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <div className="text-2xl">⭐</div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Kami hadir untuk membantu mahasiswa menemukan komunitas yang tepat untuk 
                    berkembang, berkreasi, dan berkontribusi di luar ruang kelas.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <div className="text-2xl">⚙️</div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    UKMiverse dikelola oleh tim pengembang kampus yang peduli terhadap perkembangan mahasiswa, 
                    dengan tujuan memudahkan akses informasi UKM dan mendorong partisipasi aktif di lingkungan 
                    organisasi kampus.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl p-8 min-h-[400px] overflow-hidden">
                {/* Floating Elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-6 text-2xl animate-bounce delay-100">🎭</div>
                  <div className="absolute top-12 right-8 text-2xl animate-bounce delay-200">🏀</div>
                  <div className="absolute top-24 left-12 text-2xl animate-bounce delay-300">🎵</div>
                  <div className="absolute bottom-20 right-6 text-2xl animate-bounce delay-500">⚽</div>
                  <div className="absolute bottom-32 left-4 text-2xl animate-bounce delay-700">🎯</div>
                  <div className="absolute top-20 right-20 text-2xl animate-bounce delay-400">🏓</div>
                  <div className="absolute bottom-12 left-16 text-2xl animate-bounce delay-600">🎤</div>
                </div>
                
                {/* Main Illustration */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="flex gap-4 mb-6">
                    <div className="w-16 h-16 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
                    <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg animate-pulse delay-100"></div>
                  </div>
                  
                  {/* Browser Window */}
                  <div className="bg-white rounded-lg shadow-xl w-64 h-40">
                    <div className="bg-gray-200 rounded-t-lg p-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse delay-100"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-purple-600">Jelajahi UKMiverse sekarang!</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
