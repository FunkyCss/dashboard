document.addEventListener("DOMContentLoaded", function() {
    const exportButton = document.getElementById('exportButton');

    exportButton.addEventListener('click', function() {
        // Αποκτάμε τα δεδομένα από τον πίνακα
        const table = document.querySelector('table');
        const workbook = XLSX.utils.table_to_book(table, { sheet: "Orders" });

        // Δημιουργούμε το αρχείο Excel
        const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        // Δημιουργούμε ένα URL για το αρχείο
        const blob = new Blob([excelFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);

        // Δημιουργούμε ένα link και το "κλικ" για την λήψη
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders.xlsx';
        document.body.appendChild(a);
        a.click();

        // Αφαιρούμε το link από το DOM
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
});
