import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const AddUKMModal = ({ isOpen, onClose, categories, onSubmit }) => {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    category_id: '',
    prestasi: '',
    kegiatan_rutin: '',
    logo_url: '',
    contact_person: '',
    contact_email: '',
    contact_phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama UKM harus diisi';
    }
    
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi UKM harus diisi';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Kategori harus dipilih';
    }
    
    if (!formData.prestasi.trim()) {
      newErrors.prestasi = 'Prestasi harus diisi';
    }
    
    if (!formData.kegiatan_rutin.trim()) {
      newErrors.kegiatan_rutin = 'Kegiatan rutin harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        nama: '',
        deskripsi: '',
        category_id: '',
        prestasi: '',
        kegiatan_rutin: '',
        logo_url: '',
        contact_person: '',
        contact_email: '',
        contact_phone: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        nama: '',
        deskripsi: '',
        category_id: '',
        prestasi: '',
        kegiatan_rutin: '',
        logo_url: '',
        contact_person: '',
        contact_email: '',
        contact_phone: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Tambah UKM Baru
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nama UKM */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama UKM *
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Masukkan nama UKM"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.nama ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
            )}
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.category_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Pilih kategori UKM</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi UKM *
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              placeholder="Masukkan deskripsi lengkap UKM"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-vertical ${
                errors.deskripsi ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.deskripsi && (
              <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
            )}
          </div>

          {/* Kegiatan Rutin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kegiatan Rutin *
            </label>
            <textarea
              name="kegiatan_rutin"
              value={formData.kegiatan_rutin}
              onChange={handleInputChange}
              placeholder="Contoh:&#10;• Latihan rutin setiap Jumat sore&#10;• Workshop bulanan&#10;• Turnamen internal"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-vertical ${
                errors.kegiatan_rutin ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.kegiatan_rutin && (
              <p className="text-red-500 text-sm mt-1">{errors.kegiatan_rutin}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              💡 Gunakan format list dengan bullet point (•) untuk setiap kegiatan
            </p>
          </div>

          {/* Prestasi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prestasi *
            </label>
            <textarea
              name="prestasi"
              value={formData.prestasi}
              onChange={handleInputChange}
              placeholder="Contoh:&#10;• Juara 1 Kompetisi Fakultas 2023&#10;• Finalis Nasional 2022&#10;• Juara Harapan Regional 2024"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-vertical ${
                errors.prestasi ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.prestasi && (
              <p className="text-red-500 text-sm mt-1">{errors.prestasi}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              🏆 Gunakan format list dengan bullet point (•) untuk setiap prestasi
            </p>
          </div>

          {/* Optional Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Tambahan (Opsional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Logo
                </label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  placeholder="Nama kontak person"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Kontak
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="contact@ukm.unhas.ac.id"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah UKM
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUKMModal;
