import React from "react";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import "../../styles.css";


export default function MenuPage({darkMode}) {

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
      const response = await fetch("https://project3-gang22-backend.onrender.com/api/managers/menu");
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
    <div className="page-content-container">
       <div className="header-row">
        {MENU_HEADERS.map((header) => (
          <p key={header.key}>{header.display}</p>
        ))}
      </div>
      <Virtuoso
        data={menuItems}
        itemContent={(index, item) => (
          <div className="grid-row">
            <p>{item.id}</p>
            <p>{item.drink_name}</p>
            <p>{item.price}</p>
            <p>{item.category}</p>
            <p>{item.picture_url}</p>
          </div>
        )}
      />
    </div>
  )
}