// tableRenderer.js
export function loadTableData(data) {
    const fragment = document.createDocumentFragment(); // Create a fragment to avoid multiple DOM manipulations

    if (data.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }

    data.forEach((item, index) => { // Added index to handle numbering
        const row = document.createElement('tr');
        const rowClass = item.paymentMethod === 'Κάρτα' ? 'payment-card' :
                        item.paymentMethod === 'Αντικαταβολή' ? 'payment-cod' :
                        item.paymentMethod === 'Paypal' ? 'payment-paypal' : '';
        row.className = rowClass;

        row.innerHTML = `
            <td>${index + 1}</td> <!-- Αριθμός σειράς -->
            <td><input type="checkbox" class="bulk-select" data-id="${item.orderNumber}"></td>
            <td>${item.orderNumber}</td>
            <td>${item.customerName}</td>
            <td>${item.orderDate}</td>
            <td>${item.amount}</td>
            <td>${item.products.join(', ')}</td>
            <td>${item.paymentMethod}</td>
            <td><button class="btn btn-primary btn-sm view-details" data-id="${item.orderNumber}">Προβολή</button></td>
        `;

        fragment.appendChild(row);
    });

    tableBody.innerHTML = ''; // Clear the table
    tableBody.appendChild(fragment); // Append the fragment to the DOM

    // Event delegation for view details buttons
    tableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-details')) {
            const id = event.target.getAttribute('data-id');
            const order = allData.find(order => order.orderNumber == id);
            if (order) {
                updateModalDetails(order);
                $('#orderModal').modal('show');
            }
        }
    });

    // Event delegation for bulk checkbox selection
    if (bulkCheckbox) {
        bulkCheckbox.addEventListener('change', function () {
            document.querySelectorAll('.bulk-select').forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}