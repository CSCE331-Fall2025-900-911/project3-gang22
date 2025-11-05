import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./manager-components/navbar.js";

function ManagerDashboard() {
  return (
    <BrowserRouter>
      <Navbar />
      <h1>Manager Dashboard</h1>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<ManagerDashboard />);
