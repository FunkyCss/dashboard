document.addEventListener('DOMContentLoaded', function() {
    const searchCustomer = document.getElementById('searchCustomer');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    const orderDateFilter = document.getElementById('orderDateFilter');
    
    let allData = [];
    let dataType = 'orders'; // Είδος δεδομένων, ξεκινάμε με orders

    function loadTableData(data, tableBodySelector) {
        let tableBody = document.querySelector(tableBodySelector);
        tableBody.innerHTML = ''; // Καθαρίζει τον πίνακα

        data.forEach(item => {
            const isCOD = item.amount && item.status === "Ολοκληρωμένη";
            const confirmDeliveryButtonStyle = isCOD ? '' : 'display: none;';

            let row = `<tr${item.status === "Επιστροφή" ? ' style="background-color: #ffe0b2;"' : ''}>
                <td>${item.id}</td>
                <td>${item.customerName}</td>
                <td>${item.orderDate || item.paymentDate}</td>
                <td>${item.status}</td>
                <td>${item.amount}</td>
                <td>${item.shippingCompany}</td>
                <td>${item.voucherNumber}</td>
                <td>
                    <button class="btn btn-primary btn-sm view-details" data-id="${item.id}">Προβολή</button>
                    <button class="btn btn-success btn-sm confirm-delivery" style="${confirmDeliveryButtonStyle}">Επιβεβαίωση Αντικαταβολής</button>
                </td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Ενημέρωση των κουμπιών
        document.querySelectorAll('.confirm-delivery').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('tr').style.backgroundColor = '#d4edda';
                this.style.display = 'none';
                updateModalCODStatus(true);
            });
        });

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

        const isCODConfirmed = order.isCODConfirmed;
        document.getElementById('modalCODStatus').innerText = isCODConfirmed ? 'Επιβεβαιωμένη' : 'Σε αναμονή πληρωμής';
    }

    function updateModalCODStatus(isConfirmed) {
        if ($('#orderModal').is(':visible')) {
            document.getElementById('modalCODStatus').innerText = isConfirmed ? 'Επιβεβαιωμένη' : 'Σε αναμονή πληρωμής';
        }
    }

    function fetchData(url, tableBodySelector, type) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                allData = data;
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

        if (statusValue && statusValue !== (dataType === 'orders' ? 'Κατάσταση Παραγγελίας' : 'Κατάσταση Πληρωμής')) {
            filteredData = filteredData.filter(item => item.status === statusValue);
        }

        if (dateValue) {
            filteredData = filteredData.filter(item => (item.orderDate || item.paymentDate) === dateValue);
        }

        loadTableData(filteredData, 'table tbody');
    }

    if (window.location.pathname.includes('orders.html')) {
        fetchData('data/orders.json', 'table tbody', 'orders');
    }

    if (window.location.pathname.includes('payments.html')) {
        fetchData('data/payments.json', 'table tbody', 'payments');
    }

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
