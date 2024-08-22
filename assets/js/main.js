// main.js
import { fetchData } from '../helpers/dataService.js';
import { loadTableData } from '../helpers/tableRenderer.js';
import { updateModalDetails } from '../helpers/modalService.js';
import { applyFilters, applySearch } from '../helpers/filters.js';

document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box input');
    const searchCustomer = document.getElementById('searchCustomer');
    const productFilter = document.getElementById('productFilter');
    const paymentMethodFilter = document.getElementById('paymentMethodFilter');
    const exportButton = document.getElementById('exportButton');
    const refreshButton = document.getElementById('refreshButton');
    const tableBody = document.querySelector('#orders-table-body');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const bulkCheckbox = document.getElementById('bulkCheckbox');

    let allData = [];
    let filteredData = [];
    let dataLoaded = false; // Flag για την κατάσταση φόρτωσης των δεδομένων

const localStorageKey = 'ordersData';
const dataTimestampKey = 'ordersDataTimestamp';
const dataExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function loadInitialData() {
    const storedData = localStorage.getItem(localStorageKey);
    const storedTimestamp = localStorage.getItem(dataTimestampKey);
    const now = new Date().getTime();

    if (storedData && storedTimestamp && (now - storedTimestamp < dataExpirationTime)) {
        // Data is valid and not expired
        allData = JSON.parse(storedData);
        filteredData = allData;
        dataLoaded = true;
        loadTableData(filteredData);
    } else {
        // Fetch fresh data from the server
        async function fetchData(url) {
            const response = await fetch(url, {
                cache: 'no-cache'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }

        try {
            allData = await fetchData('data/woo-orders.json');
            filteredData = allData;
            dataLoaded = true;

            // Store the data and timestamp in local storage
            localStorage.setItem(localStorageKey, JSON.stringify(allData));
            localStorage.setItem(dataTimestampKey, now.toString());

            loadTableData(filteredData);
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }
}

    
    async function refreshData() {
        try {
            allData = await fetchData('data/woo-orders.json');
            filteredData = allData;
            loadTableData(filteredData);
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }

    function loadTableData(data) {
        tableBody.innerHTML = ''; // Καθαρίζει τον πίνακα

        if (data.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        data.forEach((item, index) => {
            const rowClass = item.paymentMethod === 'Κάρτα' ? 'payment-card' :
                            item.paymentMethod === 'Αντικαταβολή' ? 'payment-cod' :
                            item.paymentMethod === 'Paypal' ? 'payment-paypal' : '';

            let row = `<tr class="${rowClass}">
                <td>${index + 1}</td>
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

        // Προσθέτουμε ακροατές για τα κουμπιά "Προβολή"
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

    // Event listeners για τα φίλτρα και την αναζήτηση
    if (searchCustomer) {
        searchCustomer.addEventListener('input', applyFilters);
    }

    if (productFilter) {
        productFilter.addEventListener('input', applyFilters);
    }

    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', applyFilters);
    }

    if (searchBox) {
        searchBox.addEventListener('input', applySearch);
    }

    // Event listener για το κουμπί ανανέωσης
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshData);
    }

    // Event listener για το κουμπί εξαγωγής
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // Εδώ θα προστεθεί ο κώδικας για την εξαγωγή σε Excel
        });
    }

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

    // Φόρτωση αρχικών δεδομένων
    loadInitialData();
});
