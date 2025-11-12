import { useEffect, useState } from "react";
import Table from "../manager-components/table";

export default function OrdersPage() {

  const [ orderItems , setOrderItems ] = useState([]);
  const [date, setDate] = useState("10-25-2024")


    const ORDER_HEADERS = [
      { display: "Order ID", key: "id" },
      { display: "Subtotal", key: "subtotal" },
      { display: "Tax", key: "tax" },
      { display: "Total", key: "total"},
      { display: "Order Time", key: "order_time"},
    ];

    useEffect(() => {
      async function getOrders() {
        try {
          const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/orders?date=${encodeURIComponent(date)}`);
          const data = await response.json()
          setOrderItems(data);                           
        } catch (err) {
          console.error("Error fetching menu:", err);
        }
      }
      getOrders();
    }, []); 

  return (
    <Table headers={ORDER_HEADERS} data={orderItems} />
  )
}