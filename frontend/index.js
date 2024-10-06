window.onload = function() {
    document.querySelector('.login-container').style.display = 'block';
    document.querySelector('.main').style.display = 'none'; // Ensure main content is hidden initially
}


function authenticateUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Set your desired username and password
    const validUsername = "admin";
    const validPassword = "password123";

    // Simple check for username and password
    if (username === validUsername && password === validPassword) {
        // Redirect to a different page (e.g., "dashboard.html")
        window.location.href = 'index.html'; // Change this to your desired page
    } else {
        alert("Invalid username or password. Please try again.");
    }
}


// Function to show content based on clicked tab
function showContent(id) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.content-main > div');
    contentSections.forEach(section => {
        if (section.id === id) {
            section.classList.remove('hidden'); // Show the clicked section
        } else {
            section.classList.add('hidden'); // Hide other sections
        }
    });

}

function formatDateTime(dateTimeString) {
    // Create a Date object from the string
    const date = new Date(dateTimeString);
    
    // Extract date in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function calculateTotals() {
    // Get quantity and amount input values
    const suitQty = parseFloat(document.getElementById('suit_qty').value) || 0;
    const suitAmt = parseFloat(document.getElementById('suit_amount').value) || 0;

    const safariQty = parseFloat(document.getElementById('safari_qty').value) || 0;
    const safariAmt = parseFloat(document.getElementById('safari_amount').value) || 0;

    const pantQty = parseFloat(document.getElementById('pant_qty').value) || 0;
    const pantAmt = parseFloat(document.getElementById('pant_amount').value) || 0;

    const shirtQty = parseFloat(document.getElementById('shirt_qty').value) || 0;
    const shirtAmt = parseFloat(document.getElementById('shirt_amount').value) || 0;

    // Calculate total quantities and total amount
    const totalQty = suitQty + safariQty + pantQty + shirtQty;
    const totalAmt = suitAmt + safariAmt + pantAmt + shirtAmt;

    // Update the total quantity and amount in the respective fields
    document.getElementById('total_qty').value = totalQty;
    document.getElementById('total_amt').value = totalAmt.toFixed(2);
}



function toggleMeasurements() {
    console.log("toggleMeasurements function called");

    var pantSection = document.getElementById("pant-section");
    var shirtSection = document.getElementById("shirt-section");
    var extraSection = document.getElementById("extra-section");

    // Get all checkboxes for measurements selection
    var selectedValues = document.querySelectorAll('input[name="measurements-selection"]:checked');
    
    console.log("Selected values:", selectedValues); // Check selected values in the console

    // Hide all sections initially
    pantSection.classList.add("hidden");
    shirtSection.classList.add("hidden");
    extraSection.classList.add("hidden");

    // Show sections based on selected checkboxes
    selectedValues.forEach(selection => {
        console.log("Processing selection:", selection.value); // Check which values are being processed
        if (selection.value === "pant") {
            pantSection.classList.remove("hidden");
        } else if (selection.value === "shirt") {
            shirtSection.classList.remove("hidden");
        } else if (selection.value === "extra") {
            extraSection.classList.remove("hidden");
        }
    });
}


function getValueOrZero(id) {
    const value = document.getElementById(id).value;
    return value === '' ? 0 : parseFloat(value);
}

