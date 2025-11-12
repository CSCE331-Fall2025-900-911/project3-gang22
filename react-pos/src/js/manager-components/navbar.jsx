// react-pos/src/js/manager-components/navbar.jsx
import React, { useEffect, useState } from "react";
import {
    loadMenu as apiLoadMenu,               // still used for error test/reset if you want
    loadEmployees as apiLoadEmployees,
    loadInventory as apiLoadInventory,
    loadOrdersByDate as apiLoadOrdersByDate,
} from "../api";
import Table from "./table";
import Chart from "./chart";
import "../../styles.css";
import ManagerMenuEditor from "../manager-pages/ManagerMenuEditor";

const EMPLOYEE_HEADERS = [
    { display: "Employee ID", key: "id" },
    { display: "Name", key: "name" },
    { display: "Role", key: "role" },
    { display: "Schedule", key: "schedule" },
];

const INVENTORY_HEADERS = [
    { display: "Item ID", key: "id" },
    { display: "Item Name", key: "name" },
    { display: "Unit", key: "unit" },
    { display: "Quantity", key: "quantity" },
    { display: "Reorder Threshold", key: "reorder_threshold" },
];

const ORDER_HEADERS = [
    { display: "Order ID", key: "id" },
    { display: "Subtotal", key: "subtotal" },
    { display: "Tax", key: "tax" },
    { display: "Total", key: "total" },
    { display: "Order Time", key: "order_time" },
];

export default function Navbar() {
    const [tab, setTab] = useState("menu");
    const [headers, setHeaders] = useState([]);
    const [rows, setRows] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [date, setDate] = useState("10-25-2024");
    const [error, setError] = useState("");

    // Default to Menu without touching the URL/router
    useEffect(() => {
        setTab("menu");
    }, []);

    async function handleMenu() {
        // We render ManagerMenuEditor for this tab; optional ping below just to surface auth/CORS errors quickly
        try {
            setError("");
            await apiLoadMenu(); // quick health check; not used for rendering
        } catch (e) {
            setError(e.message || "Failed to load menu");
        }
        setTab("menu");
        setRows([]);
        setHeaders([]);
    }

    async function handleEmployees() {
        try {
            setError("");
            const data = await apiLoadEmployees();
            setRows(data);
            setHeaders(EMPLOYEE_HEADERS);
            setTab("employees");
        } catch (e) {
            setError(e.message || "Failed to load employees");
            setRows([]);
        }
    }

    async function handleInventory() {
        try {
            setError("");
            const data = await apiLoadInventory();
            setRows(data);
            setHeaders(INVENTORY_HEADERS);
            setTab("inventory");
        } catch (e) {
            setError(e.message || "Failed to load inventory");
            setRows([]);
        }
    }

    async function handleOrders() {
        try {
            setError("");
            const data = await apiLoadOrdersByDate(date);
            setRows(data);
            setHeaders(ORDER_HEADERS);
            setTab("orders");
        } catch (e) {
            setError(e.message || "Failed to load orders");
            setRows([]);
        }
    }

    function showChartTab(kind) {
        setError("");
        setChartData([]); // wire real series later
        setTab(kind);
    }

    return (
        <div className="page-container">
            <nav className="navbar">
                <button className="nav-btn" onClick={handleMenu}>Menu</button>
                <button className="nav-btn" onClick={handleEmployees}>Employees</button>
                <button className="nav-btn" onClick={handleInventory}>Inventory</button>

                <div className="flex items-center gap-2">
                    <button className="nav-btn" onClick={handleOrders}>Orders</button>
                    <input
                        aria-label="Orders date"
                        className="border p-1 rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ width: 110 }}
                    />
                </div>

                <button className="nav-btn" onClick={() => showChartTab("sales-trends")}>Sales Trends</button>
                <button className="nav-btn" onClick={() => showChartTab("restock")}>Restock</button>
                <button className="nav-btn" onClick={() => showChartTab("product-usage")}>Product Usage</button>
                <button className="nav-btn" onClick={() => showChartTab("sales-report")}>Sales Report</button>
                <button className="nav-btn" onClick={() => showChartTab("x-report")}>X-Report</button>
                <button className="nav-btn" onClick={() => showChartTab("z-report")}>Z-Report</button>
            </nav>

            {error && <div style={{ color: "crimson", marginTop: 8 }}>Error: {error}</div>}

            {/* Menu uses the editable manager component */}
            {tab === "menu" && <ManagerMenuEditor />}

            {/* Other data tables */}
            {(tab === "employees" || tab === "inventory" || tab === "orders") && (
                <Table headers={headers} data={rows} />
            )}

            {/* Simple chart placeholders */}
            {tab === "sales-trends" && <Chart xaxis="Date" yaxis="Sales" data={chartData} />}
            {tab === "restock" && <p>Restock view coming soon.</p>}
            {tab === "product-usage" && <Chart xaxis="Product" yaxis="Usage" data={chartData} />}
            {tab === "sales-report" && <Chart xaxis="Date" yaxis="Revenue" data={chartData} />}
            {tab === "x-report" && <Chart xaxis="Date" yaxis="X Report" data={chartData} />}
            {tab === "z-report" && <Chart xaxis="Date" yaxis="Z Report" data={chartData} />}
        </div>
    );
}
