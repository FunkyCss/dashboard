// filters.js
export function applyFilters(allData, searchCustomer, orderDateFilter, productFilter, paymentMethodFilter, loadTableData) {
    let filteredData = allData;
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

export function applySearch(allData, searchBox, loadTableData) {
    const searchValue = searchBox ? searchBox.value.toLowerCase() : '';
    const filteredData = allData.filter(item => {
        return item.orderNumber.toString().includes(searchValue) ||
               item.customerName.toLowerCase().includes(searchValue) ||
               item.products.some(product => product.toLowerCase().includes(searchValue)) ||
               item.amount.toString().includes(searchValue) ||
               item.paymentMethod.toLowerCase().includes(searchValue);
    });
    loadTableData(filteredData);
}