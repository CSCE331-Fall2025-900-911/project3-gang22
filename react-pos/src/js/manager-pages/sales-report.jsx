import { useEffect, useState } from "react";
import Table from "../manager-components/table";
import Navbar from "../manager-components/navbar.jsx";
import Chart from "../manager-components/chart.jsx";
import DatePicker from "../manager-components/datepicker.jsx";
import { MANAGER_BASE_URL } from "../manager";
import VirtuosoTable from "../manager-components/tableVirtuoso.jsx";

export default function SalesReportPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interval, setInterval] = useState("");
  const [salesReportItems , setSalesReportItems ] = useState([]);
  const [yaxis, setYaxis] = useState("total_sales");
  const [loading, setLoading] = useState(false);
  const [drinkFilter, setDrinkFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

  const yLabel = (yaxis === "total_sales") ? "Revenue ($)" : "Quantity Sold";

    const SALES_REPORT_HEADERS = [
      { display: "Drink", key: "drink_name" },
      { display: "Time", key: "time_label" },
      { display: "Quantity Sold", key: "total_qty" },
      { display: "Total Sales", key: "total_sales" },
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
    setLoading(true);
    try {
      const url = `${MANAGER_BASE_URL}/order_report?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&interval=${encodeURIComponent(interval.toLowerCase())}`;
      const response = await fetch(url, {credentials: 'include'});
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSalesReportItems(data);
      } else {
        console.error("Unexpected response format:", data);
        setSalesReportItems([]); // fallback to empty array
      }                           
    } catch (err) {
      console.error("Error fetching sales report:", err);
      setSalesReportItems([]); // prevent crash in Chart/Table
    } finally {
      setLoading(false);
    }
  }

  // Transform data before passing to Chart (by grouping drinks by time)
  const aggregatedData = salesReportItems.reduce((acc, item) => {
    const key = item.time_label;
    if (!acc[key]) {
      acc[key] = { time_label: key, total_qty: 0, total_sales: 0 };
    }
    acc[key].total_qty += Number(item.total_qty);
    acc[key].total_sales += Number(item.total_sales);
    return acc;
  }, {});
  const chartData = Object.values(aggregatedData);

  // Filter table data
  const filteredData = salesReportItems.filter(item => {
    const matchesDrink = drinkFilter ? item.drink_name === drinkFilter : true;
    const matchesTime = timeFilter ? item.time_label === timeFilter : true;
    return matchesDrink && matchesTime;
  });

  return (
    <div style={{ marginLeft: "20px"}}>
      <h2>Sales Report</h2>

      <div style={{ width: "1000px", margin: "0 auto" }}>      
        {/* Filter Bar */}
        <div style={{display: "flex", gap:"1rem", justifyContent: "flex-start"}}>
          <DatePicker label="Start Date: " value={startDate} onChange={setStartDate} />
          <DatePicker label="End Date: " value={endDate} onChange={setEndDate} />
          <div>
            <label>Interval: </label>
            <span>{interval || "—"}</span>
          </div>
          <select value={yaxis} onChange={(e) => setYaxis(e.target.value)}>
            <option value="total_sales">Revenue ($)</option>
            <option value="total_qty">Quantity Sold</option>
          </select>
        </div>

        {/* Loading Indicator */}
        {loading && <p>Loading sales report...</p>}

        {/* Chart */}
        <Chart xaxis="time_label" yaxis={yaxis} data={chartData} xLabel="Time" yLabel={yLabel} width={1000} height={300} />
      </div>

      {/* Table filter*/}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div>
          <label>Filter by Drink: </label>
          <select value={drinkFilter} onChange={(e) => setDrinkFilter(e.target.value)}>
            <option value="">All</option>
            {[...new Set(salesReportItems.map(item => item.drink_name))].map(drink => (
              <option key={drink} value={drink}>{drink}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Time: </label>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="">All</option>
            {[...new Set(salesReportItems.map(item => item.time_label))].map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <VirtuosoTable headers={SALES_REPORT_HEADERS} data={filteredData} height={400} />
    </div>
  );
}

