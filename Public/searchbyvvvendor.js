// Function to edit truck details
function editTruck(pencilIcon) {
    const row = pencilIcon.closest('tr');
    const cells = row.querySelectorAll('td');

    // Check the transaction status (assuming it's index 14)
    const transactionStatus = cells[17].innerText.trim();
    if (transactionStatus === "Acknowledged + Billed") {
        showError("This entry cannot be edited because the status is Acknowledged + Billed."); // Show error message
        return; // Exit the function
    }

    // Create input fields for editable cells
    cells.forEach((cell, index) => {
        if (index === 0) return; // Skip the checkbox column
        if (index === 1 || index === 2) return; // Skip 'id' and 'truck_no'

        // Handle transaction status as a dropdown
        if (index === 17) {
            const select = document.createElement('select');
            const option1 = document.createElement('option');
            option1.value = "Open";
            option1.textContent = "Open";

            const option2 = document.createElement('option');
            option2.value = "Acknowledge";
            option2.textContent = "Acknowledge";

            select.appendChild(option1);
            select.appendChild(option2);
            select.value = transactionStatus; // Set the selected value

            cell.innerHTML = ''; // Clear current cell content
            cell.appendChild(select); // Add the dropdown
        } else {
            const originalValue = cell.innerText;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = originalValue;
            cell.innerHTML = '';
            cell.appendChild(input);
        }
    });

    // Create save button
    const editCell = cells[cells.length - 1];
    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    saveButton.className = 'edit-button';
    saveButton.onclick = () => updateTruck(saveButton); // Update truck function

    editCell.innerHTML = ''; // Clear edit cell
    editCell.appendChild(saveButton); // Add save button
}

// Function to update truck details
async function updateTruck(saveIcon) {
    const row = saveIcon.closest('tr');
    const cells = row.querySelectorAll('td');
    const formData = new FormData();

    // Get the truck ID from the checkbox
    const truckId = row.querySelector('.truck-checkbox').getAttribute('data-primarykey');
    formData.append('Id', truckId);

    // Collect updated values from input fields
    cells.forEach((cell, index) => {
        const input = cell.querySelector('input') || cell.querySelector('select'); // Get either input or select
        if (input) {
            const value = input.value.trim();
            const fieldName = getFieldNameByIndex(index); // Ensure this maps correctly to your DB fields
            if (fieldName) {
                formData.append(fieldName, value); // Append the value from input or select
            }
        } else {
            // For non-editable fields, append their existing values
            const fieldName = getFieldNameByIndex(index);
            if (fieldName && (index === 1 || index === 2)) { // Assuming 'id' is index 1 and 'truck_no' is index 2
                const existingValue = cell.innerText.trim();
                formData.append(fieldName, existingValue);
            }
        }
    });

    console.log('FormData being sent:', Array.from(formData.entries())); // Debugging output

    try {
        const response = await fetch('/update-truck-details', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update truck details: ' + (await response.text()));
        }

        const updatedTruck = await response.json();
        console.log('Truck updated successfully:', updatedTruck);

        // Update the UI to reflect the updated truck details
        updateRowWithTruckDetails(row, updatedTruck);
    } catch (error) {
        console.error('Error updating truck details:', error);
    }
}



