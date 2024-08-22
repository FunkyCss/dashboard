// Ensure tableBody is defined after the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#orders-table-body');
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }

    function toggleAllCheckboxes(checked) {
        orderCheckboxes.forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    if (bulkCheckbox) {
        bulkCheckbox.addEventListener('change', (event) => {
            toggleAllCheckboxes(event.target.checked);
        });
    }

    // Event delegation for individual checkboxes
    tableBody.addEventListener('change', (event) => {
        if (event.target.classList.contains('order-checkbox')) {
            // Handle individual checkbox change if needed
            const selectedCheckboxes = document.querySelectorAll('.order-checkbox:checked');
            console.log('Selected Orders:', Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-id')));
        }
    });

});
