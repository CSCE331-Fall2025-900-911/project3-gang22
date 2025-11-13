import { useEffect, useState } from "react";
import Table from "../manager-components/table";

export default function SalesReportPage() {

  const [ salesReportItems , setSalesReportItems ] = useState([]);
  let interval = "day";

  
    const SALES_REPORT_HEADERS = [
      { display: "Order ID", key: "id" },
      { display: "Subtotal", key: "subtotal" },
      { display: "Tax", key: "tax" },
      { display: "Total", key: "total"},
      { display: "Order Time", key: "order_time"},
    ];

    useEffect(() => {
      async function getSalesReport() {
        try {
         const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/sales-report?interval=${encodeURIComponent(interval)}`);
         const data = await response.json();
         setSalesReportItems(data);                           
        } catch (err) {
          console.error("Error fetching menu:", err);
        }
      }
      getSalesReport();
    }, []); 

  return (
    <Table headers={SALES_REPORT_HEADERS} data={salesReportItems} />
  )
}