// Function to map index to field names
function getFieldNameByIndex(index) {
    const fieldNames = [
        null, // Skip the checkbox
        'id', // Primary Key
        'truck_no',
        'time',
        'date',
        'weight',
        'actual_weight',
        'difference_weight',
        'freight',
        'diesel',
        'advance',
        'driver_name',
        'destination_from',
        'destination_to',
        'do_number',
        'vendor',
        'truck_type',
        'transaction_status',
        'diesel_slip_number',
    ];
    return fieldNames[index];
}
async function generateExcel() {
    const selectedTrucks = Array.from(document.querySelectorAll('.truck-checkbox:checked'));
    if (selectedTrucks.length === 0) {
        alert('Please select at least one truck to generate an Excel file.');
        return;
    }

    console.log('Selected trucks for Excel generation:', selectedTrucks);

    const truckData = selectedTrucks.map(truckCheckbox => {
        const row = truckCheckbox.closest('tr');
        const cells = row.querySelectorAll('td');

        // Calculate total as weight + freight
        const weight = parseFloat(cells[5].innerText) || 0;
        const freight = parseFloat(cells[6].innerText) || 0;
        const actual_weight = parseFloat(cells[15].innerText) || 0; // Adjust index based on your table structure
        const difference_weight = parseFloat(cells[16].innerText) || 0; // Adjust index based on your table structure

        return {
            id: cells[1].innerText,
            truck_no: cells[2].innerText,
            time: cells[3].innerText,
            date: cells[4].innerText,
            weight: weight,
            freight: freight,
            diesel: cells[7].innerText,
            advance: cells[8].innerText,
            driver_name: cells[9].innerText,
            destination_from: cells[10].innerText,
            destination_to: cells[11].innerText,
            do_number: cells[12].innerText,
            vendor: cells[13].innerText,
            truck_type: cells[14].innerText,
            transaction_status: 'Acknowledged + Billed', // Update transaction status
            diesel_slip_number: cells[17].innerText, // Adjust index based on your table structure
            actual_weight: actualWeight, // Add actual weight
            difference_weight: differenceWeight, // Add difference weight
            total: weight + freight // Calculate total
        };
    });

    console.log('Prepared truck data for sending to server:', truckData);

    try {
        const response = await fetch('/generate-excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ truckData }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'truck-details.xlsx';
            document.body.appendChild(link);
            link.click();
            link.remove();
            console.log('Excel file download initiated.');
        } else {
            const errorText = await response.text();
            console.error('Failed to generate Excel file:', errorText);
            throw new Error('Failed to generate Excel file.');
        }
    } catch (error) {
        console.error('Error generating Excel:', error);
    }
}
async function searchDateWithVendor() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const vendor = document.getElementById('vendor').value.trim();
    const truckNo = document.getElementById('truckNo').value;

    // Clear previous results
    clearResults();

    // Check if at least one search criterion is provided
    if (!startDate && !endDate && !vendor && !truckNo) {
        showError("Please provide at least one search criterion (start date, end date, vendor, or truck number).");
        return;
    }

    try {
        const params = new URLSearchParams();
        if (startDate) params.append('startdate', startDate);
        if (endDate) params.append('enddate', endDate);
        if (vendor) params.append('vendor', vendor);
        if (truckNo) params.append('truckNo', truckNo);

        const response = await fetch(`/search-date-vendor?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        showError('Error fetching truck details. Please try again.');
    }
}

function clearResults() {
    const tableBody = document.querySelector("#resultsTable tbody");
    tableBody.innerHTML = ""; // Clear previous results
    document.getElementById('resultsTable').style.display = 'none';
    document.getElementById('error-message').innerText = ""; // Clear error messages
}

function displayResults(results) {
    const tableBody = document.querySelector("#resultsTable tbody");
    if (results.length === 0) {
        showError("No results found.");
        return;
    }
    results.forEach(result => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <input type="checkbox" class="truck-checkbox" data-truckno="${result.truck_no}" data-primarykey="${result.id}">
            </td>
            <td>${result.id}</td> <!-- Primary Key -->
            <td>${result.truck_no}</td>
            <td>${result.time}</td>
            <td>${new Date(result.date).toLocaleDateString()}</td> <!-- Format date -->
            <td>${result.weight}</td>
            <td>${result.actual_weight}</td>
            <td>${result.difference_weight}</td>
            <td>${result.freight}</td>
            <td>${result.diesel}</td>
            <td>${result.advance}</td>
            <td>${result.driver_name}</td>
            <td>${result.destination_from}</td>
            <td>${result.destination_to}</td>
            <td>${result.do_number}</td>
            <td>${result.vendor}</td>
            <td>${result.truck_type}</td>
            <td>${result.transaction_status}</td>
            <td>${result.diesel_slip_number}</td>
            <td>
                <i class="fas fa-pencil-alt" onclick="editTruck(this)" style="cursor: pointer;"></i>
            </td>
        `;
        tableBody.appendChild(row);
    });
    document.getElementById('resultsTable').style.display = 'table'; // Show results
}

function showError(message) {
    document.getElementById('error-message').innerText = message;
}