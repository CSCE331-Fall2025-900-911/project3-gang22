import { loadSalesReport } from '../api';

/**
 * @param {string} dateFmt - e.g., "day" | "week" | "month"
 * @param {string} range   - e.g., "last7" | "last30" | "custom"
 * @param {string} dateStr - depends on your backend (often "YYYY-MM-DD" or "YYYY-MM-DD,YYYY-MM-DD")
 */
export default async function fetchSalesReport(dateFmt, range, dateStr) {
    try {
        const data = await loadSalesReport(dateFmt, range, dateStr);
        return data;
    } catch (err) {
        console.error('Error fetching sales report:', err);
        return [];
    }
}
