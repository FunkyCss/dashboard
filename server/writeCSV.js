const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-write-stream');
let writer = csvWriter({ sendHeaders: false });
const csvFilePath = path.join(__dirname, 'antikatavoles.csv');

// Δεδομένα παραγγελίας προς καταγραφή
const order = {
  OrderID: '12347',
  CustomerName: 'Νίκος Κωνσταντίνου',
  Amount: '100.00',
  ConfirmationDate: new Date().toISOString().split('T')[0],
  Status: 'Επιβεβαιωμένη',
  ShippingCompany: 'Γενική Ταχυδρομική',
  VoucherNumber: '135791113'
};

// Έλεγχος αν το CSV αρχείο υπάρχει
if (!fs.existsSync(csvFilePath)) {
  // Δημιουργεί το αρχείο αν δεν υπάρχει και προσθέτει επικεφαλίδες
  writer = csvWriter({ headers: ['OrderID', 'CustomerName', 'Amount', 'ConfirmationDate', 'Status', 'ShippingCompany', 'VoucherNumber'] });
  writer.pipe(fs.createWriteStream(csvFilePath, { flags: 'a' }));
} else {
  // Προσθήκη δεδομένων χωρίς επικεφαλίδες αν το αρχείο υπάρχει
  writer.pipe(fs.createWriteStream(csvFilePath, { flags: 'a' }));
}

// Προσθήκη της νέας εγγραφής στο CSV
writer.write(order);
writer.end();
