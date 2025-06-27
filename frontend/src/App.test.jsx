import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test component
const TestApp = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          🎉 UKMiverse Frontend Test
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">✅ React Working</h2>
            <p className="text-gray-600">React components are rendering correctly.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">✅ Tailwind Working</h2>
            <p className="text-gray-600">Tailwind CSS styles are applied properly.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">✅ Vite Working</h2>
            <p className="text-gray-600">Vite dev server is running smoothly.</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Status: All Systems Go! 🚀</h3>
          <p className="text-green-700">
            Frontend environment is working correctly. You can now proceed with adding components.
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestApp />} />
      </Routes>
    </Router>
  );
}

export default App;