document.getElementById('new-bill-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    
    const customerName = document.getElementById("customer-name").value;
    const mobileNo = document.getElementById("mobile-number").value;
    const dateIssue = document.getElementById("date_issue").value;
    const deliveryDate = document.getElementById("delivery-date").value;
    const garmentType = document.getElementById("garment_type").value;
    const suitQty = getValueOrZero("suit_qty");
    const safariQty = getValueOrZero("safari_qty");
    const pantQty = getValueOrZero("pant_qty");
    const shirtQty = getValueOrZero("shirt_qty");
    const totalQty = getValueOrZero("total_qty");
    const todayDate = document.getElementById("today-date").value;
    const dueDate = document.getElementById("due-date").value;
    const totalAmt = getValueOrZero("total_amt");
    const paymentMode = document.getElementById("Payment").value;
    const paymentStatus = document.getElementById("payementstatus").value;

    // Pant measurements
    const pantLength = getValueOrZero("length");
    const pantKamar = getValueOrZero("kamar");
    const pantHips = getValueOrZero("hips");
    const pantWaist = getValueOrZero("waist");
    const pantGhutna = getValueOrZero("Ghutna");
    const pantBottom = getValueOrZero("Bottom");
    const pantSeat = getValueOrZero("seat");

    // Shirt measurements
    const shirtLength = getValueOrZero("shirtlength");
    const shirtBody = getValueOrZero("body");
    const shirtLoose = getValueOrZero("Loose");
    const shirtShoulder = getValueOrZero("Shoulder");
    const shirtAstin = getValueOrZero("Astin");
    const shirtCollar = getValueOrZero("collor");
    const shirtAloose = getValueOrZero("allose");

    // Extra measurements
    const extraMeasurements = document.getElementById("extra-input").value || null;

    const formData = {
        customerName,
        mobileNo,
        dateIssue,
        deliveryDate,
        garmentType,
        suitQty,
        safariQty,
        pantQty,
        shirtQty,
        totalQty,
        todayDate,
        dueDate,
        totalAmt,
        paymentMode,
        paymentStatus,
        pantLength,
        pantKamar,
        pantHips,
        pantWaist,
        pantGhutna,
        pantBottom,
        pantSeat,
        shirtLength,
        shirtBody,
        shirtLoose,
        shirtShoulder,
        shirtAstin,
        shirtCollar,
        shirtAloose,
        extraMeasurements
    };

    // Submit the form data to the backend
    fetch('http://127.0.0.1:5000/api/new-bill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(result => {
        console.log(formData);
        alert('Bill created successfully');
        saveAndPrint(); // Print after successful form submission
    })
    .catch(error => {
        console.error('Error creating bill:', error);
        alert('An error occurred while creating the bill.');
    });
});




// function saveAndPrint() {
//     const div1 = document.getElementById('printablearea').cloneNode(true);
//     const div2 = document.getElementById('customerbill').cloneNode(true);

//     const printWindow = window.open('', '', 'width=800,height=600');

//     printWindow.document.write('<html><head><title>Print Bill</title>');
//     printWindow.document.write('<style>@media print { .page-break { page-break-before: always; } }</style>');
//     printWindow.document.write('</head><body>');

//     printWindow.document.write('<h1>New Bill Form</h1>');

//     // Create a temporary container and add the cloned elements
//     const tempContainer = printWindow.document.createElement('div');
//     tempContainer.appendChild(div1);

//     // Add the page break using a div with the class 'page-break'
//     const pageBreak = printWindow.document.createElement('div');
//     pageBreak.classList.add('page-break');
//     tempContainer.appendChild(pageBreak);

//     tempContainer.appendChild(div2);
//     printWindow.document.body.appendChild(tempContainer);

//     // printWindow.document.write('<h1>Customer Bill</h1>');
//     printWindow.document.write('</body></html>');
//     printWindow.document.close();

//     // Wait for all images in the new window to load before printing
//     const images = printWindow.document.images;
//     const totalImages = images.length;
//     let imagesLoaded = 0;

//     if (totalImages === 0) {
//         // If there are no images, proceed to print immediately
//         printWindow.focus();
//         printWindow.print();
//         printWindow.close();
//     } else {
//         // Wait for all images to load
//         for (let i = 0; i < totalImages; i++) {
//             images[i].onload = () => {
//                 imagesLoaded++;
//                 if (imagesLoaded === totalImages) {
//                     // All images are loaded, proceed to print
//                     printWindow.focus();
//                     printWindow.print();
//                     printWindow.close();
//                 }
//             };

//             // In case the image fails to load, handle the error and continue
//             images[i].onerror = () => {
//                 imagesLoaded++;
//                 if (imagesLoaded === totalImages) {
//                     // Even with errors, proceed to print after all load attempts
//                     printWindow.focus();
//                     printWindow.print();
//                     printWindow.close();
//                 }
//             };
//         }
//     }
// }








