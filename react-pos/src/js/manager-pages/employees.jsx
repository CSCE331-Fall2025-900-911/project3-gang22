export default async function fetchEmployees() {
  try {
    const response = await fetch("https://project3-gang22-backend.onrender.com/api/managers/employee");
    const data = await response.json();
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}