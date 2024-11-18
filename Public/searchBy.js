






async function searchDate() {
    const startdate = document.getElementById('start-date').value;
    const enddate = document.getElementById('end-date').value;
    const errorMessage = document.getElementById('error-message');
    const resultsTable = document.getElementById('resultsTable');
    const tbody = resultsTable.querySelector('tbody');

    tbody.innerHTML = '';
    errorMessage.textContent = '';
    resultsTable.style.display = 'none';

    if (!startdate || !enddate) {
        errorMessage.textContent = 'Please enter both start and end dates to search.';
        return;
    }

    try {
        const response = await fetch(`/search-date?startdate=${encodeURIComponent(startdate)}&enddate=${encodeURIComponent(enddate)}`);
        if (response.ok) {
            const truckDetailsList = await response.json();

            if (truckDetailsList.length > 0) {
                truckDetailsList.forEach(truckDetails => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${truckDetails.truck_no}</td>
                        <td>${truckDetails.time}</td>
                        <td>${truckDetails.date}</td>
                        <td>${truckDetails.weight}</td>
                        <td>${truckDetails.actual_weight}</td>
                        <td>${truckDetails.difference_weight}</td>
                        <td>${truckDetails.freight}</td>
                        <td>${truckDetails.diesel}</td>
                        <td>${truckDetails.advance}</td>
                        <td>${truckDetails.driver_name}</td>
                        <td>${truckDetails.destination_from}</td>
                        <td>${truckDetails.destination_to}</td>
                        <td>${truckDetails.do_number}</td>
                        <td>${truckDetails.vendor}</td>
                        <td>${truckDetails.truck_type}</td>
                        <td>${truckDetails.transaction_status}</td>
                        <td>${truckDetails.diesel_slip_number}</td>
                    `;
                    tbody.appendChild(row);
                });
                resultsTable.style.display = 'table';
            } else {
                errorMessage.textContent = 'No details found for the selected date range.';
            }
        } else {
            const message = await response.text();
            errorMessage.textContent = message;
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error searching for truck details';
    }
}

async function downloadExcels() {
    const startdate = document.getElementById('start-date').value;
    const enddate = document.getElementById('end-date').value;
    const errorMessage = document.getElementById('error-message');

    if (!startdate || !enddate) {
        errorMessage.textContent = 'Please select both start and end dates to download.';
        return;
    }

    try {
        const url = `/search-date/download?startdate=${encodeURIComponent(startdate)}&enddate=${encodeURIComponent(enddate)}`;
        const response = await fetch(url);
        if (response.ok) {
            const blob = await response.blob();
            const fileName = 'truck_details.xlsx';
            const a = document.createElement('a');
            const downloadUrl = window.URL.createObjectURL(blob);

            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            const message = await response.text();
            errorMessage.textContent = message;
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error downloading truck details';
    }
}

    async function searchTruck() {
    const truckNo = document.getElementById('truck_No').value;
    const errorMessage = document.getElementById('error-message');
    const resultsTable = document.getElementById('resultsTable');
    const tbody = resultsTable.querySelector('tbody');

    tbody.innerHTML = '';
    errorMessage.textContent = '';
    resultsTable.style.display = 'none';

    if (!truckNo) {
        errorMessage.textContent = 'Please enter a truck number to search.';
        return;
    }

    try {
        const response = await fetch(`/search-truck?truck_No=${encodeURIComponent(truckNo)}`);
        if (response.ok) {
            const truckDetailsList = await response.json();

            if (truckDetailsList.length > 0) {
                truckDetailsList.forEach(truckDetails => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><input type="checkbox" class="truck-checkbox" data-truckno="${truckDetails.truck_no}" data-primarykey="${truckDetails.id}"></td>
                        <td>${truckDetails.id}</td> <!-- Primary Key -->
                        <td>${truckDetails.truck_no}</td>
                        <td>${truckDetails.time}</td>
                        <td>${truckDetails.date}</td>
                        <td>${truckDetails.weight}</td>
                        <td>${truckDetails.actual_weight}</td>
                        <td>${truckDetails.difference_weight}</td>
                        <td>${truckDetails.freight}</td>
                        <td>${truckDetails.diesel}</td>
                        <td>${truckDetails.advance}</td>
                        <td>${truckDetails.driver_name}</td>
                        <td>${truckDetails.destination_from}</td>
                        <td>${truckDetails.destination_to}</td>
                        <td>${truckDetails.do_number}</td>
                        <td>${truckDetails.vendor}</td>
                        <td>${truckDetails.truck_type}</td>
                        <td>${truckDetails.transaction_status}</td>
                        <td>${truckDetails.diesel_slip_number}</td>
                        <td><i class="fas fa-pencil-alt" onclick="editTruck(this)" onclick="updateTruck(this)"style="cursor: pointer;"></i></td>
                       
                    `;
                    tbody.appendChild(row);
                });
                resultsTable.style.display = 'table';
            } else {
                errorMessage.textContent = 'No details found for this truck number.';
            }
        } else {
            const message = await response.text();
            errorMessage.textContent = message;
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error searching for truck details';
    }
}

