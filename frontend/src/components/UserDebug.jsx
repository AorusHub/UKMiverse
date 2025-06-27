import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const UserDebug = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 left-4 bg-red-100 border border-red-300 rounded-lg p-4 max-w-sm">
        <h4 className="font-bold text-red-800">Debug: User Not Logged In</h4>
        <p className="text-red-600 text-sm">isAuthenticated: false</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-4 max-w-sm">
      <h4 className="font-bold text-blue-800">Debug: Current User Data</h4>
      <div className="text-sm text-blue-700 mt-2">
        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
        {user && (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Role:</strong> {user.role || 'undefined'}</p>
            <p><strong>Role ID:</strong> {user.role_id || 'undefined'}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              <strong>Full User Object:</strong>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDebug;