function saveAndPrint() {
    const div1 = document.getElementById('printablearea').cloneNode(true);
    const div2 = document.getElementById('customerbill').cloneNode(true);

    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write('<html><head><title>Print Bill</title>');
    
    // Include your external CSS file
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="/frontend/styles.css"">'); // Update with your CSS file path

    printWindow.document.write(`
        <style>
            @media print {
                body { font-family: Arial, sans-serif; }
                .page-break { page-break-before: always; }
                #customerbill { page-break-inside: avoid; } /* Prevent breaks inside the customer bill */
                /* Add any other specific print styles here */
            }
        </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>New Bill Form</h1>');

    // Create a temporary container and add the cloned elements
    const tempContainer = printWindow.document.createElement('div');
    tempContainer.appendChild(div1);

    // Add a page break
    const pageBreak = printWindow.document.createElement('div');
    pageBreak.classList.add('page-break');
    tempContainer.appendChild(pageBreak);

    tempContainer.appendChild(div2);
    printWindow.document.body.appendChild(tempContainer);

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Wait for all images in the new window to load before printing
    const images = printWindow.document.images;
    const totalImages = images.length;
    let imagesLoaded = 0;

    if (totalImages === 0) {
        // If there are no images, print immediately
        printAndClose();
    } else {
        // Wait for all images to load
        Array.from(images).forEach(image => {
            image.onload = handleImageLoad;
            image.onerror = handleImageLoad; // Handle error as load
        });
    }

    function handleImageLoad() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            printAndClose();
        }
    }

    function printAndClose() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}




async function fetchOrders() {
    try {
        // Fetch workers from /api/workers
        const workersResponse = await fetch('http://127.0.0.1:5000/api/workers');
        const workers = await workersResponse.json();

        // Create a worker lookup by ID for easy access
        const workerLookup = {};
        workers.forEach(worker => {
            workerLookup[worker.id] = worker.name;  // Map worker ID to worker name
        });

        // Fetch orders from /api/orders
        const ordersResponse = await fetch('http://127.0.0.1:5000/api/orders');
        const data = await ordersResponse.json();

        const ordersContainer = document.getElementById('order-overview');
        ordersContainer.innerHTML = ''; // Clear previous content

        if (data && Object.keys(data).length > 0) {
            for (const deliveryDate in data) {
                const dateHeader = document.createElement('h3');
                dateHeader.textContent = `Delivery Date: ${deliveryDate}`;
                ordersContainer.appendChild(dateHeader);

                const ordersForDate = Array.isArray(data[deliveryDate]) ? data[deliveryDate] : [];

                let table = `<table>
                    <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>ID</th>
                            <th>Garment Type</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Update Status</th>
                            <th>Order Date</th>
                            <th>Payment Mode</th>
                            <th>Payment Status</th>
                            <th>Update Payment Status</th>
                            <th>Payment Amount</th>
                            <th>Bill ID</th>
                            <th>Worker Assigned</th> 
                            <th>Worker Name</th> <!-- New column for worker name -->
                            <th>Assign</th>
                            <th>worker pay amt</th>
                        </tr>
                    </thead>
                    <tbody>`;

                ordersForDate.forEach((order, index) => {
                    const serialNumber = index + 1;
                    const workerDropdown = createWorkerDropdown(order.worker_id, workers, order.id); // Create worker dropdown

                    // Fetch the worker name based on the worker_id in the order
                    const workerName = workerLookup[order.worker_id] || 'Not Assigned';

                    table += `<tr>
                        <td>${serialNumber}</td>
                        <td>${order.id}</td>
                        <td>${order.garment_type}</td>
                        <td>${order.quantity}</td>
                        <td>${order.status}</td>
                        <td>
                            <select onchange="updateOrderStatus(${order.id}, this.value)">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>${order.order_date}</td>
                        <td>${order.payment_mode}</td>
                        <td>${order.payment_status}</td>
                        <td>
                            <select onchange="updatePaymentStatus(${order.id}, this.value)">
                                <option value="Pending" ${order.payment_status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Paid" ${order.payment_status === 'Paid' ? 'selected' : ''}>Paid</option>
                                <option value="Cancelled" ${order.payment_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>${order.payment_amount}</td>
                        <td>${order.bill_id}</td>
                        <td>${order.worker_id}</td> <!-- Worker ID assigned -->
                        <td>${workerName}</td> <!-- Worker Name displayed -->
                        <td>${workerDropdown}</td> <!-- Add the worker dropdown here -->
                        <td>${order.Work_pay}</td>
                    </tr>`;
                });

                table += '</tbody></table>';
                ordersContainer.innerHTML += table;
            }
        } else {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = '<p>Error fetching orders.</p>';
    }
}

// Helper function to create worker dropdown
function createWorkerDropdown(selectedWorkerId, workers, orderId) {
    let dropdown = `<select onchange="assignWorker(${orderId}, this.value)">`;
    dropdown += `<option value="">Select a worker</option>`; // Default option

    workers.forEach(worker => {
        dropdown += `<option value="${worker.id}" ${worker.id === selectedWorkerId ? 'selected' : ''}>${worker.name}</option>`;
    });

    dropdown += '</select>';
    return dropdown;
}

// Function to assign worker to an order (this will send the updated worker ID to the backend)
function assignWorker(orderId, workerId) {
    fetch(`http://127.0.0.1:5000/api/orders/${orderId}/assign-worker`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ worker_id: workerId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Worker assigned successfully');
        } else {
            console.error('Failed to assign worker:', data.error);
        }
    })
    .catch(error => {
        console.error('Error assigning worker:', error);
    });
}





