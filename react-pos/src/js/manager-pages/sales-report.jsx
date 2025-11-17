import { useEffect, useState } from "react";
import Table from "../manager-components/table";
import Navbar from "../manager-components/navbar.jsx";
import Chart from "../manager-components/chart.jsx";
import DatePicker from "../manager-components/datepicker.jsx";

export default function SalesReportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interval, setInterval] = useState("");
  const [ salesReportItems , setSalesReportItems ] = useState([]);

    const SALES_REPORT_HEADERS = [
      { display: "Order ID", key: "id" },
      { display: "Subtotal", key: "subtotal" },
      { display: "Tax", key: "tax" },
      { display: "Total", key: "total"},
      { display: "Order Time", key: "order_time"},
    ];


  // Determine interval based on date range
  useEffect(() => {
    if (startDate && endDate && new Date(endDate) >= new Date(startDate)) {
      const conversion = 1000 * 60 * 60 * 24;
      const daysBetween = (new Date(endDate) - new Date(startDate)) / conversion;

      if (daysBetween < 7) setInterval("Hour");
      else if (daysBetween < 31) setInterval("Day");
      else if (daysBetween < 180) setInterval("Week");
      else setInterval("Month");
    } else {
      setInterval("");
    }
  }, [startDate, endDate]);

  // Fetches sales report data from backend when component is mounted and stores it for use inside the table
  useEffect(() => {
    if (startDate && endDate && interval) {
      getSalesReport(startDate, endDate, interval)
    }
  }, [startDate, endDate, interval]); 
  
  async function getSalesReport(start, end, interval) {
    try {
      const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/sales-report?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&interval=${encodeURIComponent(interval)}`);
      const data = await response.json();
      setSalesReportItems(data);                           
    } catch (err) {
      console.error("Error fetching sales report:", err);
    }
  }

  // Returns table containing stored sales report data
  return (
    <>
      <h2>Sales Report</h2>

      {/* Filter Bar */}
      <div style={{display: "flex"}}>
        <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
        <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
        <div>
          <label>Interval</label>
          <span>{interval || "—"}</span>
        </div>
      </div>

      {/* Chart and Table */}
      <Chart xaxis="order_time" yaxis="total" data={salesReportItems} />
      <Table headers={SALES_REPORT_HEADERS} data={salesReportItems} />
    </>
  );
}

