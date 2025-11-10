import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./manager-components/navbar.jsx";

export default function Manager() {

  return (
    <div>
      <BrowserRouter>
        <Navbar />       
         <Routes>
          <Route path="/menu" element={<div></div>} />
          <Route path="/employees" element={<div></div>} />
          <Route path="/inventory" element={<div></div>} />
          <Route path="/orders" element={<div></div>} />
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
