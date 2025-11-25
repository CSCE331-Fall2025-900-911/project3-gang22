import React from "react";
import { useState } from "react";
import "./styles.css";
import Login from "./js/login.jsx";
import Customer from "./js/customer.jsx"
import Employee from "./js/employee.jsx";
import Manager from "./js/manager.jsx";

export default function Home() {

    const [ currentScreen, setScreen ] = useState();
    const [ authenticated, setAuthentication ] = useState(false);

    if (authenticated === false) return <Login setAuthentication={setAuthentication}/>
    if (currentScreen === "Customer") return <Customer />;
    if (currentScreen === "Employee") return <Employee />;
    if (currentScreen === "Manager") return <Manager />;

    return (
        <div>
            <main className="wrap">
                <h1>Bubble Tea POS</h1>
                <nav className="nav">
                <button className="nav-btn" onClick={() => setScreen("Customer")}>Customer Kiosk</button>
                <button className="nav-btn" onClick={() => setScreen("Employee")}>Cashier POS</button>
                <button className="nav-btn" onClick={() => setScreen("Manager")}>Manager Dashboard</button>
                </nav>
            </main>
        </div>
    )
}