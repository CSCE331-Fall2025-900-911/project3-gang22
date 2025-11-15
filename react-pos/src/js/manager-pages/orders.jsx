import { useEffect, useState } from "react";
import Table from "../manager-components/table";

export default function OrdersPage() {

  const [ orderItems , setOrderItems ] = useState([]);
  const [ date , setDate] = useState("10-25-2024");
  const [loading, setLoading] = useState(false);


    const ORDER_HEADERS = [
      { display: "Order ID", key: "id" },
      { display: "Subtotal", key: "subtotal" },
      { display: "Tax", key: "tax" },
      { display: "Total", key: "total"},
      { display: "Order Time", key: "order_time"},
    ];

  // Fetches order data from backend when component is mounted and stores it for use inside the table
  useEffect(() => {
    async function getOrders() {
      setLoading(true);
      try {
        const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/orders?date=${encodeURIComponent(date)}`);
        const data = await response.json()
        setOrderItems(data);                           
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    }
    getOrders();
  }, [date]); 

  // Returns table containing stored order data
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Orders by Date</h2>

      {/* Date Picker */}
      <label>
        Select Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      {/* Optional Loading Indicator */}
      {loading && <p>Loading orders...</p>}

      {/* Orders Table */}
      <Table headers={ORDER_HEADERS} data={orderItems} />
    </div>
  );
}