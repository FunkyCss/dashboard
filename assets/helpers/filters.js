// filters.js

export function applyFilters(data, filters) {
    const { customerName, productFilter, paymentMethod } = filters;

    return data.filter(item => {
        // Ensure values are defined before applying toLowerCase
        const customerNameMatch = !customerName || item.customerName.toLowerCase().includes(customerName.toLowerCase());
        const productFilterMatch = !productFilter || item.products.join(', ').toLowerCase().includes(productFilter.toLowerCase());
        const paymentMethodMatch = !paymentMethod || item.paymentMethod === paymentMethod;

        return customerNameMatch && productFilterMatch && paymentMethodMatch;
    });
}


export function applySearch(fuseInstance, searchBox, loadTableData) {
    const searchValue = searchBox ? searchBox.value.toLowerCase() : '';

    if (searchValue) {
        const fuseResults = fuseInstance.search(searchValue);
        const filteredData = fuseResults.map(result => result.item);
        loadTableData(filteredData);
    } else {
        // If search is empty, show all data
        loadTableData(fuseInstance._docs);
    }
}

