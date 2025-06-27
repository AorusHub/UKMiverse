import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & University Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logo-unhas.svg" alt="Logo Unhas" className="h-16 w-16 bg-white rounded-lg p-2" />
              <div>
                <h3 className="text-2xl font-bold text-white">UKMiverse</h3>
                <p className="text-purple-200 text-sm">Portal UKM Unhas</p>
              </div>
            </div>
            <div className="text-purple-200 text-sm leading-relaxed">
              <p className="font-semibold text-white mb-2">Universitas Hasanuddin</p>
              <p>Platform digital untuk menghubungkan mahasiswa dengan Unit Kegiatan Mahasiswa yang sesuai minat dan bakat.</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-white mb-6 border-b-2 border-purple-600 pb-2 inline-block">Kontak Kami</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <p className="text-white font-medium">Telepon</p>
                  <p className="text-purple-200 text-sm">+62 852-4959-8688</p>
                  <p className="text-purple-200 text-sm">+62 853-4209-467</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <span className="text-lg">✉️</span>
                </div>
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-purple-200 text-sm">reghni@bantara.co.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <span className="text-lg">🌐</span>
                </div>
                <div>
                  <p className="text-white font-medium">Website</p>
                  <p className="text-purple-200 text-sm">ukmiverse.unhas.ac.id</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Campus Info */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-white mb-6 border-b-2 border-purple-600 pb-2 inline-block">Alamat Kampus</h4>
            <div className="bg-purple-700 p-4 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <span className="text-lg">�</span>
                </div>
                <div>
                  <p className="text-white font-medium">Kampus Utama</p>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Lantai 2, Gedung Rektorat<br/>
                    Jl. Perintis Kemerdekaan Km. 10<br/>
                    Tamalanrea, Makassar<br/>
                    90245, Sulawesi Selatan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <span className="text-lg">☎️</span>
                </div>
                <div>
                  <p className="text-white font-medium">Telepon Kampus</p>
                  <p className="text-purple-200 text-sm">0411-588200</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-purple-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-purple-200 text-sm">
                &copy; 2025 <span className="text-white font-semibold">UKMiverse</span> - Universitas Hasanuddin
              </p>
              <p className="text-purple-300 text-xs mt-1">All rights reserved. Made with ❤️ for UNHAS students</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="bg-purple-600 hover:bg-purple-500 p-2 rounded-lg transition-colors cursor-pointer">
                  <span className="text-lg">📘</span>
                </div>
                <div className="bg-purple-600 hover:bg-purple-500 p-2 rounded-lg transition-colors cursor-pointer">
                  <span className="text-lg">📷</span>
                </div>
                <div className="bg-purple-600 hover:bg-purple-500 p-2 rounded-lg transition-colors cursor-pointer">
                  <span className="text-lg">🐦</span>
                </div>
                <div className="bg-purple-600 hover:bg-purple-500 p-2 rounded-lg transition-colors cursor-pointer">
                  <span className="text-lg">💼</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
