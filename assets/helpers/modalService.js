// modalService.js
export function updateModalDetails(order) {
    document.getElementById('modalCustomerName').innerText = order.customerName || 'Δεν διατίθεται';
    document.getElementById('modalAddress').innerText = order.address || 'Δεν διατίθεται';
    document.getElementById('modalArea').innerText = order.area || 'Δεν διατίθεται';
    document.getElementById('modalZip').innerText = order.zip || 'Δεν διατίθεται';
    document.getElementById('modalPhone').innerText = order.phone || 'Δεν διατίθεται';
    document.getElementById('modalAmount').innerText = order.amount || 'Δεν διατίθεται';
    document.getElementById('modalPaymentMethod').innerText = order.paymentMethod || 'Δεν διατίθεται';
}
