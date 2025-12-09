import React, { useState, useEffect } from "react";
import DatePicker from "../manager-components/datepicker.jsx";
import Chart from "../manager-components/chart.jsx";
import Table from "../manager-components/table.jsx";
import VirtuosoTable from "../manager-components/tableVirtuoso.jsx";
import OrderItemsDialog from "../manager-components/orderItemsDialog.jsx";
import RangeDateToolBar from "../manager-components/range-datepicker.jsx"
import { MANAGER_BASE_URL } from "../manager.jsx";

export default function SalesTrendsPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [viewRange, setViewRange] = useState("day");
  const [salesData, setSalesData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [xLabel, setXLabel] = useState("Hour of Day");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const SALES_TRENDS_HEADERS = [
      { display: xLabel, key: "label" },
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
    async function fetchData() {
      if (selectedDate && viewRange) {
        setLoading(true);
        try{
          await Promise.all([
            getSalesData(viewRange, selectedDate),
            getOrderData(viewRange, selectedDate)
          ]);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }        
      }
    }
    fetchData();
  }, [selectedDate, viewRange]);

  // Get data for the chart and table
  async function getSalesData(range, date) {
    try {
      let dateFormat;
      switch (range) {
        case "day":
          dateFormat = "HH24"; // hourly
          setXLabel("Hour of Day");
          break;
        case "week":
          dateFormat = "Dy"; // daily by weekday
          setXLabel("Day of Week");
          break;
        case "month":
          dateFormat = "DD"; // daily by day of month
          setXLabel("Day of Month");
          break;
        case "year":
          dateFormat = "Mon"; // monthly
          setXLabel("Month");
          break;
        default:
          dateFormat = "YYYY-MM-DD"; // fallback
          setXLabel("Date");
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

  // Get order items data by orderID
  async function getOrderItems(orderId) {
    try {
      const response = await fetch(`${MANAGER_BASE_URL}/order_items?id=${orderId}`, { credentials: 'include' });
      const data = await response.json();
      setOrderItems(data);
    } catch (err) {
      console.error("Error fetching order items:", err);
    }
  }

  return (
    <div style={{ marginLeft: "20px"}}>
      <h2>Order Trends</h2>

      {/*Range and Date Selection*/}
      <RangeDateToolBar selectedDate={selectedDate} setSelectedDate={setSelectedDate} viewRange={viewRange} setViewRange={setViewRange}/>

      {/* Optional Loading Indicator */}
      {loading && <p>Loading orders...</p>}

      {/* Chart + Side Table */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <Chart xaxis="label" yaxis="total_sales" data={salesData} xLabel={xLabel} yLabel="Total Sales ($)" />
        </div>
        <div style={{ flex: 1 }}>
          <VirtuosoTable headers={SALES_TRENDS_HEADERS} data={salesData} height={250} />
        </div>
      </div>

      {/* Order History Table */}
      <h3 style={{ marginTop: "2rem" }}>Order History</h3>
      <VirtuosoTable headers={ORDER_HEADERS} data={orderData} height={400} 
        onRowDoubleClick={(order) => {
          setSelectedOrder(order);
          getOrderItems(order.id); // fetch details for modal
        }}
      />

      {/* Dialog pop-up (for ider items)*/}
      <OrderItemsDialog
        order={selectedOrder}
        items={orderItems}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
  
}