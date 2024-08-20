document.addEventListener('DOMContentLoaded', function() {
    const searchCustomer = document.getElementById('searchCustomer');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderDateFilter = document.getElementById('orderDateFilter');

    let allData = []; // Αποθήκευση όλων των δεδομένων
    let dataType = ''; // Καθορίζει αν τα δεδομένα είναι παραγγελίες ή πληρωμές

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
                <td><button class="btn btn-primary btn-sm">Προβολή</button></td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    function fetchData(url, tableBodySelector, type) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allData = data; // Αποθήκευση δεδομένων
                dataType = type;
                loadTableData(data, tableBodySelector);
            })
            .catch(error => console.error('Σφάλμα φόρτωσης δεδομένων:', error));
    }

    function applyFilters() {
        let filteredData = allData;

        const searchValue = searchCustomer.value.toLowerCase();
        const statusValue = orderStatusFilter.value;
        const dateValue = orderDateFilter.value;

        if (searchValue) {
            filteredData = filteredData.filter(item => item.customerName.toLowerCase().includes(searchValue));
        }

        if (statusValue && statusValue !== (dataType === 'orders' ? 'Κατάσταση Παραγγελίας' : 'Κατάσταση Πληρωμής')) { // Αλλάξτε το όνομα αν χρειάζεται
            filteredData = filteredData.filter(item => item.status === statusValue);
        }

        if (dateValue) {
            filteredData = filteredData.filter(item => (item.orderDate || item.paymentDate) === dateValue);
        }

        loadTableData(filteredData, 'table tbody');
    }

    // Φόρτωση δεδομένων για Παραγγελίες ή Πληρωμές
    if (window.location.pathname.includes('orders.html')) {
        fetchData('data/orders.json', 'table tbody', 'orders');
    }

    if (window.location.pathname.includes('payments.html')) {
        fetchData('data/payments.json', 'table tbody', 'payments');
    }

    // Εφαρμογή φίλτρων
    if (searchCustomer) {
        searchCustomer.addEventListener('input', applyFilters);
    }

    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', applyFilters);
    }

    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', applyFilters);
    }
});
