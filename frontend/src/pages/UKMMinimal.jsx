import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const UKMMinimal = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  console.log('🔥 UKMMinimal: Component is rendering');
  console.log('🔥 Loading:', loading);
  console.log('🔥 isAuthenticated:', isAuthenticated);
  console.log('🔥 User:', user);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">UKM Minimal Test</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <p className="mb-2">Loading: {loading ? 'true' : 'false'}</p>
        <p className="mb-2">Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
        {user ? (
          <div>
            <p className="mb-2">Username: {user.username}</p>
            <p className="mb-2">Role: {user.role || 'undefined'}</p>
            <p className="mb-2">Role ID: {user.role_id || 'undefined'}</p>
            <p className="mb-2">ID: {user.id}</p>
          </div>
        ) : (
          <p>No user data</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Simple Admin Check</h2>
        {user && (user.role === 'admin' || user.role_id === 1) ? (
          <div className="bg-green-100 p-4 rounded border-l-4 border-green-500">
            <h3 className="font-bold text-green-800">✅ Admin Access Detected!</h3>
            <p className="text-green-700">You should see admin controls on the main page.</p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Test Admin Button
            </button>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-800">⚠️ No Admin Access</h3>
            <p className="text-yellow-700">You need admin privileges to see admin controls.</p>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
        <div className="space-y-2">
          <a href="/daftar-ukm" className="block text-blue-600 hover:underline">→ Main UKM Page (Original)</a>
          <a href="/daftar-ukm-simple" className="block text-blue-600 hover:underline">→ Simple UKM Page</a>
          <a href="/daftar-ukm-fixed" className="block text-blue-600 hover:underline">→ Fixed UKM Page</a>
          <a href="/ukm-debug" className="block text-blue-600 hover:underline">→ Debug UKM Page</a>
        </div>
      </div>
    </div>
  );
};

export default UKMMinimal;
