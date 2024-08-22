// dataService.js
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Data loaded successfully:', data); // Για debugging
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return []; // Επιστρέφει κενό πίνακα σε περίπτωση σφάλματος
    }
}
