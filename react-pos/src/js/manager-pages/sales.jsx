import { loadSales } from '../api';

/**
 * @param {string} date - "YYYY-MM-DD"
 */
export default async function fetchSales(date) {
    try {
        const data = await loadSales(date);
        return data;
    } catch (err) {
        console.error('Error fetching sales:', err);
        return [];
    }
}