// Function to update order status
function updateOrderStatus(orderId, newStatus) {
    fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log('Order status update response:', result);
        alert('Order status updated successfully');
        // No need to reload the page, just show a success message
    })
    .catch(error => {
        console.error('Error updating order status:', error);
        alert('Error updating order status');
    });
}

// Function to update payment status
function updatePaymentStatus(orderId, newPaymentStatus) {
    fetch(`http://127.0.0.1:5000/api/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payment_status: newPaymentStatus })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        console.log('Payment status update response:', result);
        alert('Payment status updated successfully');
        // No need to reload the page, just show a success message
    })
    .catch(error => {
        console.error('Error updating payment status:', error);
        alert('Error updating payment status');
    });
}


// Automatically fetch and display workers when the page loads
document.addEventListener('DOMContentLoaded', function () {
    fetchWorkers();  // Fetch workers as soon as the DOM is fully loaded
});

// Show the 'Add Worker' form when the 'Add New Worker' button is clicked
document.getElementById('show-add-worker-form').addEventListener('click', function () {
    const form = document.getElementById('add-worker-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
});

// Show the 'Remove Worker' form when the 'Remove Worker' button is clicked
document.getElementById('show-remove-worker-form').addEventListener('click', function () {
    const form = document.getElementById('remove-worker-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
    populateWorkerDropdown(); // Populate the dropdown with worker list
});

document.getElementById('worker-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form input values
    const name = document.getElementById('worker-name').value;
    const number = document.getElementById('worker-number').value;
    const rate = document.getElementById('Rate').value;
    const suit = document.getElementById('Suit').value;
    const jacket = document.getElementById('Jacket').value;
    const sadri = document.getElementById('Sadri').value;
    const others = document.getElementById('Others').value;

    // Create an object with the worker data
    const newWorker = {
        name: name,
        number: number,
        Rate: rate ? parseFloat(rate) : null, // Convert to float or use null
        Suit: suit || null, // Use null if empty
        Jacket: jacket || null, // Use null if empty
        Sadri: sadri || null, // Use null if empty
        Others: others || null // Use null if empty
    };

    // Send a POST request to the backend
    fetch('http://127.0.0.1:5000/api/workers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([newWorker]) // Wrap newWorker in an array
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
        } else {
            console.log('Worker added:', data);
            // Clear the form fields
            document.getElementById('worker-name').value = '';
            document.getElementById('worker-number').value = '';
            document.getElementById('Rate').value = '';
            document.getElementById('Suit').value = '';
            document.getElementById('Jacket').value = '';
            document.getElementById('Sadri').value = '';
            document.getElementById('Others').value = '';

            // Hide the form after submission
            document.getElementById('add-worker-form').style.display = 'none';

            // Refresh the worker list to include the new worker
            fetchWorkers();
        }
    })
    .catch(error => {
        console.error('Error adding worker:', error);
    });
});



// Function to fetch and display workers
function fetchWorkers() {
    fetch('http://127.0.0.1:5000/api/workers')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data); // Log the data for debugging
            const workersContainer = document.getElementById('worker-overview');
            workersContainer.innerHTML = ''; // Clear previous content

            if (data && data.length > 0) {
                // Create a table to display the workers
                let table = `<table>
                    <thead>
                        <tr>
                            <th>Serial No.</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Number</th>
                            <th>Rate</th>
                            <th>Suit</th>
                            <th>Jacket</th>
                            <th>Sadri</th>
                            <th>Others</th>
                        </tr>
                    </thead>
                    <tbody>`;

                // Loop through each worker
                data.forEach((worker, index) => {
                    const serialNumber = index + 1; // Incremental serial number for each worker
                    table += `<tr>
                        <td>${serialNumber}</td> <!-- Serial Number Column -->
                        <td>${worker.id}</td>
                        <td>${worker.name}</td>
                        <td>${worker.number}</td>
                        <td>${worker.Rate}</td>
                        <td>${worker.Suit}</td>
                        <td>${worker.Jacket}</td>
                        <td>${worker.Sadri}</td>
                        <td>${worker.Others}</td>
                    </tr>`;
                });

                table += '</tbody></table>';
                workersContainer.innerHTML += table;
            } else {
                workersContainer.innerHTML = '<p>No workers found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching workers:', error);
            workersContainer.innerHTML = '<p>Error fetching workers.</p>';
        });
}

// Function to populate worker dropdown for removal
function populateWorkerDropdown() {
    fetch('http://127.0.0.1:5000/api/workers')
        .then(response => response.json())
        .then(data => {
            const workerSelect = document.getElementById('worker-select');
            workerSelect.innerHTML = ''; // Clear previous options

            if (data && data.length > 0) {
                // Create a dropdown option for each worker
                data.forEach(worker => {
                    const option = document.createElement('option');
                    option.value = worker.id; // Set the value as the worker's ID
                    option.textContent = `${worker.name}`; // Display worker name and number
                    workerSelect.appendChild(option);
                });
            } else {
                workerSelect.innerHTML = '<option>No workers available</option>';
            }
        })
        .catch(error => {
            console.error('Error populating worker dropdown:', error);
        });
}

// Handle form submission for removing a worker
document.getElementById('remove-worker-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get the selected worker's ID
    const workerId = document.getElementById('worker-select').value;

    // Send a DELETE request to the backend
    fetch(`http://127.0.0.1:5000/api/workers/${workerId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Worker removed:', data);

        // Hide the form after submission
        document.getElementById('remove-worker-form').style.display = 'none';

        // Refresh the worker list after deletion
        fetchWorkers();
    })
    .catch(error => {
        console.error('Error removing worker:', error);
    });
});




