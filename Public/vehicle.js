async function fetchData() {
    try {
        const response = await fetch('/vehicledata');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();

        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = ''; // Clear the table

        result.vehicle_master.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.truck_no}</td>
                <td>${vehicle.make}</td>
                <td>${vehicle.company_owner}</td>
                <td>${vehicle.freight}</td>
                
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Fetch data on page load
document.addEventListener('DOMContentLoaded', fetchData);

// Handle form submission
document.getElementById('vehicleform').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formData = new FormData(this);
    const data = new URLSearchParams(formData).toString();

    try {
        const response = await fetch('/submitVehicle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();

        // Clear form fields
        document.getElementById('truckNo').value = '';
        document.getElementById('make').value = '';
        document.getElementById('companyOwner').value = '';
        document.getElementById('freight').value = '';
        

        // Refresh the data in the table after submission
        fetchData();

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});