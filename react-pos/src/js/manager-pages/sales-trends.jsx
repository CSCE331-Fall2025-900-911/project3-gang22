import React, { useState, useEffect } from "react";
import DatePicker from "../manager-components/datepicker.jsx";
import Chart from "../manager-components/chart.jsx";
import Table from "../manager-components/table.jsx";

export default function SalesTrendsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [viewRange, setViewRange] = useState("day");
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  const SALES_TRENDS_HEADERS = [
      { display: "Label", key: "label" },
      { display: "Total Sales", key: "total_sales" },
  ];
  const ORDER_HEADERS = [
    { display: "ID", key: "id" },
    { display: "Subtotal", key: "subtotal" },
    { display: "Tax", key: "tax" },
    { display: "Total", key: "total" },
    { display: "Order Time", key: "order_time" },
    { display: "Employee ID", key: "employee_id" },
  ];

  useEffect(() => {
    if (selectedDate && viewRange) {
      getSalesData(viewRange, selectedDate);
      getOrderData(viewRange, selectedDate);
    }
  }, [selectedDate, viewRange]);

  // Get data for the chart and table
  async function getSalesData(range, date) {
    try {
      const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/sales-trends?range=${encodeURIComponent(range)}&date=${encodeURIComponent(date)}`);
      const data = await response.json();
      setSalesData(data);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  }

  // Get data for the Order table
  async function getOrderData(range, date) {
    try {
      const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/orders-by-range?range=${encodeURIComponent(range)}&date=${encodeURIComponent(date)}`);
      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      console.error("Error fetching order data:", err);
    }
  }

  
  return (
    <>
      <h2>Sales Trends</h2>

      {/*Range and Date Selection*/}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
        <button onClick={() => setViewRange("day")}>Day</button>
        <button onClick={() => setViewRange("week")}>Week</button>
        <button onClick={() => setViewRange("month")}>Month</button>
        <button onClick={() => setViewRange("year")}>Year</button>
        <DatePicker label="Select Date: " value={selectedDate} onChange={setSelectedDate} />
      </div>

      {/* Chart + Side Table */}
      <Chart xaxis="label" yaxis="total_sales" data={salesData} />
      <Table headers={SALES_TRENDS_HEADERS} data={salesData} />

      {/* Order History Table */}
      <h3 style={{ marginTop: "2rem" }}>Order History</h3>
      <Table headers={ORDER_HEADERS} data={orderData} />
    </>
  );
  
}