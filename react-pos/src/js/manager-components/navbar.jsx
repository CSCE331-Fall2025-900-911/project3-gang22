import React from "react";
import ManagerDashboard from "../manager";
import fetchMenu from "../manager-pages/menu";
import fetchEmployees from "../manager-pages/employees";
import fetchInventory from "../manager-pages/inventory";
import fetchOrders from "../manager-pages/orders";
import Table from "./table";
import Chart from "./chart"
import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import "../../styles.css"


export default function Navbar() {

    const MENU_HEADERS = [
        { display: "Menu ID", key: "id" },
        { display: "Drink Name", key: "drink_name" },
        { display: "Price", key: "price" },
        { display: "Category", key: 'category'},
        { display: "Image", key: "picture_url" }
    ];

    const EMPLOYEE_HEADERS = [
        { display: "Employee ID", key: "id" },
        { display: "Name", key: "name" },
        { display: "Role", key: "role" },
        { display: "Schedule", key: 'schedule'},
    ];

    const INVENTORY_HEADERS = [
        { display: "Item ID", key: "id" },
        { display: "Item Name", key: "name" },
        { display: "Unit", key: "unit" },
        { display: "Quantity", key: 'quantity'},
        { display: "Reorder Threshold", key: 'reorder_threshold'},
    ];

    const ORDER_HEADERS = [
        { display: "Order ID", key: "id" },
        { display: "Subtotal", key: "subtotal" },
        { display: "Tax", key: "tax" },
        { display: "Total", key: "total"},
        { display: "Order Time", key: "order_time"},
    ];

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
    const [date, setDate] = useState("10-25-2024")

    useEffect(() => {
        async function loadMenuOnStart() {
        const data = await fetchMenu();
        setTableItems(data); 
        setTableHeaders(MENU_HEADERS);
            
        }
        loadMenuOnStart();
    }, [])


    const handleMenuClick = async () => {
        const data = await fetchMenu();
        setTableItems(data);
        setTableHeaders(MENU_HEADERS);
    }

    const handleEmployeesClick = async () => {
        const data = await fetchEmployees();
        setTableItems(data);
        setTableHeaders(EMPLOYEE_HEADERS);

    }

    const handleInventoryClick = async () => {
        const data = await fetchInventory();
        setTableItems(data);
        setTableHeaders(INVENTORY_HEADERS);
    }

    const handleOrdersClick = async () => {
        const data = await fetchOrders(date);
        setTableItems(data);
        setTableHeaders(ORDER_HEADERS);
    }

    const handleSalesClick = async () => {
        const data = await fetchSales(date);
        setTableItems(data);
        setTableHeaders(SALES_HEADERS);
    }


    return (
        <div className="page-container">
            <nav className="navbar">
                <button className="nav-btn" onClick={() => { navigate("/menu"); setShowChart(false); handleMenuClick()}}>Menu</button>
                <button className="nav-btn" onClick={() => { navigate("/employees"); setShowChart(false); handleEmployeesClick()}}>Employees</button>
                <button className="nav-btn" onClick={() => { navigate("/inventory"); setShowChart(false); handleInventoryClick()}}>Inventory</button>
                <button className="nav-btn" onClick={() => { navigate("/orders"); setShowChart(false); handleOrdersClick()}}>Orders</button>            
                <button className="nav-btn" onClick={() => { navigate("/sales-trends"); setShowChart(true);}}>Sales Trends</button>
                <button className="nav-btn" onClick={() => { navigate("/restock"); setShowChart(false);}}>Restock</button>
                <button className="nav-btn" onClick={() => { navigate("/product-usage"); setShowChart(true);}}>Product Usage</button>
                <button className="nav-btn" onClick={() => { navigate("/sales-report"); setShowChart(true);}}>Sales Report</button>
                <button className="nav-btn" onClick={() => { navigate("/x-report"); setShowChart(true);}}>X-Report</button>
                <button className="nav-btn" onClick={() => { navigate("/z-report"); setShowChart(true);}}>Z-Report</button>
            </nav>

            <Table headers={tableHeaders} data={tableItems}/>

            {showChart && <Chart xaxis="stuff" yaxis="value" data={chartData} showChart />}
        </div>
    )
}
