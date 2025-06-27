import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import UKM from '../pages/UKM';

const TestUKMPage = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold text-center py-4 bg-blue-100">
          UKM Page Test - Check Console for Errors
        </h1>
        <UKM />
      </div>
    </AuthProvider>
  );
};

export default TestUKMPage;
