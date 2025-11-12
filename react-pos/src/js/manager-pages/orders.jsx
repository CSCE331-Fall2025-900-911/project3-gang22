import { loadOrdersByDate } from '../api';

/**
 * @param {string | [string, string]} dateOrRange
 *   - "YYYY-MM-DD" for a single day
 *   - ["YYYY-MM-DD","YYYY-MM-DD"] for a range
 */
export default async function fetchOrders(dateOrRange) {
    try {
        const data = await loadOrdersByDate(dateOrRange);
        return data;
    } catch (err) {
        console.error('Error fetching orders:', err);
        return [];
    }
}
