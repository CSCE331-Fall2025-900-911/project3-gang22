export default async function fetchSalesReport(dateFmt, range, dateStr) {
  try {
    const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/sales-report?dateFmt=${dateFmt}&range=${range}&dateStr=${dateStr}`);
    const data = await response.json()
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}