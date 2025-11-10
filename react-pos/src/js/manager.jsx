import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import fetchMenu from "./manager-pages/menu.jsx";
import Navbar from "./manager-components/navbar.jsx";
import Table from "./manager-components/table.jsx";
import Chart from "./manager-components/chart.jsx";

const HEADERS = [
  { display: "Menu ID", key: "id" },
  { display: "Drink Name", key: "name" },
  { display: "Price", key: "price" },
  { display: "Image", key: "image" }
];

const chartData = [
  { stuff: "Mon", value: 400 },
  { stuff: "Tue", value: 300 },
  { stuff: "Wed", value: 500 }
];

export default function ManagerDashboard() {

  const [showTable, setShowTable] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Navbar />       
         <Routes>
          <Route path="/menu" element={<div>Menu Page (stub)</div>} />
          <Route path="/employees" element={<div>Employee Page (stub)</div>} />
          <Route path="/inventory" element={<div>Inventory Page (stub)</div>} />
          <Route path="/orders" element={<div>Order Page (stub)</div>} />
          <Route path="/sales-trends" element={<div>Sales Trends Page (stub)</div>} />
          <Route path="/restock" element={<div>Restock (stub)</div>} />
          <Route path="/product-usage" element={<div>Product Usage Page (stub)</div>} />
          <Route path="/sales-report" element={<div>Sales Report Page (stub)</div>} />
          <Route path="/x-report" element={<div>X-Report Page (stub)</div>} />
          <Route path="/z-report" element={<div>Z-Report Page (stub)</div>} />
        </Routes>

        {/* <Table headers={HEADERS} data={tableItems}/> */}

      </BrowserRouter>

    </div>
  );
}
