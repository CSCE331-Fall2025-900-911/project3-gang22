export default async function fetchOrders(date) {
  try {
    const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/orders?date=${encodeURIComponent(date)}`);
    const data = await response.json()
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}