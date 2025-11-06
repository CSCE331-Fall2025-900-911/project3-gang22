import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <button className="nav-btn" onClick={() => navigate("/menu")}>Menu</button>
            <button className="nav-btn" onClick={() => navigate("/employees")}>Employees</button>
            <button className="nav-btn" onClick={() => navigate("/inventory")}>Inventory</button>
            <button className="nav-btn" onClick={() => navigate("/orders")}>Orders</button>            
            <button className="nav-btn" onClick={() => navigate("/sales-trends")}>Sales Trends</button>
            <button className="nav-btn" onClick={() => navigate("/restock")}>Restock</button>
            <button className="nav-btn" onClick={() => navigate("/product-usage")}>Product Usage</button>
            <button className="nav-btn" onClick={() => navigate("/sales-report")}>Sales Report</button>
            <button className="nav-btn" onClick={() => navigate("/x-report")}>X-Report</button>
            <button className="nav-btn" onClick={() => navigate("/z-report")}>Z-Report</button>
        </nav>
    )
}
