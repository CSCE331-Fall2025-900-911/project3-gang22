import { loadEmployees } from '../api';

export default async function fetchEmployees() {
    try {
        const data = await loadEmployees();
        return data;
    } catch (err) {
        console.error('Error fetching employees:', err);
        return [];
    }
}
