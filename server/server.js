app.post('/confirm-cod', (req, res) => {
  const order = req.body; 
  console.log('Received order:', order); // Εμφανίζει τις παραγγελίες στον κονσόλα του διακομιστή
  const csvFilePath = path.join(__dirname, 'antikatavoles.csv');

  let writer = csvWriter({ sendHeaders: false });

  if (!fs.existsSync(csvFilePath)) {
    writer = csvWriter({ headers: ['OrderID', 'CustomerName', 'Amount', 'ConfirmationDate', 'Status', 'ShippingCompany', 'VoucherNumber'] });
    writer.pipe(fs.createWriteStream(csvFilePath, { flags: 'a' }));
  } else {
    writer.pipe(fs.createWriteStream(csvFilePath, { flags: 'a' }));
  }

  writer.write(order);
  writer.end();

  res.send('Order confirmed and written to CSV.');
});
