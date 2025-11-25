import { CUSTOMER_BASE_URL } from "../customer";

// Fetches menu data for kiosk interface and returns it
export default async function fetchMenu() {
  try {
    const response = await fetch(`${CUSTOMER_BASE_URL}/menu`, {credentials: 'include'});
    const data = await response.json(); 
    console.log(data);
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}