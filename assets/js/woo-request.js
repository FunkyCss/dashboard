document.addEventListener('DOMContentLoaded', function() {
    const searchCustomer = document.getElementById('searchCustomer');
    const orderDateFilter = document.getElementById('orderDateFilter');
    const productFilter = document.getElementById('productFilter');
    const paymentMethodFilter = document.getElementById('paymentMethodFilter');
    const bulkCheckbox = document.getElementById('bulkCheckbox');
    const exportButton = document.getElementById('exportButton');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    let allData = [];

    function loadTableData(data, tableBodySelector) {
        let tableBody = document.querySelector(tableBodySelector);
        tableBody.innerHTML = ''; // Καθαρίζει τον πίνακα

        if (data.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        data.forEach(item => {
            const rowClass = item.paymentMethod === 'Κάρτα' ? 'payment-card' :
                            item.paymentMethod === 'Αντικαταβολή' ? 'payment-cod' :
                            item.paymentMethod === 'Paypal' ? 'payment-paypal' : '';

            let row = `<tr class="${rowClass}">
                <td><input type="checkbox" class="bulk-select" data-id="${item.orderNumber}"></td>
                <td>${item.orderNumber}</td>
                <td>${item.customerName}</td>
                <td>${item.orderDate}</td>
                <td>${item.amount}</td>
                <td>${item.products.join(', ')}</td>
                <td>${item.paymentMethod}</td>
                <td>
                    <button class="btn btn-primary btn-sm view-details" data-id="${item.orderNumber}">Προβολή</button>
                </td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const order = allData.find(order => order.orderNumber == id);

                if (order) {
                    updateModalDetails(order);
                    $('#orderModal').modal('show');
                }
            });
        });

        if (bulkCheckbox) {
            bulkCheckbox.addEventListener('change', function() {
                document.querySelectorAll('.bulk-select').forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        }

        if (exportButton) {
            exportButton.addEventListener('click', function() {
                alert('Δημιουργία EXCEL (Δεν είναι έτοιμο ακόμη)');
            });
        }
    }

    function updateModalDetails(order) {
        document.getElementById('modalCustomerName').innerText = order.customerName || 'Δεν διατίθεται';
        document.getElementById('modalAddress').innerText = order.address || 'Δεν διατίθεται';
        document.getElementById('modalArea').innerText = order.area || 'Δεν διατίθεται';
        document.getElementById('modalZip').innerText = order.zip || 'Δεν διατίθεται';
        document.getElementById('modalPhone').innerText = order.phone || 'Δεν διατίθεται';
        document.getElementById('modalAmount').innerText = order.amount || 'Δεν διατίθεται';
        document.getElementById('modalPaymentMethod').innerText = order.paymentMethod || 'Δεν διατίθεται';
    }

    function applyFilters() {
        let filteredData = allData;

        const searchValue = searchCustomer.value.toLowerCase();
        const dateValue = orderDateFilter.value;
        const productValue = productFilter.value.toLowerCase();
        const paymentMethodValue = paymentMethodFilter.value;

        if (searchValue) {
            filteredData = filteredData.filter(item => item.customerName.toLowerCase().includes(searchValue));
        }

        if (dateValue) {
            filteredData = filteredData.filter(item => item.orderDate === dateValue);
        }

        if (productValue) {
            filteredData = filteredData.filter(item => item.products.some(product => product.toLowerCase().includes(productValue)));
        }

        if (paymentMethodValue) {
            filteredData = filteredData.filter(item => item.paymentMethod === paymentMethodValue);
        }

        loadTableData(filteredData, '#orders-table-body');
    }

    function fetchData(url, tableBodySelector) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                allData = data;
                loadTableData(data, tableBodySelector);
            })
            .catch(error => console.error('Σφάλμα φόρτωσης δεδομένων:', error));
    }
    
    if (window.location.pathname.includes('index.html')) {
        fetchData('data/woo-orders.json', '#orders-table-body');

    }

    if (searchCustomer) {
        searchCustomer.addEventListener('input', applyFilters);
    }

    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', applyFilters);
    }

    if (productFilter) {
        productFilter.addEventListener('input', applyFilters);
    }

    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', applyFilters);
    }
});
