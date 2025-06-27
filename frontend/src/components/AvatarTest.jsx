import React, { useState } from 'react';

// Simple Avatar Test Component
const AvatarTest = () => {
  const [testUrl, setTestUrl] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const testUrls = [
    'https://via.placeholder.com/150/FF0000/FFFFFF?text=Test1',
    'https://via.placeholder.com/150/00FF00/FFFFFF?text=Test2',
    'https://via.placeholder.com/150/0000FF/FFFFFF?text=Test3',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9NhxKvgAAAABJRU5ErkJggg=='
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Avatar Display Test</h2>
      
      {/* Current Avatar Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Avatar:</h3>
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-200 mx-auto">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Test Avatar"
              className="w-full h-full object-cover rounded-full"
              onLoad={() => console.log('✅ Test avatar loaded:', currentAvatar)}
              onError={(e) => {
                console.error('❌ Test avatar failed:', currentAvatar);
                e.target.style.border = '2px solid red';
              }}
            />
          ) : (
            <div className="text-purple-600 text-center">
              <div className="text-2xl">👤</div>
              <div className="text-xs">No Avatar</div>
            </div>
          )}
        </div>
      </div>

      {/* Test URL Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Test URL:</label>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter image URL..."
        />
        <button
          onClick={() => setCurrentAvatar(testUrl)}
          className="mt-2 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Test This URL
        </button>
      </div>

      {/* Quick Test Buttons */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Quick Tests:</h4>
        <div className="grid grid-cols-2 gap-2">
          {testUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentAvatar(url)}
              className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs hover:bg-gray-300"
            >
              Test {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={() => setCurrentAvatar(null)}
        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Clear Avatar
      </button>

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
        <strong>Debug Info:</strong><br/>
        Current Avatar: {currentAvatar || 'null'}<br/>
        Type: {currentAvatar ? (currentAvatar.startsWith('data:') ? 'Base64' : 'URL') : 'None'}<br/>
        Length: {currentAvatar ? currentAvatar.length : 0}
      </div>
    </div>
  );
};

export default AvatarTest;
