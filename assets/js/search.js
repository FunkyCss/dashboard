document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box input');
    const tableBody = document.querySelector('#orders-table-body');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    let allData = [];
    let filteredData = [];

    // Φόρτωσε τα δεδομένα αρχικά
    fetchData('data/woo-orders.json');

    function fetchData(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                allData = data;
                filteredData = data;
                loadTableData(data);
            })
            .catch(error => console.error('Σφάλμα φόρτωσης δεδομένων:', error));
    }

    function loadTableData(data) {
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

    function applySearch() {
        const searchValue = searchBox.value.toLowerCase();

        filteredData = allData.filter(item => {
            return item.orderNumber.toString().includes(searchValue) ||
                   item.customerName.toLowerCase().includes(searchValue) ||
                   item.products.some(product => product.toLowerCase().includes(searchValue)) ||
                   item.amount.toString().includes(searchValue) ||
                   item.paymentMethod.toLowerCase().includes(searchValue);
        });

        loadTableData(filteredData);
    }

    // Πρόσθεσε τον ακροατή για το πεδίο αναζήτησης
    if (searchBox) {
        searchBox.addEventListener('input', applySearch);
    }
});
