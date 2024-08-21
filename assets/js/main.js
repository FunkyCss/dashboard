// main.js
import { debounce } from '../helpers/utils.js';
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
    const tableBody = document.querySelector('#orders-table-body');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let allData = [];
    let filteredData = [];

    // Load data initially
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
            .catch(error => console.error('Error loading data:', error));
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
                <td>${index + 1}</td> <!-- Προσθέτουμε αριθμό σειράς -->
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

    function updateModalDetails(order) {
        document.getElementById('modalCustomerName').innerText = order.customerName || 'Δεν διατίθεται';
        document.getElementById('modalAddress').innerText = order.address || 'Δεν διατίθεται';
        document.getElementById('modalArea').innerText = order.area || 'Δεν διατίθεται';
        document.getElementById('modalZip').innerText = order.zip || 'Δεν διατίθεται';
        document.getElementById('modalPhone').innerText = order.phone || 'Δεν διατίθεται';
        document.getElementById('modalEmail').innerText = order.email || 'Δεν διατίθεται'; // Νέο πεδίο
        document.getElementById('modalComments').innerText = order.comments || 'Δεν διατίθεται'; // Νέο πεδίο
        document.getElementById('modalPaymentMethod').innerText = order.paymentMethod || 'Δεν διατίθεται';
    }

    function applyFilters() {
        filteredData = allData;  // Αρχικά αναθέτουμε όλα τα δεδομένα
        
        const searchValue = searchCustomer ? searchCustomer.value.toLowerCase() : '';
        const productValue = productFilter ? productFilter.value.toLowerCase() : '';
        const paymentMethodValue = paymentMethodFilter ? paymentMethodFilter.value : '';

        // Φιλτράρισμα ανά πελάτη
        if (searchValue) {
            filteredData = filteredData.filter(item => item.customerName.toLowerCase().includes(searchValue));
        }

        // Φιλτράρισμα ανά προϊόν
        if (productValue) {
            filteredData = filteredData.filter(item => item.products.some(product => product.toLowerCase().includes(productValue)));
        }

        // Φιλτράρισμα ανά μέθοδο πληρωμής
        if (paymentMethodValue) {
            filteredData = filteredData.filter(item => item.paymentMethod === paymentMethodValue);
        }

        loadTableData(filteredData);
    }

    function applySearch() {
        const searchValue = searchBox ? searchBox.value.toLowerCase() : '';

        filteredData = allData.filter(item => {
            return item.orderNumber.toString().includes(searchValue) ||
                   item.customerName.toLowerCase().includes(searchValue) ||
                   item.products.some(product => product.toLowerCase().includes(searchValue)) ||
                   item.amount.toString().includes(searchValue) ||
                   item.paymentMethod.toLowerCase().includes(searchValue);
        });

        loadTableData(filteredData);
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

    // Φόρτωση αρχικών δεδομένων
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
});