function fetchWorkers1() {
    fetch('http://127.0.0.1:5000/api/workers')
        .then(response => response.json())
        .then(data => {
            const workerSelect = document.getElementById('worker-select-expenses');
            workerSelect.innerHTML = ''; // Clear previous options

            data.forEach(worker => {
                const option = document.createElement('option');
                option.value = worker.id; // Use `id` for the option value
                // Combine worker ID and name for display in the dropdown
                option.textContent = `${worker.id} - ${worker.name}`; 
                workerSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching workers:', error);
        });
}


// Call fetchWorkers on page load
window.onload = function() {
    fetchWorkers1();
};


function submitExpense() {
    const workerSelect = document.getElementById('worker-select-expenses');
    const workerId = workerSelect.value;
    const workerName = workerSelect.options[workerSelect.selectedIndex].text;
    const expenseDate = document.getElementById('expense-date').value;
    const amtPaid = document.getElementById('amt-paid').value;

    if (!workerId || !expenseDate || !amtPaid) {
        alert('Please fill all the fields before submitting.');
        return;
    }

    const expenseData = {
        worker_id: workerId,
        name: workerName,
        date: expenseDate,
        Amt_Paid: amtPaid
    };

    // First fetch to add the expense
    fetch('http://127.0.0.1:5000/api/worker-expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errText => { throw new Error(errText); });
        }
        return response.json();
    })
    .then(result => {
        alert('Worker expense added successfully');
        console.log('Worker expense added:', result);

        // Second fetch to update total pay
        return fetch('http://127.0.0.1:5000/update_total_pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Total Pay update triggered' })
        });
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errText => { throw new Error(errText); });
        }
        return response.json();
    })
    .then(updateResult => {
        console.log('Total Pay updated:', updateResult);
        fetchDailyExpenses();
    })
    .catch(error => {
        console.error('Error adding expense or updating Total Pay:', error);
        alert('Error: ' + error.message);
    });
}




