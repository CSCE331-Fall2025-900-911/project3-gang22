import { useEffect, useState } from "react";
import Table from "../manager-components/table";

export default function MenuPage() {

  const [ menuItems , setMenuItems ] = useState([]);

  const MENU_HEADERS = [
      { display: "Menu ID", key: "id" },
      { display: "Drink Name", key: "drink_name" },
      { display: "Price", key: "price" },
      { display: "Category", key: 'category'},
      { display: "Image", key: "picture_url" }
  ];

  useEffect(() => {
    async function getMenu() {
      try {
      const response = await fetch("https://project3-gang22-backend.onrender.com/api/managers/menu");
      const data = await response.json(); 
      setMenuItems(data);                           
      } catch (err) {
      console.error("Error fetching menu:", err);
      }
    }
    getMenu();
  }, []); 

  return (
    <Table headers={MENU_HEADERS} data={menuItems} />
  )
}