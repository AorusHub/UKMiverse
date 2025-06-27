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
  const [categories, setCategories] = useState([]);
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
    console.log('🔄 AdminPanel - Starting to load data...');
    console.log('🔍 AdminPanel - API Base URL:', API_BASE_URL);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ AdminPanel - No token found, user might not be logged in');
      setLoading(false);
      return;
    }
    
    let dataLoaded = false;
    
    try {
      // Test backend connection first
      console.log('� AdminPanel - Testing backend connection...');
      const testResponse = await fetch(`${API_BASE_URL}/ukm/`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('� AdminPanel - Backend test response:', testResponse.status, testResponse.statusText);
      
      if (!testResponse.ok) {
        throw new Error(`Backend connection failed: ${testResponse.status} ${testResponse.statusText}`);
      }
      
      // Fetch UKMs from database
      console.log('📡 AdminPanel - Fetching UKMs from database...');
      const ukmsData = await testResponse.json();
      console.log('✅ AdminPanel - UKMs loaded from database:', ukmsData);
      console.log('📊 AdminPanel - UKMs count from database:', ukmsData.length);
      
      // Detailed UKM data analysis
      if (Array.isArray(ukmsData)) {
        console.log('🔍 AdminPanel - Analyzing UKM data structure:');
        ukmsData.forEach((ukm, index) => {
          console.log(`  UKM ${index + 1}:`, {
            id: ukm.id,
            nama: ukm.nama,
            name: ukm.name,
            category_id: ukm.category_id,
            category_id_type: typeof ukm.category_id,
            has_category_id: 'category_id' in ukm,
            all_fields: Object.keys(ukm)
          });
        });
      }
      
      if (Array.isArray(ukmsData) && ukmsData.length > 0) {
        setUkms(ukmsData);
        dataLoaded = true;
        console.log('✅ AdminPanel - UKMs set successfully');
      } else {
        console.log('⚠️ AdminPanel - UKMs array is empty or invalid');
      }

      // Fetch categories from database
      console.log('📡 AdminPanel - Fetching Categories from database...');
      const categoriesResponse = await fetch(`${API_BASE_URL}/ukm/categories`);
      console.log('📡 AdminPanel - Categories response status:', categoriesResponse.status);
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log('✅ AdminPanel - Categories loaded from database:', categoriesData);
        console.log('📊 AdminPanel - Categories count from database:', categoriesData.length);
        
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setCategories(categoriesData);
          console.log('✅ AdminPanel - Categories set successfully');
          console.log('📋 AdminPanel - Categories data:', categoriesData);
        } else {
          console.log('⚠️ AdminPanel - Categories array is empty, using fallback categories');
          setCategories([
            { id: 1, name: 'Unit Kegiatan Olahraga' },
            { id: 2, name: 'Unit Kegiatan Kesenian' },
            { id: 3, name: 'Unit Kegiatan Khusus' }
          ]);
        }
      } else {
        console.error('❌ AdminPanel - Categories fetch failed:', categoriesResponse.status, categoriesResponse.statusText);
        console.log('🔄 AdminPanel - Using fallback categories due to fetch failure');
        setCategories([
          { id: 1, name: 'Unit Kegiatan Olahraga' },
          { id: 2, name: 'Unit Kegiatan Kesenian' },
          { id: 3, name: 'Unit Kegiatan Khusus' }
        ]);
      }

      // Fetch users from database
      console.log('📡 AdminPanel - Fetching Users from database...');
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const usersResponse = await fetch(`${API_BASE_URL}/auth/users`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('📡 AdminPanel - Users response status:', usersResponse.status);
          
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('✅ AdminPanel - Users loaded from database:', usersData);
            console.log('� AdminPanel - Users count from database:', usersData.length);
            
            if (Array.isArray(usersData) && usersData.length > 0) {
              setUsers(usersData);
              console.log('✅ AdminPanel - Users set successfully from database');
            } else {
              console.log('⚠️ AdminPanel - Users array from database is empty, using fallback');
              setUsers([
                { id: 1, username: 'admin (no DB users)', email: 'admin@unhas.ac.id', role: { name: 'admin' } },
                { id: 2, username: 'user1 (no DB users)', email: 'user1@unhas.ac.id', role: { name: 'user' } }
              ]);
            }
          } else if (usersResponse.status === 401) {
            console.error('❌ AdminPanel - Users fetch failed: Unauthorized (401) - Token might be invalid or expired');
            setUsers([
              { id: 1, username: 'admin (token expired)', email: 'admin@unhas.ac.id', role: { name: 'admin' } },
              { id: 2, username: 'user1 (token expired)', email: 'user1@unhas.ac.id', role: { name: 'user' } }
            ]);
          } else {
            console.error('❌ AdminPanel - Users fetch failed:', usersResponse.status, usersResponse.statusText);
            setUsers([
              { id: 1, username: 'admin (API failed)', email: 'admin@unhas.ac.id', role: { name: 'admin' } },
              { id: 2, username: 'user1 (API failed)', email: 'user1@unhas.ac.id', role: { name: 'user' } }
            ]);
          }
        } else {
          console.log('⚠️ AdminPanel - No auth token found, using fallback users');
          setUsers([
            { id: 1, username: 'admin (no token)', email: 'admin@unhas.ac.id', role: { name: 'admin' } },
            { id: 2, username: 'user1 (no token)', email: 'user1@unhas.ac.id', role: { name: 'user' } }
          ]);
        }
      } catch (error) {
        console.error('❌ AdminPanel - Error fetching users:', error);
        setUsers([
          { id: 1, username: 'admin (error)', email: 'admin@unhas.ac.id', role: { name: 'admin' } },
          { id: 2, username: 'user1 (error)', email: 'user1@unhas.ac.id', role: { name: 'user' } }
        ]);
      }
      
      if (dataLoaded) {
        console.log('🎉 AdminPanel - Data loaded successfully from database!');
      }
      
    } catch (error) {
      console.error('❌ AdminPanel - Error loading data from backend:', error);
      console.log('🔄 AdminPanel - Backend connection failed, using fallback data...');
      
      // Only use fallback if we couldn't connect to backend
      setUkms([
        {
          id: 1,
          nama: 'UKM Badminton (Fallback)',
          deskripsi: 'Unit Kegiatan Mahasiswa Badminton untuk mengembangkan kemampuan olahraga dan sportivitas.',
          category_id: 1,
          prestasi: 'Juara 1 Olimpiade Badminton 2023',
          kegiatan_rutin: 'Latihan setiap Selasa dan Kamis'
        },
        {
          id: 2,
          nama: 'UKM Musik (Fallback)',
          deskripsi: 'Unit Kegiatan Mahasiswa Musik untuk mengembangkan bakat dan kreativitas di bidang musik.',
          category_id: 2,
          prestasi: 'Best Performance Festival Musik 2023',
          kegiatan_rutin: 'Latihan band setiap Rabu'
        },
        {
          id: 3,
          nama: 'UKM Bahasa (Fallback)',
          deskripsi: 'Unit Kegiatan Mahasiswa Bahasa untuk mengembangkan kemampuan komunikasi dan linguistik.',
          category_id: 3,
          prestasi: 'Juara 2 Debat Bahasa Indonesia',
          kegiatan_rutin: 'Diskusi sastra setiap Jumat'
        },
        {
          id: 4,
          nama: 'UKM Fotografi (Fallback)',
          deskripsi: 'Unit Kegiatan Mahasiswa Fotografi untuk mengasah kemampuan dan teknik fotografi.',
          category_id: 3,
          prestasi: 'Pameran foto terbaik 2023',
          kegiatan_rutin: 'Workshop foto setiap Sabtu'
        },
        {
          id: 5,
          nama: 'UKM Futsal (Fallback)',
          deskripsi: 'Unit Kegiatan Mahasiswa Futsal untuk mengembangkan kemampuan bermain futsal.',
          category_id: 1,
          prestasi: 'Juara Liga Futsal Universitas 2023',
          kegiatan_rutin: 'Latihan setiap Senin dan Kamis'
        }
      ]);
      
      setCategories([
        { id: 1, name: 'Unit Kegiatan Olahraga' },
        { id: 2, name: 'Unit Kegiatan Kesenian' },
        { id: 3, name: 'Unit Kegiatan Khusus' }
      ]);
      
      setUsers([
        { id: 1, username: 'admin (backend offline)', email: 'admin@unhas.ac.id', role: { name: 'admin' } },
        { id: 2, username: 'user1 (backend offline)', email: 'user1@unhas.ac.id', role: { name: 'user' } }
      ]);
      
      console.log('⚠️ AdminPanel - Using fallback data due to backend connection failure');
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
                  // Find category name from categories array with type safety
                  let categoryName = 'Tidak ada kategori';
                  
                  // Debug logging untuk troubleshoot
                  console.log(`🔍 UKM: ${ukm.nama || ukm.name}`);
                  console.log(`  original category_id: ${ukm.category_id} (type: ${typeof ukm.category_id})`);
                  console.log(`  categories available:`, categories.map(c => `${c.id}(${typeof c.id}): ${c.name}`));
                  
                  if (ukm.category_id !== undefined && ukm.category_id !== null) {
                    const ukmCategoryId = parseInt(ukm.category_id);
                    if (!isNaN(ukmCategoryId)) {
                      const category = categories.find(cat => parseInt(cat.id) === ukmCategoryId);
                      if (category) {
                        categoryName = category.name;
                        console.log(`  ✅ matched category: ${category.name}`);
                      } else {
                        categoryName = `Kategori tidak ditemukan (ID: ${ukmCategoryId})`;
                        console.log(`  ❌ no matching category for ID: ${ukmCategoryId}`);
                      }
                    } else {
                      categoryName = `Invalid category ID: ${ukm.category_id}`;
                      console.log(`  ❌ invalid category_id: ${ukm.category_id}`);
                    }
                  } else {
                    console.log(`  ❌ category_id is undefined or null`);
                  }
                  
                  console.log(`  result: ${categoryName}`);
                  
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
