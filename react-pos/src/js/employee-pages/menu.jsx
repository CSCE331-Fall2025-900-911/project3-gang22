import { EMPLOYEE_BASE_URL } from "../employee";

// Fetches menu data for cashier interface and returns it
export default async function fetchMenu() {
  try {
    const response = await fetch(`${EMPLOYEE_BASE_URL}/menu`, {credentials: 'include'});
    const data = await response.json(); 
    console.log(data);
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}