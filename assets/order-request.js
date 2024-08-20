// Στο order-request.js
console.log("Order Request Script Loaded");

$('.confirm-delivery').on('click', function () {
    console.log("Confirm Delivery Button Clicked"); // Πρόσθεσε αυτό
    const orderId = $(this).closest('tr').find('td:first').text();
    const customerName = $(this).closest('tr').find('td:nth-child(2)').text();
    const amount = $(this).closest('tr').find('td:nth-child(5)').text();
    const shippingCompany = $(this).closest('tr').find('td:nth-child(6)').text();
    const voucherNumber = $(this).closest('tr').find('td:nth-child(7)').text();
  
    const orderData = {
      OrderID: orderId,
      CustomerName: customerName,
      Amount: amount,
      ConfirmationDate: new Date().toISOString().split('T')[0],
      Status: 'Επιβεβαιωμένη',
      ShippingCompany: shippingCompany,
      VoucherNumber: voucherNumber
    };
  
    console.log("Sending Order Data:", orderData); // Πρόσθεσε αυτό

    $.ajax({
      url: 'http://localhost:3000/confirm-cod',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(orderData),
      success: function (response) {
        console.log(response);
        alert('Η αντικαταβολή επιβεβαιώθηκε και καταγράφηκε στο CSV.');
      },
      error: function (error) {
        console.error('Σφάλμα:', error);
        alert('Σφάλμα κατά την επιβεβαίωση της αντικαταβολής.');
      }
    });
});
