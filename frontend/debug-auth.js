// Test auth token dari browser console
console.log('=== AUTH DEBUG ===');
console.log('Token from localStorage:', localStorage.getItem('token'));
console.log('User from localStorage:', localStorage.getItem('user'));

const token = localStorage.getItem('token');
if (token) {
    fetch('http://localhost:5000/api/auth/debug', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Debug response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Debug response data:', data);
    })
    .catch(error => {
        console.error('Debug request error:', error);
    });
} else {
    console.log('No token found in localStorage');
}
