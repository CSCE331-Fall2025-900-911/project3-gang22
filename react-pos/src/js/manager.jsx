import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./manager-components/navbar.jsx";
import MenuPage from "./manager-pages/menu.jsx";
import EmployeePage from "./manager-pages/employees.jsx";
import InventoryPage from "./manager-pages/inventory.jsx";
import OrdersPage from "./manager-pages/orders.jsx";

export default function Manager() {

  return (
    <div>
      <BrowserRouter>
        <Navbar />       
         <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/sales-trends" element={<div></div>} />
          <Route path="/restock" element={<div></div>} />
          <Route path="/product-usage" element={<div></div>} />
          <Route path="/sales-report" element={<div></div>} />
          <Route path="/x-report" element={<div></div>} />
          <Route path="/z-report" element={<div></div>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}
