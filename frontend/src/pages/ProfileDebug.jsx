import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const ProfileDebug = () => {
  const authContext = useContext(AuthContext);
  
  console.log('ProfileDebug - AuthContext:', authContext);
  
  if (!authContext) {
    return <div>AuthContext not available</div>;
  }

  const { user, token, loading, isAuthenticated } = authContext;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Auth State</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
            <p><strong>Has Token:</strong> {token ? 'true' : 'false'}</p>
            <p><strong>Token Length:</strong> {token ? token.length : 'N/A'}</p>
            <p><strong>Has User:</strong> {user ? 'true' : 'false'}</p>
            {user && (
              <div className="ml-4">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role ? JSON.stringify(user.role) : 'None'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Local Storage</h2>
          <div className="space-y-2">
            <p><strong>LS Token:</strong> {localStorage.getItem('token') ? 'exists' : 'not found'}</p>
            <p><strong>LS User:</strong> {localStorage.getItem('user') ? 'exists' : 'not found'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Profile Fetch</h2>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/profile/', {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                console.log('Profile fetch response:', response.status);
                if (response.ok) {
                  const data = await response.json();
                  console.log('Profile data:', data);
                  alert('Profile fetch successful! Check console for data.');
                } else {
                  const errorText = await response.text();
                  console.error('Profile fetch error:', errorText);
                  alert(`Profile fetch failed: ${response.status}`);
                }
              } catch (error) {
                console.error('Profile fetch error:', error);
                alert(`Profile fetch error: ${error.message}`);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!token}
          >
            Test Profile Fetch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDebug;
