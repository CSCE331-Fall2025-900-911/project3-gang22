import React from "react";
import { useEffect } from "react";

async function fetchMenu() {
  try {
    const response = await fetch("/api/menu");
    const data = await response.json();       
    return data;                           
  } catch (err) {
    console.error("Error fetching menu:", err);
    return [];
  }
}