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

  return (
    <Table headers={INVENTORY_HEADERS} data={inventoryItems} />
  )
}