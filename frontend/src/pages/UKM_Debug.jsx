import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import RoleBasedComponent from '../components/RoleBasedComponent';
import UserDebug from '../components/UserDebug';

const UKMDebug = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  console.log('🐛 UKMDebug: Rendering component');
  console.log('🐛 isAuthenticated:', isAuthenticated);
  console.log('🐛 user:', user);

  try {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">UKM Debug Page</h1>
        
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user, null, 2) : 'No user'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-2">Role-Based Component Test</h2>
          
          <div className="mb-4">
            <h3 className="font-medium">Admin Role Test (string 'admin'):</h3>
            <RoleBasedComponent allowedRoles={['admin']}>
              <div className="bg-green-100 p-2 rounded">✅ Admin role detected (string)</div>
            </RoleBasedComponent>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Admin Role Test (numeric 1):</h3>
            <RoleBasedComponent allowedRoles={[1]}>
              <div className="bg-green-100 p-2 rounded">✅ Admin role detected (numeric)</div>
            </RoleBasedComponent>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Mixed Admin Role Test:</h3>
            <RoleBasedComponent allowedRoles={['admin', 1]}>
              <div className="bg-green-100 p-2 rounded">✅ Admin role detected (mixed)</div>
            </RoleBasedComponent>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Require Auth Test:</h3>
            <RoleBasedComponent requireAuth={true} fallback={<div className="bg-red-100 p-2 rounded">❌ Not authenticated</div>}>
              <div className="bg-green-100 p-2 rounded">✅ User is authenticated</div>
            </RoleBasedComponent>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Basic UKM Content Test</h2>
          <p>This should always show regardless of role.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Test Button</button>
        </div>

        <UserDebug />
      </div>
    );
  } catch (error) {
    console.error('🐛 UKMDebug: Error in render:', error);
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">ERROR in UKM Debug Page</h1>
        <pre className="bg-white p-4 rounded text-sm">{error.toString()}</pre>
      </div>
    );
  }
};

export default UKMDebug;