function fetchWorkerWeeklyPay() {
    fetch('/api/worker-weekly-pay')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('worker-pay-body');
            tableBody.innerHTML = '';  // Clear the table content before populating

            for (const workerId in data) {
                const workerData = data[workerId];
                const row = `<tr>
                                <td>${workerData.worker_id}</td>
                                <td>${workerData.work_pay}</td>
                                <td>${workerData.amt_paid}</td>
                                <td>${workerData.remaining_pay}</td>
                            </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            }

            // Show the table
            document.getElementById('worker-pay-table').style.display = 'table';
        })
        .catch(error => {
            console.error('Error fetching worker weekly pay:', error);
        });
}

// JS For Shop Expenses

document.addEventListener('DOMContentLoaded', function () {
    fetchDailyExpenses();  // Automatically fetch and display daily expenses
});

// Function to toggle the form's visibility
document.getElementById('toggle-form-btn').addEventListener('click', function () {
    const form = document.getElementById('shop-expenses-form');
    if (form.style.display === 'none') {
        form.style.display = 'block'; // Show form
    } else {
        form.style.display = 'none'; // Hide form
    }
});

// Function to add a new expense via the form
document.getElementById('add-expense-btn').addEventListener('click', function () {
    // Get values from the input fields
    const date = document.getElementById('shop-expense-date').value;
    const materialCost = document.getElementById('material-cost').value;
    const materialType = document.getElementById('material-type').value;
    const miscCost = document.getElementById('miscellaneous-cost').value;
    const miscItem = document.getElementById('miscellaneous-item').value;
    const chaiPaniCost = document.getElementById('chai-pani-cost').value;
    
    

    // Create an expense object
    const expenseData = {
        Date: date,
        material_cost: materialCost,
        material_type: materialType,
        miscellaneous_Cost: miscCost,
        miscellaenous_item: miscItem,
        chai_pani_cost: chaiPaniCost
    };

    // Send the data via a POST request
    fetch('http://127.0.0.1:5000/api/daily_expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data); // Log the response for debugging
        // Optionally, refresh the expenses list after adding
        fetchDailyExpenses(); // Function to refresh the expenses list
    })
    .catch(error => {
        console.error('Error adding expense:', error);
    });
});

function fetchDailyExpenses() {
    fetch('http://127.0.0.1:5000/api/daily_expenses')
        .then(response => response.json())
        .then(data => {
            const expensesContainer = document.getElementById('test');
            expensesContainer.innerHTML = ''; 

            if (data && data.length > 0) {
                let table = `<table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Material Cost</th>
                            <th>Material Type</th>
                            <th>Miscellaneous Cost</th>
                            <th>Miscellaneous Item</th>
                            <th>Chai Pani Cost</th>
                            <th>Total Pay</th>
                        </tr>
                    </thead>
                    <tbody>`;

                data.forEach(expense => {
                    table += `<tr>
                        <td>${expense.id}</td>
                        <td>${expense.Date}</td>
                        <td>${expense.material_cost}</td>
                        <td>${expense.material_type}</td>
                        <td>${expense.miscellaneous_Cost}</td>
                        <td>${expense.miscellaenous_item}</td>
                        <td>${expense.chai_pani_cost}</td>
                        <td>${expense.Total_Pay}</td>
                    </tr>`;
                });

                table += '</tbody></table>';
                expensesContainer.innerHTML += table;
            } else {
                expensesContainer.innerHTML = '<p>No expenses found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            // expensesContainer.innerHTML = '<p>Error fetching expenses.</p>';
        });
}


// Customer info Form js For fetching Customer info by mobile number


// Event listener for fetching customer info
document.getElementById('customer-info-form').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const mobileNumber = document.getElementById('customer-mobile-number').value;

    // Fetch customer data from backend
    fetch(`http://127.0.0.1:5000/api/customer-info/${mobileNumber}`)
        .then(response => response.json())
        .then(data => {
            // Populate measurements and order history
            populateMeasurements(data.measurements);
            displayCustomerOrders(data.order_history);
            console.log(data.order_history);
        })
        .catch(error => {
            console.error('Error fetching customer data:', error);
            alert('No orders found for this customer.');
        });
});

// Function to populate customer measurements in the form
function populateMeasurements(measurements) {
    // Check each element's existence before trying to set its value
    if (document.getElementById('length')) {
        document.getElementById('length').value = measurements.pant_length || '';
    }
    if (document.getElementById('kamar')) {
        document.getElementById('kamar').value = measurements.pant_kamar || '';
    }
    if (document.getElementById('hips')) {
        document.getElementById('hips').value = measurements.pant_hips || '';
    }
    if (document.getElementById('waist')) {
        document.getElementById('waist').value = measurements.pant_waist || '';
    }
    if (document.getElementById('Ghutna')) {
        document.getElementById('Ghutna').value = measurements.pant_ghutna || '';
    }
    if (document.getElementById('Bottom')) {
        document.getElementById('Bottom').value = measurements.pant_bottom || '';
    }
    if (document.getElementById('seat')) {
        document.getElementById('seat').value = measurements.pant_seat || '';
    }
    if (document.getElementById('shirtlength')) {
        document.getElementById('shirtlength').value = measurements.shirt_length || '';
    }
    if (document.getElementById('body')) {
        document.getElementById('body').value = measurements.shirt_body || '';
    }
    if (document.getElementById('Loose')) {
        document.getElementById('Loose').value = measurements.shirt_loose || '';
    }
    if (document.getElementById('Shoulder')) {
        document.getElementById('Shoulder').value = measurements.shirt_shoulder || '';
    }
    if (document.getElementById('Astin')) {
        document.getElementById('Astin').value = measurements.shirt_astin || '';
    }
    if (document.getElementById('collar')) {
        document.getElementById('collar').value = measurements.shirt_collar || '';
    }
    if (document.getElementById('allose')) {
        document.getElementById('allose').value = measurements.shirt_aloose || '';
    }
    if (document.getElementById('extra-input')) {
        document.getElementById('extra-input').value = measurements.extra_measurements || '';
    }
}


