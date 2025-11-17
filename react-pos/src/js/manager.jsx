import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./manager-components/navbar.jsx";
import MenuPage from "./manager-pages/menu.jsx";
import EmployeePage from "./manager-pages/employees.jsx";
import InventoryPage from "./manager-pages/inventory.jsx";
import OrdersPage from "./manager-pages/orders.jsx";
import SalesReportPage from "./manager-pages/sales-report.jsx";
import SalesTrendsPage from "./manager-pages/sales-trends.jsx";
import ProductUsagePage from "./manager-pages/product-usage.jsx";

export default function Manager() {

  // Renders appropriate page when Navbar updates the URL
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
          <Route path="/sales-trends" element={<SalesTrendsPage />} />
          <Route path="/restock" element={<div></div>} />
          <Route path="/product-usage" element={<ProductUsagePage />} />
          <Route path="/sales-report" element={<SalesReportPage />} />
          <Route path="/x-report" element={<div></div>} />
          <Route path="/z-report" element={<div></div>} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}
