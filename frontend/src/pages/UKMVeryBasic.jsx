import React from 'react';

const UKMVeryBasic = () => {
  console.log('🔥 UKMVeryBasic: Component starting to render');

  try {
    console.log('🔥 UKMVeryBasic: Inside try block');
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          color: '#333', 
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          🔥 UKM Very Basic Test
        </h1>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>✅ Basic React Component Working</h2>
          <p style={{ color: '#666', marginBottom: '10px' }}>If you can see this, React is working properly.</p>
          <p style={{ color: '#666', marginBottom: '10px' }}>Check browser console for any JavaScript errors.</p>
          
          <div style={{ 
            backgroundColor: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '4px',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#1976d2', marginBottom: '10px' }}>Next Steps:</h3>
            <ul style={{ color: '#424242', marginLeft: '20px' }}>
              <li>Open browser Developer Tools (F12)</li>
              <li>Check Console tab for any red errors</li>
              <li>Try refreshing the page</li>
              <li>Test different URLs:</li>
              <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                <li><a href="/daftar-ukm-minimal">Minimal Test</a></li>
                <li><a href="/role-test">Role Test</a></li>
                <li><a href="/daftar-ukm-original">Original UKM</a></li>
              </ul>
            </ul>
          </div>
          
          <button 
            onClick={() => {
              console.log('🔥 Button clicked!');
              alert('Button works! Check console for logs.');
            }}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Test Button (Check Console)
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('🔥 UKMVeryBasic: Error in component:', error);
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#ffebee', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ color: '#d32f2f', textAlign: 'center' }}>❌ Component Error</h1>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <pre style={{ color: '#d32f2f', whiteSpace: 'pre-wrap' }}>
            {error.toString()}
          </pre>
        </div>
      </div>
    );
  }
};

export default UKMVeryBasic;
