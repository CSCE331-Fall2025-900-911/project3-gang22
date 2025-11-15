import { useEffect, useState } from "react";
import Table from "../manager-components/table";

export default function InventoryPage() {

  const [ inventoryItems , setInventoryItems ] = useState([]);

  
    const INVENTORY_HEADERS = [
      { display: "Item ID", key: "id" },
      { display: "Item Name", key: "name" },
      { display: "Unit", key: "unit" },
      { display: "Quantity", key: 'quantity'},
      { display: "Reorder Threshold", key: 'reorder_threshold'},
    ];

  // Fetches inventory data from backend when component is mounted and stores it for use inside the table
  useEffect(() => {
    async function getInventory() {
      try {
        const response = await fetch("https://project3-gang22-backend.onrender.com/api/managers/inventory");
        const data = await response.json(); 
        setInventoryItems(data);                           
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    }
    getInventory();
  }, []); 

  // Returns table containing stored inventory data
  return (
    <Table headers={INVENTORY_HEADERS} data={inventoryItems} />
  )
}