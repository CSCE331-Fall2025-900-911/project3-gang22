import { useEffect, useState } from "react";
import Table from "../manager-components/table";
import { MANAGER_BASE_URL } from "../manager";

export default function MenuPage() {

  const [ menuItems , setMenuItems ] = useState([]);

  const MENU_HEADERS = [
      { display: "Menu ID", key: "id" },
      { display: "Drink Name", key: "drink_name" },
      { display: "Price", key: "price" },
      { display: "Category", key: 'category'},
      { display: "Image", key: "picture_url" }
  ];

  // Fetches menu data from backend when component is mounted and stores it for use inside the table
  useEffect(() => {
    async function getMenu() {
      try {
      const response = await fetch(`${MANAGER_BASE_URL}/menu`);
      const data = await response.json(); 
      setMenuItems(data);                           
      } catch (err) {
      console.error("Error fetching menu:", err);
      }
    }
    getMenu();
  }, []); 

  // Returns table containing stored menu data
  return (
    <Table headers={MENU_HEADERS} data={menuItems} />
  )
}