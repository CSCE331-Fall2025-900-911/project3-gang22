import { loadMenu } from '../api';

//this version uses a centralized helper instead of hardcoding the URL
export default async function fetchMenu() {
    try {
        const data = await loadMenu();  // this calls /manager/menu and includes cookies
        return data;
    } catch (err) {
        console.error('Error fetching menu:', err);
        return [];
    }
}
