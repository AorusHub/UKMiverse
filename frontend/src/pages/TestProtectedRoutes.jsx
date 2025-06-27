import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleBasedComponent from '../components/RoleBasedComponent';
import { AlertTriangle, Shield, User, Settings } from 'lucide-react';

const TestProtectedRoutes = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test Protected Routes & Components</h1>
          <p className="mt-2 text-gray-600">
            Halaman ini mendemonstrasikan berbagai komponen protected berdasarkan role dan autentikasi.
          </p>
        </div>

        {/* Authentication Status */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status Autentikasi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700">Status Login</h3>
              <p className={`mt-1 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated ? '✅ Sudah Login' : '❌ Belum Login'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700">User Info</h3>
              <p className="mt-1 text-gray-900">
                {user ? `${user.username} (${user.role})` : 'Tidak ada data user'}
              </p>
            </div>
          </div>
        </div>

        {/* Role-Based Components Tests */}
        <div className="grid gap-6">
          {/* Test 1: Admin Only */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Test 1: Komponen Admin Only
            </h3>
            <RoleBasedComponent 
              allowedRoles={['admin']}
              fallback={
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">❌ Konten ini hanya untuk Admin. Anda tidak memiliki akses.</p>
                </div>
              }
            >
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">✅ Selamat! Anda adalah Admin dan dapat melihat konten ini.</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 bg-red-600 text-white text-sm rounded">Delete Users</button>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Manage System</button>
                </div>
              </div>
            </RoleBasedComponent>
          </div>

          {/* Test 2: User Only */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Test 2: Komponen User Only
            </h3>
            <RoleBasedComponent 
              allowedRoles={['user']}
              fallback={
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700">⚠️ Konten ini hanya untuk User biasa. Anda bukan User atau belum login.</p>
                </div>
              }
            >
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700">✅ Anda adalah User dan dapat melihat konten khusus user ini.</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded">Join UKM</button>
                  <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded">View Events</button>
                </div>
              </div>
            </RoleBasedComponent>
          </div>

          {/* Test 3: Any Authenticated User */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-green-600" />
              Test 3: Komponen untuk User yang Sudah Login
            </h3>
            <RoleBasedComponent 
              requireAuth={true}
              fallback={
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-700">🔒 Silakan login terlebih dahulu untuk melihat konten ini.</p>
                  <button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg">Login Sekarang</button>
                </div>
              }
            >
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">🎉 Selamat datang! Anda sudah login dan dapat mengakses fitur ini.</p>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded">Edit Profile</button>
                  <button className="px-3 py-2 bg-purple-600 text-white text-sm rounded">My UKMs</button>
                  <button className="px-3 py-2 bg-indigo-600 text-white text-sm rounded">Settings</button>
                </div>
              </div>
            </RoleBasedComponent>
          </div>

          {/* Test 4: Multiple Roles */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Test 4: Komponen untuk Admin atau User
            </h3>
            <RoleBasedComponent 
              allowedRoles={['admin', 'user']}
              fallback={
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">❌ Anda tidak memiliki role yang diizinkan atau belum login.</p>
                </div>
              }
            >
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-indigo-700">✅ Anda memiliki akses karena role Anda diizinkan.</p>
                <div className="mt-2 text-sm text-indigo-600">
                  Role Anda: <span className="font-semibold">{user?.role}</span>
                </div>
              </div>
            </RoleBasedComponent>
          </div>

          {/* Test 5: Nested Role Components */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Test 5: Nested Role Components</h3>
            <RoleBasedComponent requireAuth={true}>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                <p className="text-blue-700">Konten untuk semua user yang sudah login:</p>
                
                <RoleBasedComponent allowedRoles={['admin']}>
                  <div className="p-3 bg-red-100 border border-red-300 rounded">
                    <p className="text-red-700 text-sm">🔥 Extra: Panel admin khusus di dalam konten user</p>
                  </div>
                </RoleBasedComponent>
                
                <RoleBasedComponent allowedRoles={['user']}>
                  <div className="p-3 bg-green-100 border border-green-300 rounded">
                    <p className="text-green-700 text-sm">👤 Extra: Fitur khusus user di dalam konten user</p>
                  </div>
                </RoleBasedComponent>
              </div>
            </RoleBasedComponent>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">Instruksi Testing:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Coba login sebagai admin untuk melihat semua komponen</li>
            <li>• Coba login sebagai user untuk melihat perbedaan akses</li>
            <li>• Coba logout untuk melihat fallback content</li>
            <li>• Perhatikan bagaimana setiap komponen bereaksi terhadap status autentikasi dan role</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestProtectedRoutes;
