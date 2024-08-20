document.addEventListener('DOMContentLoaded', function() {
    const searchCustomer = document.getElementById('searchCustomer');
    const orderDateFilter = document.getElementById('orderDateFilter');
    const searchProduct = document.getElementById('searchProduct');
    
    let allData = [];

    function loadTableData(data, tableBodySelector) {
        let tableBody = document.querySelector(tableBodySelector);
        tableBody.innerHTML = ''; // Καθαρίζει τον πίνακα

        data.forEach(item => {
            let row = `<tr>
                <td>${item.id}</td>
                <td>${item.customerName}</td>
                <td>${item.orderDate || item.paymentDate}</td>
                <td>${item.status}</td>
                <td>${item.amount}</td>
                <td>${item.products.join(', ')}</td>
                <td>
                    <button class="btn btn-primary btn-sm view-details" data-id="${item.id}">Προβολή</button>
                </td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Ενημέρωση των κουμπιών
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const order = allData.find(order => order.id == id);

                if (order) {
                    updateModalDetails(order);
                    $('#orderModal').modal('show');
                }
            });
        });
    }

    function updateModalDetails(order) {
        document.getElementById('modalCustomerName').innerText = order.customerName || 'Δεν διατίθεται';
        document.getElementById('modalAddress').innerText = order.address || 'Δεν διατίθεται';
        document.getElementById('modalArea').innerText = order.area || 'Δεν διατίθεται';
        document.getElementById('modalZip').innerText = order.zip || 'Δεν διατίθεται';
        document.getElementById('modalPhone').innerText = order.phone || 'Δεν διατίθεται';
        document.getElementById('modalAmount').innerText = order.amount || 'Δεν διατίθεται';
        document.getElementById('modalProducts').innerText = order.products ? order.products.join(', ') : 'Δεν διατίθεται';

        const isCODConfirmed = order.isCODConfirmed;
        document.getElementById('modalCODStatus').innerText = isCODConfirmed ? 'Επιβεβαιωμένη' : 'Σε αναμονή πληρωμής';
    }

    function fetchData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allData = data;
                loadTableData(data, '#orders-table-body');
            })
            .catch(error => console.error('Σφάλμα φόρτωσης δεδομένων:', error));
    }

    function applyFilters() {
        let filteredData = allData;

        const searchCustomerValue = searchCustomer.value.toLowerCase();
        const dateValue = orderDateFilter.value;
        const productValue = searchProduct.value.toLowerCase();

        if (searchCustomerValue) {
            filteredData = filteredData.filter(item => item.customerName.toLowerCase().includes(searchCustomerValue));
        }

        if (dateValue) {
            filteredData = filteredData.filter(item => (item.orderDate || item.paymentDate) === dateValue);
        }

        if (productValue) {
            filteredData = filteredData.filter(item => item.products.some(product => product.toLowerCase().includes(productValue)));
        }

        loadTableData(filteredData, '#orders-table-body');
    }

    // Φόρτωση δεδομένων όταν φορτώνεται η σελίδα
    if (window.location.pathname.includes('woo.html')) {
        fetchData('data/woo-orders.json');
    }

    // Εφαρμογή φίλτρων
    if (searchCustomer) {
        searchCustomer.addEventListener('input', applyFilters);
    }

    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', applyFilters);
    }

    if (searchProduct) {
        searchProduct.addEventListener('input', applyFilters);
 
