export default async function fetchMenu() {
  try {
    const response = await fetch("https://project3-gang22-backend.onrender.com/api/employees/menu");
    const data = await response.json(); 
    console.log(data);
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}