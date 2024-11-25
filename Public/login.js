document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from submitting the default way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            const redirectUrl = data.redirectUrl;

            // Store token in localStorage or sessionStorage
            localStorage.setItem('token', token);

            // Redirect to the appropriate page
            window.location.href = redirectUrl;
        } else {
            const errorText = await response.text();
            document.getElementById('error-message').textContent = errorText;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'Error logging in';
    }
});
document.getElementById('fetchData').addEventListener('click', async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
        alert('No token found. Please log in.');
        return;
    }

    try {
        const response = await fetch('/protected-route', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('data').textContent = JSON.stringify(data, null, 2);
        } else {
            const errorText = await response.text();
            document.getElementById('data').textContent = `Error: ${errorText}`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('data').textContent = 'Error fetching data';
    }
});



// Assuming the token is received from the backend after login
const login = async (username, password, profile) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, profile }),
      });
      const data = await response.json();
  
      if (data.status === 'success') {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        alert('Login successful');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    if (!token) {
      alert('Please log in first');
      return;
    }
  
    try {
      const response = await fetch('/protectedRoute', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      const data = await response.json();
      console.log('Protected data:', data);
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };
    // Assuming you have a form with a login button
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const profile = document.getElementById('profile').value;

    // Send the login request to the server
    const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
            profile: profile,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        // Login successful
        console.log('Login successful:', data);

        // Save the token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);

        // Redirect the user to the 'search.html' page
        window.location.href = 'search.html'; // Change this based on the user's profile if needed
    } else {
        // Login failed
        console.error('Login failed:', data.message);
        alert('Login failed. Please check your username, password, and profile.');
    }
});
if (response.ok) {
    // Login successful
    console.log('Login successful:', data);

    // Save the token in localStorage or sessionStorage
    localStorage.setItem('token', data.token);

    // Redirect based on the user's profile
    if (data.profile === 'admin') {
        window.location.href = 'search.html';
    } else if (data.profile === 'loadingManager') {
        window.location.href = 'loadingManager.html';
    } else if (data.profile === 'accountant') {
        window.location.href = 'accountantDashboard.html';
    } else {
        // Default redirect
        window.location.href = 'dashboard.html';
    }
}
