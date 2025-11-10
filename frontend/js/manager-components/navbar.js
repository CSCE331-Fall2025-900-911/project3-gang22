import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

    const navigate = useNavigate();

    return (
        <nav>
            <button onClick={() => navigate("/menu")}>Menu</button>
            <button onClick={() => navigate("/employees")}>Employees</button>
            <button onClick={() => navigate("/inventory")}>Inventory</button>
            <button onClick={() => navigate("/orders")}>Orders</button>            
            <button onClick={() => navigate("/sales-trends")}>Sales Trends</button>
            <button onClick={() => navigate("/restock")}>Restock</button>
            <button onClick={() => navigate("/product-usage")}>Product Usage</button>
            <button onClick={() => navigate("/sales-report")}>Sales Report</button>
            <button onClick={() => navigate("/x-report")}>X-Report</button>
            <button onClick={() => navigate("/z-report")}>Z-Report</button>
        </nav>
    )
}
