async function fetchData() {
    try {
        const response = await fetch('/companydata');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();

        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = ''; // Clear the table

        result.company_master.forEach(company => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${company.company_name}</td>
                <td>${company.company_owner}</td>
                <td>${company.tds_rate}</td>
                <td>${company.gst}</td>
                <td>${company.pan}</td>
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
document.getElementById('companyform').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formData = new FormData(this);
    const data = new URLSearchParams(formData).toString();

    try {
        const response = await fetch('/submitCompany', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
         
        document.getElementById('companyName').value = '';
        document.getElementById('companyOwner').value = '';
        document.getElementById('tdsRate').value = '';
        document.getElementById('gst').value = '';
        document.getElementById('pan').value = '';

        // Refresh the data in the table after submission
        fetchData();

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});
document.getElementById('companyform').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const companyName = document.getElementById('companyName').value;
    const companyOwner = document.getElementById('companyOwner').value;
    const tdsRate = document.getElementById('tdsRate').value;
    const pan = document.getElementById('pan').value;
    const gst = document.getElementById('gst').value;

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyName,
                companyOwner,
                tdsRate,
                pan,
                gst,
            }),
        });

        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Submission failed');
        }

        // Redirect to results page
        const resultData = await response.json();
        window.location.href = `/results.html?status=success&message=${encodeURIComponent(resultData.message)}`;
    } catch (error) {
        // Redirect to error page with the error message
        window.location.href = `/results.html?status=error&message=${encodeURIComponent(error.message)}`;
    }
});
