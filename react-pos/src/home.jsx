import React from "react";
import { useState } from "react";
import "./styles.css";
import Login from "./js/login.jsx";
import Customer from "./js/customer.jsx"
import Employee from "./js/employee.jsx";
import Manager from "./js/manager.jsx";

export default function Home() {

    const [ currentScreen, setScreen ] = useState();
    const [ currentUser, setCurrentUser ] = useState(null);

    if (!currentUser || currentUser.authenticated !== true) return <Login setCurrentUser={setCurrentUser}/>
    if (currentScreen === "Customer") return <Customer />;
    if (currentScreen === "Employee" && (currentUser.user.role === "cashier" || currentUser.user.role === "manager")) return <Employee />;
    if (currentScreen === "Manager" && currentUser.user.role === "manager") return <Manager />;

    return (
        <div>
            <main className="wrap">
                <h1>Bubble Tea POS</h1>
                <nav className="nav">
                <button className="nav-btn" onClick={() => setScreen("Customer")}>Customer Kiosk</button>
                {(currentUser.user.role === "cashier" || currentUser.user.role === "manager") && <button className="nav-btn" onClick={() => setScreen("Employee")}>Cashier POS</button>}
                {(currentUser.user.role === "manager") && <button className="nav-btn" onClick={() => setScreen("Manager")}>Manager Dashboard</button>}
                </nav>
            </main>
        </div>
    )
}