async function searchTodayList() {
    const errorMessage = document.getElementById('error-message');
    const resultsTable = document.getElementById('resultsTable');
    const tbody = resultsTable.querySelector('tbody');

    tbody.innerHTML = '';
    errorMessage.textContent = '';
    resultsTable.style.display = 'none';

    try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const response = await fetch(`/search-truck/today?date=${today}`);
        if (response.ok) {
            const truckDetailsList = await response.json();

            if (truckDetailsList.length > 0) {
                truckDetailsList.forEach(truckDetails => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td><input type="checkbox" class="truck-checkbox" data-truckno="${truckDetails.truck_no}" data-primarykey="${truckDetails.id}"></td>
                    <td>${truckDetails.id}</td> <!-- Primary Key -->
                    <td>${truckDetails.truck_no}</td>
                        <td>${truckDetails.time}</td>
                        <td>${new Date(truckDetails.date).toLocaleDateString()}</td>
                        <td>${truckDetails.weight}</td>
                        <td>${truckDetails.actual_weight}</td>
                        <td>${truckDetails.difference_weight}</td>
                        <td>${truckDetails.freight}</td>
                        <td>${truckDetails.diesel}</td>
                        <td>${truckDetails.advance}</td>
                        <td>${truckDetails.driver_name}</td>
                        <td>${truckDetails.destination_from}</td>
                        <td>${truckDetails.destination_to}</td>
                        <td>${truckDetails.do_number}</td>
                        <td>${truckDetails.vendor}</td>
                        <td>${truckDetails.truck_type}</td>
                        <td>${truckDetails.transaction_status}</td>
                        <td>${truckDetails.diesel_slip_number}</td>
                        <td><i class="fas fa-pencil-alt" onclick="editTruck(this)" onclick="updateTruck(this)"style="cursor: pointer;"></i></td>
                       
                    `;
                    tbody.appendChild(row);
                });
                resultsTable.style.display = 'table';
            } else {
                errorMessage.textContent = 'No details found for today.';
            }
        } else {
            const message = await response.text();
            errorMessage.textContent = message;
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Error searching for truck details for today';
    }
}
function editTruck(pencilIcon) {
    const row = pencilIcon.closest('tr');
    const cells = row.querySelectorAll('td');
    const editCell = cells[cells.length - 1];

    // Check the transaction status (assuming it's index 15)
    const transactionStatus = cells[17].innerText.trim();
    if (transactionStatus === "Acknowledged + Billed") {
        // Disable the edit button if the status is "Acknowledged + Billed"
        const editButton = editCell.querySelector('.edit-button');
        if (editButton) {
            editButton.disabled = true; // Disable the button
            editButton.title = "This entry cannot be edited because the status is Acknowledged + Billed"; // Optional: add tooltip
        }
        return; // Exit the function
    }

    cells.forEach((cell, index) => {
        if (index === 0) return; // Skip the checkbox column
        if (index === 1 || index === 2) return; // Skip 'id' and 'truck_no'

        // Check if the current cell is for transaction status
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

    const saveButton = document.createElement('button');
    saveButton.innerHTML = '<i class="fas fa-save"></i>';
    saveButton.className = 'edit-button';
    saveButton.onclick = () => updateTruck(saveButton); // Update truck function

    editCell.innerHTML = ''; // Clear edit cell
    editCell.appendChild(saveButton); // Add save button
}




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


function updateRowWithTruckDetails(row, truckDetails) {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, index) => {
        if (index > 0 && index < cells.length - 1) {
            const fieldName = getFieldNameByIndex(index);
            if (fieldName && truckDetails[fieldName] !== undefined) {
                cell.innerHTML = truckDetails[fieldName]; // Update cell with the new value
            }
        }
    });

    // Restore edit icon
    const editIcon = document.createElement('i');
    editIcon.className = 'fas fa-pencil-alt';
    editIcon.onclick = () => editTruck(editIcon);
    const editCell = cells[cells.length - 1];
    editCell.innerHTML = ''; // Clear save button
    editCell.appendChild(editIcon); // Append edit icon back

    // Check if transaction status is "Acknowledged + Billed"
    const transactionStatus = truckDetails.transaction_status;
    if (transactionStatus === "Acknowledged + Billed") {
        editIcon.style.pointerEvents = 'none'; // Disable pointer events
        editIcon.style.color = 'gray'; // Change color to indicate it's not editable
        editCell.title = "This entry cannot be edited because the status is Acknowledged + Billed"; // Optional: add tooltip
    }
}


// Make sure you define the mapping function correctly
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
        // ... add any additional fields if necessary
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




function downloadExcel() {
    const truckNo = document.getElementById('truck_No').value;

    if (!truckNo) {
        alert('Please enter a truck number to download data.');
        return;
    }

    // Trigger the download of the Excel file
    const url = `/search-truck/download?truck_No=${encodeURIComponent(truckNo)}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'truck_details.xlsx';
    link.click();
}

function downloadTodayList() {
    // Trigger the download of today's list Excel file
    const url = `/search-truck/today/download`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'today_truck_list.xlsx';
    link.click();
}
