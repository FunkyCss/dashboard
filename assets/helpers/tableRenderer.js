// tableRenderer.js
export function loadTableData(data) {
    const tableBody = document.querySelector('#orders-table-body');
    tableBody.innerHTML = ''; // Clear the table
    const noResultsMessage = document.getElementById('noResultsMessage');
    noResultsMessage.style.display = data.length === 0 ? 'block' : 'none';

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
}