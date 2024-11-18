
// Function to fetch and display data
async function fetchData() {
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        const tableBody = document.querySelector('#resultsTable tbody');
        tableBody.innerHTML = ''; // Clear the table

        result.shipments.forEach(shipment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="row-id">${shipment.id}</td> <!-- Include ID in a dedicated cell -->
                <td>${shipment.from_destination}</td>
                <td>${shipment.to_destination}</td>
                <td>${shipment.rate}</td>
                <td><i class="fas fa-pencil-alt edit-icon" onclick="editRow(this)"></i></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


document.addEventListener('DOMContentLoaded', fetchData);

// Handle form submission
document.getElementById('shipmentForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this);
    const data = new URLSearchParams(formData).toString();

    // Validate 'rate' field to ensure it is numeric
    const rate = formData.get('rate'); // Assuming the name attribute for rate field is 'rate'
    if (isNaN(rate) || rate.trim() === '') {
        alert('Please enter a valid number for the rate.');
        return; // Stop the form submission
    }

    const messageContainer = document.getElementById('submitMessage');
    messageContainer.innerText = ''; // Clear previous messages

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data
        });

        const resultData = await response.json();

        if (!response.ok) {
            messageContainer.innerText = resultData.message;
            messageContainer.style.color = 'red';
            return;
        }

        messageContainer.innerText = resultData.message;
        messageContainer.style.color = 'green';
        this.reset();
        fetchData(); 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        messageContainer.innerText = 'An unexpected error occurred. Please try again.';
        messageContainer.style.color = 'red';
    }
});


// Function to edit a row (make it editable)
// Function to edit a row (make it editable)
function editRow(editIcon) {
    const row = editIcon.closest('tr');
    const cells = row.querySelectorAll('td');
    
    const id = cells[0].innerText.trim(); // Get the ID from the first cell

    // Loop through the cells to make them editable
    cells.forEach((cell, index) => {
        if (index === 0) return; // Skip the ID column (index 0)

        const originalValue = cell.innerText.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalValue;
        cell.innerHTML = ''; // Clear existing content
        cell.appendChild(input); // Add input field
    });

    // Add a Save button to the last cell (usually the edit cell)
    const editCell = cells[cells.length - 1];
    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    saveButton.className = 'save-button';
    saveButton.onclick = () => updateRow(row, id); // Call updateRow with the rowId

    editCell.innerHTML = ''; // Clear the edit cell
    editCell.appendChild(saveButton); // Add the save button
}

// Function to update the row (save changes to the server)
async function updateRow(row, id) {
    const cells = row.querySelectorAll('td');
    const updatedData = {};

    // Collect the updated values from input fields
    cells.forEach((cell, index) => {
        const input = cell.querySelector('input');
        if (input) {
            const value = input.value.trim();
            const fieldName = getFieldNameByIndex(index); // Get field name by index
            if (fieldName) {
                updatedData[fieldName] = value;
            }
        }
    });

    updatedData.id = id; // Add the ID to the updated data

    console.log('Updated Data:', updatedData); // Debugging: log the data sent to the server

    try {
        const response = await fetch('/update-row', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Correct content type
            },
            body: JSON.stringify(updatedData), // Send as JSON
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('Update failed:', result.message);
            alert('Failed to save updates.');
            return;
        }

        alert(result.message); // Show success message
        refreshRow(row, updatedData); // Refresh the UI with updated data
    } catch (error) {
        console.error('Error saving row:', error);
        alert('Failed to save updates.');
    }
}


// Function to refresh the row after successful update
function refreshRow(row, updatedData) {
    const cells = row.querySelectorAll('td');

    // Update each cell with the new values
    Object.keys(updatedData).forEach((field, index) => {
        const cell = cells[index];
        if (cell) {
            cell.innerText = updatedData[field];
        }
    });

    // Add the edit icon back to the last cell
    const editIcon = document.createElement('i');
    editIcon.className = 'fas fa-pencil-alt edit-icon';
    editIcon.onclick = () => editRow(editIcon); // Enable editing again
    const editCell = cells[cells.length - 1];
    editCell.innerHTML = '';
    editCell.appendChild(editIcon); // Add the edit icon back
}

// Mapping index to field names
function getFieldNameByIndex(index) {
    const fieldNames = [
        'id',
        'from_destination', // Column 0
        'to_destination', // Column 1
        'rate', // Column 2
        // Add more fields as needed
    ];

    return fieldNames[index] || null; // Return the field name based on index, or null if not found
}

