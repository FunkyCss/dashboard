// main.js
import { debounce } from '../helpers/utils.js';
import { fetchData } from '../helpers/dataService.js';
import { loadTableData } from '../helpers/tableRenderer.js';
import { updateModalDetails } from '../helpers/modalService.js';
import { applyFilters, applySearch } from '../helpers/filters.js';

document.addEventListener('DOMContentLoaded', async function () {
    const searchBox = document.querySelector('.search-box input');
    const searchCustomer = document.getElementById('searchCustomer');
    const orderDateFilter = document.getElementById('orderDateFilter');
    const productFilter = document.getElementById('productFilter');
    const paymentMethodFilter = document.getElementById('paymentMethodFilter');
    const bulkCheckbox = document.getElementById('bulkCheckbox');
    const exportButton = document.getElementById('exportButton');
    const tableBody = document.querySelector('#orders-table-body');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let allData = [];
    let filteredData = [];

    try {
        allData = await fetchData('/data/woo-orders.json');
        filteredData = allData;
        loadTableData(filteredData); // Ξεκινά με όλα τα δεδομένα
    } catch (error) {
        console.error('Failed to initialize data:', error);
    }

    function loadTableData(data) {
        const fragment = document.createDocumentFragment(); // Create a fragment to avoid multiple DOM manipulations

        if (data.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            const rowClass = item.paymentMethod === 'Κάρτα' ? 'payment-card' :
                            item.paymentMethod === 'Αντικαταβολή' ? 'payment-cod' :
                            item.paymentMethod === 'Paypal' ? 'payment-paypal' : '';
            row.className = rowClass;

            row.innerHTML = `
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

    function applyFilters() {
        filteredData = allData;

        const searchValue = searchCustomer ? searchCustomer.value.toLowerCase() : '';
        const dateValue = orderDateFilter ? orderDateFilter.value : '';
        const productValue = productFilter ? productFilter.value.toLowerCase() : '';
        const paymentMethodValue = paymentMethodFilter ? paymentMethodFilter.value : '';

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

    // Debounce function to optimize input events
    function debounce(fn, delay) {
        let timeoutID;
        return function (...args) {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Attach event listeners for search and filters, with debouncing
    if (searchCustomer) {
        searchCustomer.addEventListener('input', debounce(applyFilters, 300));
    }

    if (orderDateFilter) {
        orderDateFilter.addEventListener('change', debounce(applyFilters, 300));
    }

    if (productFilter) {
        productFilter.addEventListener('input', debounce(applyFilters, 300));
    }

    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', debounce(applyFilters, 300));
    }

    if (searchBox) {
        searchBox.addEventListener('input', debounce(applySearch, 300));
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
});
