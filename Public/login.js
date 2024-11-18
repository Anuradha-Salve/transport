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



