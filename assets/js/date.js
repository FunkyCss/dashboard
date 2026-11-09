document.addEventListener('DOMContentLoaded', function() {
    const orderDateFilter = document.getElementById('orderDateFilter');
    function setDefaultDate() {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();

        const formattedDate = `${year}-${month}-${day}`;
        orderDateFilter.value = formattedDate;
    }

    // Κλήση της συνάρτησης για να ρυθμίσει την ημερομηνία
    setDefaultDate();
});
