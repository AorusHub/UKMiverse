import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';

const EditUKMModal = ({ isOpen, onClose, categories, ukm, onSubmit }) => {
  const [formData, setFormData] = useState({
    nama: ukm?.nama || '',
    deskripsi: ukm?.deskripsi || '',
    category_id: ukm?.category_id || '',
    prestasi: ukm?.prestasi || '',
    kegiatan_rutin: ukm?.kegiatan_rutin || '',
    logo_url: ukm?.logo_url || '',
    contact_person: ukm?.contact_person || '',
    contact_email: ukm?.contact_email || '',
    contact_phone: ukm?.contact_phone || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update form data when ukm prop changes
  React.useEffect(() => {
    if (ukm) {
      setFormData({
        nama: ukm.nama || '',
        deskripsi: ukm.deskripsi || '',
        category_id: ukm.category_id || '',
        prestasi: ukm.prestasi || '',
        kegiatan_rutin: ukm.kegiatan_rutin || '',
        logo_url: ukm.logo_url || '',
        contact_person: ukm.contact_person || '',
        contact_email: ukm.contact_email || '',
        contact_phone: ukm.contact_phone || ''
      });
    }
  }, [ukm]);

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
      await onSubmit(ukm.id, formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  if (!isOpen || !ukm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Edit2 className="w-6 h-6 text-green-600" />
            Edit UKM: {ukm.nama}
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.nama ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.nama && <p className="text-red-600 text-sm mt-1">{errors.nama}</p>}
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                errors.category_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Pilih kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>}
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
              placeholder="Masukkan deskripsi UKM"
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-vertical ${
                errors.deskripsi ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.deskripsi && <p className="text-red-600 text-sm mt-1">{errors.deskripsi}</p>}
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
              placeholder="Masukkan prestasi yang pernah diraih (pisahkan dengan bullet points)"
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-vertical ${
                errors.prestasi ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.prestasi && <p className="text-red-600 text-sm mt-1">{errors.prestasi}</p>}
            <p className="text-gray-500 text-xs mt-1">Contoh: • Juara 1 Kompetisi A • Juara 2 Kompetisi B</p>
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
              placeholder="Masukkan kegiatan rutin yang dilakukan (pisahkan dengan bullet points)"
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-vertical ${
                errors.kegiatan_rutin ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.kegiatan_rutin && <p className="text-red-600 text-sm mt-1">{errors.kegiatan_rutin}</p>}
            <p className="text-gray-500 text-xs mt-1">Contoh: • Latihan setiap Senin • Pertemuan bulanan</p>
          </div>

          {/* Optional Fields Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Tambahan (Opsional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  placeholder="Nama penanggung jawab"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="email@ukm.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Update UKM
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUKMModal;
