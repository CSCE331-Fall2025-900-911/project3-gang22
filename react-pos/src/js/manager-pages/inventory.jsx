import React from "react";
import { useEffect } from "react";

export default async function fetchInventory() {
  try {
    const response = await fetch("https://project3-gang22-backend.onrender.com/api/managers/inventory");
    const data = await response.json(); 
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}