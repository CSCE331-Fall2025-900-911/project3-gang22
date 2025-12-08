import React, { useState, useEffect } from "react";
import DatePicker from "../manager-components/datepicker.jsx";
import Chart from "../manager-components/chart.jsx";
import Table from "../manager-components/table.jsx";
import RangeDateToolBar from "../manager-components/range-datepicker.jsx"
import { MANAGER_BASE_URL } from "../manager.jsx";

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
      let dateFormat;
      switch (range) {
        case "day":
          dateFormat = "HH24"; // hourly
          break;
        case "week":
          dateFormat = "Dy"; // daily by weekday
          break;
        case "month":
          dateFormat = "DD"; // daily by day of month
          break;
        case "year":
          dateFormat = "Mon"; // monthly
          break;
        default:
          dateFormat = "YYYY-MM-DD"; // fallback
      }
      const response = await fetch(`${MANAGER_BASE_URL}/x_report?range=${encodeURIComponent(range)}&dateStr=${encodeURIComponent(date)}&dateFormat=${encodeURIComponent(dateFormat)}`, {credentials: 'include'});
      const data = await response.json();
      setSalesData(data);
    } catch (err) {
      console.error("Error fetching sales data:", err);
    }
  }

  // Get data for the Order table
  async function getOrderData(range, date) {
    try {
      const response = await fetch(`${MANAGER_BASE_URL}/orders?date=${encodeURIComponent(date)}`, {credentials: 'include'});
      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      console.error("Error fetching order data:", err);
    }
  }

  // FIXME: Do we add the clickable pop-up window for more order information details?
  return (
    <div style={{ marginLeft: "20px"}}>
      <h2>Order Trends</h2>

      {/*Range and Date Selection*/}
      <RangeDateToolBar selectedDate={selectedDate} setSelectedDate={setSelectedDate} viewRange={viewRange} setViewRange={setViewRange}/>


      {/* Chart + Side Table */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          <Chart xaxis="label" yaxis="total_sales" data={salesData} />
        </div>
        <div style={{ flex: 1 }}>
          <Table headers={SALES_TRENDS_HEADERS} data={salesData} />
        </div>
      </div>

      {/* Order History Table */}
      <h3 style={{ marginTop: "2rem" }}>Order History</h3>
      <Table headers={ORDER_HEADERS} data={orderData} />
    </div>
  );
  
}