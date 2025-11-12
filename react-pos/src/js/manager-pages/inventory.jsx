import { loadInventory } from '../api';

export default async function fetchInventory() {
    try {
        const data = await loadInventory();
        return data;
    } catch (err) {
        console.error('Error fetching inventory:', err);
        return [];
    }
}
