export default function authenticateUser(username, password) {
    console.log('Authenticating user:', { username, password });
    const body = JSON.stringify({ username, password });
    return fetch('/api/auth/student/data', {
        method: 'POST',
        headers: {  'Content-Type': 'application/json' },
        body: body
    })  .then(response => { if (!response.ok) { throw new Error('Network response was not ok'); } return response.json(); })
        .then(data => {
            if (data) {
                console.log("received data",data)
                return data; // Return the authentication token
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        }); // Return a promise
}   