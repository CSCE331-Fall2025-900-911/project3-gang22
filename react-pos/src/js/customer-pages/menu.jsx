import { API_BASE } from '../apibase';

// Fetches menu data for kiosk interface and returns it
export default async function fetchMenu() {
  try {
    const response = await fetch(API_BASE + "/customer/menu", {credentials: 'include'});
    const data = await response.json(); 
    console.log(data);
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}