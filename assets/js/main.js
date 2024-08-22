// main.js
import { fetchData } from '../helpers/dataService.js';
import { loadTableData } from '../helpers/tableRenderer.js';
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
    let dataLoaded = false; // Flag for data loading status
    const localStorageKey = 'ordersData';
    const dataTimestampKey = 'ordersDataTimestamp';
    const dataExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    async function loadInitialData() {
        const storedData = localStorage.getItem(localStorageKey);
        const storedTimestamp = localStorage.getItem(dataTimestampKey);
        const now = new Date().getTime();

        if (storedData && storedTimestamp && (now - storedTimestamp < dataExpirationTime)) {
            allData = JSON.parse(storedData);
            filteredData = allData;
            dataLoaded = true;
            loadTableData(filteredData);
        } else {
            try {
                allData = await fetchData('data/woo-orders.json');
                filteredData = allData;
                dataLoaded = true;
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

    // Event listeners for filters and search
    if (searchCustomer) {
        searchCustomer.addEventListener('input', () => applyFilters(allData, searchCustomer, null, productFilter, paymentMethodFilter, loadTableData));
    }
    if (productFilter) {
        productFilter.addEventListener('input', () => applyFilters(allData, searchCustomer, null, productFilter, paymentMethodFilter, loadTableData));
    }
    if (paymentMethodFilter) {
        paymentMethodFilter.addEventListener('change', () => applyFilters(allData, searchCustomer, null, productFilter, paymentMethodFilter, loadTableData));
    }
    if (searchBox) {
        searchBox.addEventListener('input', () => applySearch(allData, searchBox, loadTableData));
    }

    // Event listener for refresh button
    if (refreshButton) {
        refreshButton.addEventListener('click', refreshData);
    }

    // Load initial data
    loadInitialData();
});