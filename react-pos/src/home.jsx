import React from "react";
import { useState } from "react";
import "./styles.css";
import Customer from "./js/customer.jsx"
import Employee from "./js/employee.jsx";
import Manager from "./js/manager.jsx";

export default function Home() {

    const [ currentScreen, setScreen ]= useState();

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

            <div>
                {currentScreen === "Customer" && <Customer />}
                {currentScreen === "Employee" && <Employee />}
                {currentScreen === "Manager" && <Manager />}
            </div>
        </div>
    )
}