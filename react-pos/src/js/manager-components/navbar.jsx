import React from "react";
import Chart from "./chart"
import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import "../../styles.css"


export default function Navbar() {

    const SALES_HEADERS = [
        { display: "Order ID", key: "id" },
        { display: "Subtotal", key: "subtotal" },
        { display: "Tax", key: "tax" },
        { display: "Total", key: "total"},
        { display: "Order Time", key: "order_time"},
    ];

    const navigate = useNavigate();
    const [showChart, setShowChart] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableItems, setTableItems] = useState([]);
    
    const handleSalesClick = async () => {
        const data = await fetchSales(date);
        setTableItems(data);
        setTableHeaders(SALES_HEADERS);
    }


    return (
        <div className="page-container">
            <nav className="navbar">
                <button className="nav-btn" onClick={() => { window.location.pathname = '/'; }}>Back to Home</button>
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

            {/* <Table headers={tableHeaders} data={tableItems}/> */}

            {showChart && <Chart xaxis="stuff" yaxis="value" data={chartData} showChart />}
        </div>
    )
}
