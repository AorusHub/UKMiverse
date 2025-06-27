import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import RoleBasedComponent from '../components/RoleBasedComponent';

const RoleBasedTest = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  console.log('🔥 RoleBasedTest: Component is rendering');
  console.log('🔥 Loading:', loading);
  console.log('🔥 isAuthenticated:', isAuthenticated);
  console.log('🔥 User:', user);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">RoleBasedComponent Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <p className="mb-2">Loading: {loading ? 'true' : 'false'}</p>
          <p className="mb-2">Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
          {user && (
            <div>
              <p className="mb-2">Username: {user.username}</p>
              <p className="mb-2">Role: {user.role || 'undefined'}</p>
              <p className="mb-2">Role ID: {user.role_id || 'undefined'}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">RoleBasedComponent Tests</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Test 1: requireAuth=true, no roles</h3>
              <RoleBasedComponent requireAuth={true} fallback={<div className="bg-red-100 p-2 rounded">❌ Not authenticated</div>}>
                <div className="bg-green-100 p-2 rounded">✅ User is authenticated</div>
              </RoleBasedComponent>
            </div>

            <div>
              <h3 className="font-medium mb-2">Test 2: allowedRoles=['admin']</h3>
              <RoleBasedComponent allowedRoles={['admin']} fallback={<div className="bg-red-100 p-2 rounded">❌ Not admin (string)</div>}>
                <div className="bg-green-100 p-2 rounded">✅ Admin role detected (string)</div>
              </RoleBasedComponent>
            </div>

            <div>
              <h3 className="font-medium mb-2">Test 3: allowedRoles=[1]</h3>
              <RoleBasedComponent allowedRoles={[1]} fallback={<div className="bg-red-100 p-2 rounded">❌ Not admin (numeric)</div>}>
                <div className="bg-green-100 p-2 rounded">✅ Admin role detected (numeric)</div>
              </RoleBasedComponent>
            </div>

            <div>
              <h3 className="font-medium mb-2">Test 4: allowedRoles=['admin', 1]</h3>
              <RoleBasedComponent allowedRoles={['admin', 1]} fallback={<div className="bg-red-100 p-2 rounded">❌ Not admin (mixed)</div>}>
                <div className="bg-green-100 p-2 rounded">✅ Admin role detected (mixed)</div>
              </RoleBasedComponent>
            </div>

            <div>
              <h3 className="font-medium mb-2">Test 5: No authentication required</h3>
              <RoleBasedComponent requireAuth={false}>
                <div className="bg-blue-100 p-2 rounded">ℹ️ This should always show</div>
              </RoleBasedComponent>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manual Role Check</h2>
          {user && (user.role === 'admin' || user.role_id === 1) ? (
            <div className="bg-green-100 p-4 rounded border-l-4 border-green-500">
              <h3 className="font-bold text-green-800">✅ Manual Admin Check Passed!</h3>
              <p className="text-green-700">User role: {user.role}, User role_id: {user.role_id}</p>
            </div>
          ) : (
            <div className="bg-yellow-100 p-4 rounded border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-800">⚠️ Manual Admin Check Failed</h3>
              <p className="text-yellow-700">User role: {user?.role || 'N/A'}, User role_id: {user?.role_id || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedTest;
