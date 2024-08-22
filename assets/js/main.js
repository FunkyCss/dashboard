import { applyFilters, applySearch } from '../helpers/filters.js';
import { loadTableData } from '../helpers/tableRenderer.js';
import { updateModalDetails } from '../helpers/modalService.js';
import { debounce } from '../helpers/utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const searchCustomer = document.getElementById('searchCustomer');
    const productFilter = document.getElementById('productFilter');
    const paymentMethodFilter = document.getElementById('paymentMethodFilter');
    const exportButton = document.getElementById('exportButton');
    const refreshButton = document.getElementById('refreshButton');
    const tableBody = document.querySelector('#orders-table-body');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const modalElement = document.getElementById('orderModal');
    const bulkCheckbox = document.getElementById('bulkCheckbox');
    const modal = new bootstrap.Modal(modalElement);

    if (!tableBody) {
        console.error('Table body element is not found');
        return;
    }

    let allData = [];
    let filteredData = [];
    let fuse;

    function initializeFuse() {
        const options = {
            includeScore: true,
            keys: ['orderNumber', 'customerName', 'products', 'amount', 'paymentMethod']
        };
        fuse = new Fuse(allData, options);
    }

    async function loadInitialData() {
        const storedData = localStorage.getItem('ordersData');
        const storedTimestamp = localStorage.getItem('ordersDataTimestamp');
        const now = new Date().getTime();

        if (storedData && storedTimestamp && (now - storedTimestamp < 24 * 60 * 60 * 1000)) {
            allData = JSON.parse(storedData);
            filteredData = allData;
            initializeFuse();
            loadTableData(filteredData, tableBody, noResultsMessage);
        } else {
            try {
                const response = await fetch('data/woo-orders.json');
                if (!response.ok) throw new Error('Network response was not ok');
                allData = await response.json();
                filteredData = allData;
                localStorage.setItem('ordersData', JSON.stringify(allData));
                localStorage.setItem('ordersDataTimestamp', now.toString());
                initializeFuse();
                loadTableData(filteredData, tableBody, noResultsMessage);
            } catch (error) {
                console.error('Failed to load initial data:', error);
            }
        }
    }

    function applyFiltersAndUpdateTable() {
        const filters = {
            customerName: searchCustomer?.value || '',
            productFilter: productFilter?.value || '',
            paymentMethod: paymentMethodFilter?.value || ''
        };

        filteredData = applyFilters(allData, filters);
        loadTableData(filteredData, tableBody, noResultsMessage);
    }

    function applySearchAndUpdateTable() {
        const query = searchBox.value || '';
        const results = fuse.search(query).map(result => result.item);
        loadTableData(results, tableBody, noResultsMessage);
    }

    if (searchCustomer) {
        searchCustomer.addEventListener('input', debounce(applyFiltersAndUpdateTable, 300));
    }

    if (productFilter) {
        productFilter.addEventListener('input', debounce(applyFiltersAndUpdateTable, 300));
    }

    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', applyFiltersAndUpdateTable);
    }

    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('input', debounce(applySearchAndUpdateTable, 300));
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', loadInitialData);
    }

    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const selectedCheckboxes = document.querySelectorAll('.order-checkbox:checked');
            const selectedOrders = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-id'));
            console.log('Export Orders:', selectedOrders);
        });
    }

    if (bulkCheckbox) {
        bulkCheckbox.addEventListener('change', (event) => {
            document.querySelectorAll('.order-checkbox').forEach(checkbox => {
                checkbox.checked = event.target.checked;
            });
        });
    }

    tableBody.addEventListener('change', (event) => {
        if (event.target.classList.contains('order-checkbox')) {
            const selectedCheckboxes = document.querySelectorAll('.order-checkbox:checked');
            console.log('Selected Orders:', Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-id')));
        }
    });

    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('view-details')) {
            const id = event.target.getAttribute('data-id');
            const order = allData.find(order => order.orderNumber == id);
            if (order) {
                updateModalDetails(order);
                modal.show();
            }
        }
    });

    loadInitialData();
});
