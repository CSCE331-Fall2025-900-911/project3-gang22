import React from "react";
import ManagerDashboard from "../manager";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setShowChart }) {

    const navigate = useNavigate();


    return (
        <nav className="navbar">
            <button className="nav-btn" onClick={() => { navigate("/menu"); setShowChart(false);}}>Menu</button>
            <button className="nav-btn" onClick={() => { navigate("/employees"); setShowChart(false);}}>Employees</button>
            <button className="nav-btn" onClick={() => { navigate("/inventory"); setShowChart(false);}}>Inventory</button>
            <button className="nav-btn" onClick={() => { navigate("/orders"); setShowChart(false);}}>Orders</button>            
            <button className="nav-btn" onClick={() => { navigate("/sales-trends"); setShowChart(true);}}>Sales Trends</button>
            <button className="nav-btn" onClick={() => { navigate("/restock"); setShowChart(false);}}>Restock</button>
            <button className="nav-btn" onClick={() => { navigate("/product-usage"); setShowChart(true);}}>Product Usage</button>
            <button className="nav-btn" onClick={() => { navigate("/sales-report"); setShowChart(true);}}>Sales Report</button>
            <button className="nav-btn" onClick={() => { navigate("/x-report"); setShowChart(true);}}>X-Report</button>
            <button className="nav-btn" onClick={() => { navigate("/z-report"); setShowChart(true);}}>Z-Report</button>
        </nav>
    )
}
