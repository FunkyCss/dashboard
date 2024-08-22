// tableRenderer.js
export function loadTableData(data, tableBody, noResultsMessage) {
    tableBody.innerHTML = '';

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
            <td><input type="checkbox" class="order-checkbox" data-id="${item.orderNumber}"></td>
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
}