// Function to display customer's order history
function displayCustomerOrders(orders) {
    const orderDetails = document.getElementById("customer-info");
    

    // Clear any existing content
    orderDetails.innerHTML = "<h3>Customer Orders:</h3>";

    // Check if there are any orders
    if (orders.length === 0) {
        orderDetails.innerHTML += "<p>No orders found for this customer.</p>";
        return;
    }

    // Create a table to display orders
    const orderTable = document.createElement("table");
    orderTable.className = "orders-table";

    // Table header
    const tableHeader = `
    <tr>
        <th>Order ID</th>
        <th>Garment Type</th>
        <th>Quantity</th>
        <th>Order Date</th>
        <th>Due Date</th>
        <th>Delivery Date</th>
        <th>Payment Status</th>
        <th>Total Amount</th>
        <th>Status</th>
    </tr>
    `;
    orderTable.insertAdjacentHTML("beforeend", tableHeader);

    // Loop through each order and add it to the table
    orders.forEach(order => {
        const orderRow = `
        <tr>
            <td>${order.id}</td>
            <td>${order.garment_type}</td>
            <td>${order.total_qty}</td>
            <td>${formatDateTime(order.date_issue)}</td>
            <td>${formatDateTime(order.due_date)}</td>
            <td>${formatDateTime(order.delivery_date)}</td>
            <td>${order.payment_status}</td>
            <td>${order.total_amt}</td>
            <td>${order.payment_status}</td>
        </tr>
        `;
        orderTable.insertAdjacentHTML("beforeend", orderRow);
    });

    // Append the table to the orderDetails div
    orderDetails.appendChild(orderTable);
}


document.addEventListener('DOMContentLoaded', function () {
    // Fetch workers and populate the dropdown when the page loads
    fetchWorkersForPay();

    // Add event listener for the calculate button
    document.getElementById('calculate-weekly-pay').addEventListener('click', function () {
        const workerId = document.getElementById('worker-select-weekly').value;
        if (workerId) {
            calculateWeeklyPay(workerId);
        } else {
            alert('Please select a worker.');
        }
    });
});

