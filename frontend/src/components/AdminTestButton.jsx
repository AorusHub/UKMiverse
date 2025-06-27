import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AdminTestButton = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  
  // Test both methods
  const method1 = user?.role_id === 1;
  const method2 = user?.role?.id === 1;
  const method3 = (user?.role_id || user?.role?.id) === 1;
  
  console.log('🧪 ADMIN TEST:');
  console.log('   method1 (user.role_id === 1):', method1);
  console.log('   method2 (user.role.id === 1):', method2);
  console.log('   method3 (fallback):', method3);
  console.log('   isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    return <div className="p-4 bg-red-100 text-red-800">Not authenticated</div>;
  }
  
  return (
    <div className="p-4 bg-blue-100 text-blue-800 space-y-2">
      <h3 className="font-bold">Admin Test Results:</h3>
      <p>Method 1 (user.role_id === 1): <strong>{method1 ? 'TRUE' : 'FALSE'}</strong></p>
      <p>Method 2 (user.role.id === 1): <strong>{method2 ? 'TRUE' : 'FALSE'}</strong></p>
      <p>Method 3 (fallback): <strong>{method3 ? 'TRUE' : 'FALSE'}</strong></p>
      
      {method3 && (
        <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
          ✅ ADMIN BUTTON SHOULD WORK!
        </button>
      )}
    </div>
  );
};

export default AdminTestButton;
