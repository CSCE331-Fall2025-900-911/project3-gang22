import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./manager-components/navbar.js";

function ManagerDashboard() {
  return (
    <div>
      <p style={{ color: "red" }}>test test</p>
      <Navbar />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<ManagerDashboard />);
