import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import RoleBasedComponent from '../components/RoleBasedComponent';
import AddUKMModal from '../components/AddUKMModal';
import EditUKMModal from '../components/EditUKMModal';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('ukms');
  const [ukms, setUkms] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Unit Kegiatan Olahraga' },
    { id: 2, name: 'Unit Kegiatan Kesenian' },
    { id: 3, name: 'Unit Kegiatan Khusus' }
  ]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUKM, setSelectedUKM] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Base URL untuk API backend
  const API_BASE_URL = 'http://localhost:5000/api';

  // Load data from database
  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      // Fetch UKMs
      const ukmsResponse = await fetch(`${API_BASE_URL}/ukm/`);
      if (ukmsResponse.ok) {
        const ukmsData = await ukmsResponse.json();
        console.log('📊 Raw UKMs data from backend:', ukmsData);
        // Log first UKM to see its structure
        if (ukmsData.length > 0) {
          console.log('📊 First UKM structure:', ukmsData[0]);
          console.log('📊 All fields in first UKM:', Object.keys(ukmsData[0]));
        }
        setUkms(ukmsData);
      }

      // Fetch categories  
      const categoriesResponse = await fetch(`${API_BASE_URL}/ukm/categories`);
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      }

      // Fetch users
      const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }
      
    } catch (error) {
      // Use fallback data if backend is not available
      setCategories([
        { id: 1, name: 'Unit Kegiatan Olahraga' },
        { id: 2, name: 'Unit Kegiatan Kesenian' },
        { id: 3, name: 'Unit Kegiatan Khusus' }
      ]);
      
      setUkms([
        { id: 1, nama: 'UKM Badminton', category_id: 1, deskripsi: 'Olahraga badminton', prestasi: 'Juara 1' },
        { id: 2, nama: 'UKM Musik', category_id: 2, deskripsi: 'Musik kampus', prestasi: 'Festival' },
        { id: 3, nama: 'UKM Bahasa', category_id: 3, deskripsi: 'Bahasa dan sastra', prestasi: 'Debat' }
      ]);
      
      setUsers([{ id: 1, username: 'admin', email: 'admin@unhas.ac.id', role: { name: 'admin' } }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUKM = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ukm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('✅ UKM berhasil ditambahkan');
        setIsAddModalOpen(false);
        await loadData(); // Refresh data
        alert('UKM berhasil ditambahkan!');
      } else {
        const errorData = await response.json();
        alert(`Gagal menambah UKM: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding UKM:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditUKM = async (ukmId, formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ukm/${ukmId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('✅ UKM berhasil diupdate');
        setIsEditModalOpen(false);
        setSelectedUKM(null);
        await loadData(); // Refresh data
        alert('UKM berhasil diupdate!');
      } else {
        const errorData = await response.json();
        alert(`Gagal mengupdate UKM: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating UKM:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUKM = async (id, nama) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus UKM "${nama}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/ukm/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('✅ UKM berhasil dihapus');
        await loadData(); // Refresh data
        alert('UKM berhasil dihapus!');
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus UKM: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting UKM:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const openEditModal = (ukm) => {
    setSelectedUKM(ukm);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUKM(null);
    setIsEditModalOpen(false);
  };

  // User management functions
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleAddUser = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('✅ User berhasil ditambahkan');
        setIsAddUserModalOpen(false);
        await loadData(); // Refresh data
        alert('User berhasil ditambahkan!');
      } else {
        const errorData = await response.json();
        alert(`Gagal menambah user: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleUpdateUser = async (updateData) => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        console.log('✅ User berhasil diupdate');
        setIsEditUserModalOpen(false);
        setSelectedUser(null);
        await loadData(); // Refresh data
        alert('User berhasil diupdate!');
      } else {
        const errorData = await response.json();
        alert(`Gagal update user: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (userId === 1) {
      alert('Tidak dapat menghapus admin utama!');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus user "${username}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token tidak ditemukan');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('✅ User berhasil dihapus');
        await loadData(); // Refresh data
        alert(`User "${username}" berhasil dihapus!`);
      } else {
        const errorData = await response.json();
        alert(`Gagal menghapus user: ${errorData.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const renderUKMsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Manajemen UKM</h3>
        <div className="flex space-x-2">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah UKM</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama UKM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prestasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ukms.map((ukm) => {
                  // Simple category mapping with intelligent defaults
                  let categoryName = 'Unit Kegiatan Khusus'; // Default fallback
                  
                  // Check if category_id exists and is valid
                  if (ukm.category_id !== null && ukm.category_id !== undefined) {
                    const id = Number(ukm.category_id);
                    if (!isNaN(id)) {
                      switch(id) {
                        case 1: categoryName = 'Unit Kegiatan Olahraga'; break;
                        case 2: categoryName = 'Unit Kegiatan Kesenian'; break;
                        case 3: categoryName = 'Unit Kegiatan Khusus'; break;
                        default: categoryName = `Kategori ${id}`;
                      }
                    }
                  } else {
                    // Smart categorization based on UKM name if no category_id
                    const namaLower = ukm.nama?.toLowerCase() || '';
                    if (namaLower.includes('basket') || namaLower.includes('futsal') || namaLower.includes('badminton') || 
                        namaLower.includes('voli') || namaLower.includes('sepak') || namaLower.includes('renang') ||
                        namaLower.includes('tenis') || namaLower.includes('atletik') || namaLower.includes('olahraga')) {
                      categoryName = 'Unit Kegiatan Olahraga';
                    } else if (namaLower.includes('musik') || namaLower.includes('seni') || namaLower.includes('tari') || 
                              namaLower.includes('teater') || namaLower.includes('paduan suara') || namaLower.includes('band')) {
                      categoryName = 'Unit Kegiatan Kesenian';
                    } else if (namaLower.includes('catur') || namaLower.includes('debat') || namaLower.includes('bahasa') ||
                              namaLower.includes('komputer') || namaLower.includes('teknologi') || namaLower.includes('sains')) {
                      categoryName = 'Unit Kegiatan Khusus';
                    }
                  }
                  
                  return (
                    <tr key={ukm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ukm.nama}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{ukm.deskripsi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                          {categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {ukm.prestasi || 'Belum ada prestasi'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(ukm)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Edit UKM"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUKM(ukm.id, ukm.nama)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Hapus UKM"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Manajemen User</h3>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      (user.role?.name === 'admin' || user.role === 'admin') 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role?.name || user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.id !== 1 && ( // Jangan bisa hapus admin utama
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <RoleBasedComponent 
      allowedRoles={[1, 'admin']} 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
            <p className="text-gray-600">Anda tidak memiliki akses ke panel admin.</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
            <p className="mt-2 text-gray-600">
              Selamat datang, {user?.username}. Kelola konten UKMiverse dari sini.
            </p>
          </div>

          {/* Tabs - Only UKM and Users, no Categories */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'ukms', label: 'UKM', count: ukms.length },
                  { id: 'users', label: 'Users', count: users.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } transition-colors`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'ukms' && renderUKMsTab()}
              {activeTab === 'users' && renderUsersTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Add UKM Modal */}
      <AddUKMModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onSubmit={handleAddUKM}
      />

      {/* Edit UKM Modal */}
      <EditUKMModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        categories={categories}
        ukm={selectedUKM}
        onSubmit={handleEditUKM}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleUpdateUser}
      />
    </RoleBasedComponent>
  );
};

export default AdminPanel;
