import React from "react";
import { useEffect } from "react";

export default async function fetchSales(date) {
  try {
    const response = await fetch(`https://project3-gang22-backend.onrender.com/api/managers/sales?date=${encodeURIComponent(date)}`);
    const data = await response.json()
    console.log(data); 
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}