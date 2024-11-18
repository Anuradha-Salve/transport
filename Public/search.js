document.addEventListener("DOMContentLoaded", function() {
    function updateCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        document.getElementById('current-time').value = timeString;
    }

    function populateDropdowns() {
        // Fetch 'from' destinations
        fetch('http://localhost:4000/api/destinations')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const destinationFromSelect = document.getElementById('from_destination');

                // Clear existing options
                destinationFromSelect.innerHTML = '<option value="">Select Destination From</option>';

                // Populate dropdown
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.from_destination;
                    option.textContent = item.from_destination;
                    destinationFromSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching from destinations:', error));

        // Fetch 'to' destinations
        fetch('http://localhost:4000/api/to-destinations')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const destinationToSelect = document.getElementById('destination_to');

                // Clear existing options
                destinationToSelect.innerHTML = '<option value="">Select Destination To</option>';

                // Populate dropdown
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.to_destination;
                    option.textContent = item.to_destination;
                    destinationToSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching to destinations:', error));
    }

    function calculateFreight() {
        const weight = parseFloat(document.getElementById('weight').value);
        const fromDestination = document.getElementById('from_destination').value;
        const toDestination = document.getElementById('destination_to').value;

        if (weight && fromDestination && toDestination) {
            // Fetch rate
            fetch(`http://localhost:4000/api/rate?from=${fromDestination}&to=${toDestination}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const rate = parseFloat(data.rate);
                    if (!isNaN(rate)) {
                        const freight = weight * rate;
                        document.getElementById('freight').value = freight.toFixed(2); // Set freight with two decimal places
                    } else {
                        console.error('Invalid rate');
                        document.getElementById('freight').value = '';
                    }
                })
                .catch(error => {
                    console.error('Error fetching rate:', error);
                    document.getElementById('freight').value = '';
                });
        }
    }

    document.getElementById('weight').addEventListener('input', calculateFreight);
    document.getElementById('from_destination').addEventListener('change', calculateFreight);
    document.getElementById('destination_to').addEventListener('change', calculateFreight);

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    populateDropdowns();
});

//for get vendor dropdown
document.addEventListener('DOMContentLoaded', () => {
    fetch('/get-vendors')
        .then(response => response.json())
        .then(vendors => {
            const vendorSelect = document.getElementById('companyName');
            vendors.forEach(vendor => {
                const option = document.createElement('option');
                option.value = vendor;
                option.textContent = vendor;
                vendorSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching vendor options:', error));
});

function logout() {
    sessionStorage.clear();  // or localStorage.clear();
    window.location.href = '/loginForm.html';  // Adjust the path as needed
}
function calculateDifference() {
    const actualWeight = parseFloat(document.getElementById('actualWeight').value) || 0;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const differenceWeight = actualWeight - weight;
    document.getElementById('differenceWeight').value = differenceWeight;
}

// Optional: To ensure the difference updates when the page loads
window.onload = calculateDifference;