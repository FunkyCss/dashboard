// dataServices.js
export async function loadInitialData(fuseInstance, initializeFuseInstance, loadTableData) {
    const storedData = localStorage.getItem('ordersData');
    const storedTimestamp = localStorage.getItem('ordersDataTimestamp');
    const now = new Date().getTime();

    let allData = [];

    if (storedData && storedTimestamp && (now - storedTimestamp < 24 * 60 * 60 * 1000)) {
        allData = JSON.parse(storedData);
        initializeFuseInstance(allData);
        loadTableData(allData);
    } else {
        try {
            const response = await fetch('data/woo-orders.json');
            if (!response.ok) throw new Error('Network response was not ok');
            allData = await response.json();
            localStorage.setItem('ordersData', JSON.stringify(allData));
            localStorage.setItem('ordersDataTimestamp', now.toString());
            initializeFuseInstance(allData);
            loadTableData(allData);
        } catch (error) {
            console.error('Failed to load initial data:', error);
        }
    }

    return allData;
}