function fetchWorkersForPay() {
    fetch('http://127.0.0.1:5000/api/workers')
        .then(response => response.json())
        .then(data => {
            const workerSelect = document.getElementById('worker-select-weekly');
            workerSelect.innerHTML = ''; // Clear previous options

            // Populate the dropdown with worker options
            data.forEach(worker => {
                const option = document.createElement('option');
                option.value = worker.id; // Assuming worker.id is the worker's ID
                option.textContent = `${worker.name} (ID: ${worker.id})`; // Display name and ID
                workerSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching workers:', error);
        });
}

function calculateWeeklyPay(workerId) {
    fetch(`http://127.0.0.1:5000/api/weekly-pay/${workerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                displayWeeklyPayResult(data);
            }
        })
        .catch(error => {
            console.error('Error fetching weekly pay:', error);
        });
}

function displayWeeklyPayResult(data) {
    const resultDiv = document.getElementById('weekly-pay-result');
    resultDiv.innerHTML = `
        <p>Worker ID: ${data.worker_id}</p>
        <p>Total Worker Pay: ₹${data.total_worker_pay.toFixed(2)}</p>
        <p>Total Amount Paid: ₹${data.total_amt_paid.toFixed(2)}</p>
        <p>Remaining Pay: ₹${data.remaining_pay.toFixed(2)}</p>
    `;
}


// Function to populate the worker dropdown
function fetchWorkers() {
    fetch('http://127.0.0.1:5000/api/workers')
        .then(response => response.json())
        .then(data => {
            const workerSelect = document.getElementById('worker-select-detailed');
            workerSelect.innerHTML = ''; // Clear previous options

            if (data && data.length > 0) {
                // Populate the dropdown with workers
                data.forEach(worker => {
                    const option = document.createElement('option');
                    option.value = worker.id; // Use worker ID for value
                    option.textContent = `${worker.id} - ${worker.name}`; // Display worker ID and name
                    workerSelect.appendChild(option);
                });
            } else {
                workerSelect.innerHTML = '<option>No workers available</option>';
            }
        })
        .catch(error => {
            console.error('Error fetching workers:', error);
        });
}

// // Function to fetch and display orders for the selected worker
// function fetchOrdersForWorker(workerId) {
//     fetch(`http://127.0.0.1:5000/api/orders?worker_id=${workerId}`)
//         .then(response => response.json())
//         .then(data => {
//             const ordersTableBody = document.querySelector('#orders-table tbody');
//             ordersTableBody.innerHTML = ''; // Clear previous content

//             if (data && data.length > 0) {
//                 // Iterate through each order and populate the table
//                 data.forEach(order => {
//                     const row = document.createElement('tr');

//                     const orderIdCell = document.createElement('td');
//                     orderIdCell.textContent = order.id;

//                     const customerNameCell = document.createElement('td');
//                     customerNameCell.textContent = order.customer_name;

//                     const orderDateCell = document.createElement('td');
//                     orderDateCell.textContent = new Date(order.order_date).toLocaleDateString();

//                     const amountCell = document.createElement('td');
//                     amountCell.textContent = `$${order.amount.toFixed(2)}`;

//                     // Append cells to the row
//                     row.appendChild(orderIdCell);
//                     row.appendChild(customerNameCell);
//                     row.appendChild(orderDateCell);
//                     row.appendChild(amountCell);

//                     // Append row to the table body
//                     ordersTableBody.appendChild(row);
//                 });
//             } else {
//                 ordersTableBody.innerHTML = '<tr><td colspan="4">No orders found for this worker.</td></tr>';
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching orders:', error);
//         });
// }

// // Event listener for worker selection
// document.getElementById('worker-select-detailed').addEventListener('change', function() {
//     const selectedWorkerId = this.value;
//     if (selectedWorkerId) {
//         fetchOrdersForWorker(selectedWorkerId); // Fetch orders when a worker is selected
//     } else {
//         document.querySelector('#orders-table tbody').innerHTML = ''; // Clear orders if no worker selected
//     }
// });

// // Call fetchWorkers on page load to populate the dropdown
// document.addEventListener('DOMContentLoaded', fetchWorkers);


function fetchOrdersForWorker(workerId) {
    fetch(`http://127.0.0.1:5000/api/orders?worker_id=${workerId}`)
        .then(response => response.json())
        .then(data => {
            const ordersTableBody = document.querySelector('#orders-table tbody');
            ordersTableBody.innerHTML = ''; // Clear previous content

            if (data && Object.keys(data).length > 0) {
                // Loop through each date and then through the orders for that date
                Object.keys(data).forEach(orderDate => {
                    const ordersForDate = data[orderDate];

                    // Insert a row for each order
                    ordersForDate.forEach(order => {
                        const row = document.createElement('tr');

                        const orderIdCell = document.createElement('td');
                        orderIdCell.textContent = order.id;

                        const customerNameCell = document.createElement('td');
                        customerNameCell.textContent = order.garment_type; // Assuming the garment type is for the customer

                        const orderDateCell = document.createElement('td');
                        orderDateCell.textContent = new Date(order.order_date).toLocaleDateString();

                        const amountCell = document.createElement('td');
                        amountCell.textContent = `₹${order.payment_amount.toFixed(2)}`;

                        // Append cells to the row
                        row.appendChild(orderIdCell);
                        row.appendChild(customerNameCell);
                        row.appendChild(orderDateCell);
                        row.appendChild(amountCell);

                        // Append the row to the table body
                        ordersTableBody.appendChild(row);
                    });
                });
            } else {
                ordersTableBody.innerHTML = '<tr><td colspan="4">No orders found for this worker.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
}

// Event listener for worker selection
document.getElementById('worker-select-detailed').addEventListener('change', function () {
    const selectedWorkerId = this.value;
    if (selectedWorkerId) {
        fetchOrdersForWorker(selectedWorkerId); // Fetch orders when a worker is selected
    } else {
        document.querySelector('#orders-table tbody').innerHTML = ''; // Clear orders if no worker selected
    }
});

// Call fetchWorkers on page load to populate the dropdown
document.addEventListener('DOMContentLoaded', fetchWorkers);

