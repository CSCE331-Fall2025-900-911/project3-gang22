import { useState, useEffect } from "react";
import "./styles.css";
import Login from "./js/login.jsx";
import Customer from "./js/customer.jsx"
import Employee from "./js/employee.jsx";
import Manager from "./js/manager.jsx";
import { API_BASE } from "./js/apibase.js";

export default function Home() {

    
    const [ currentScreen, setScreen ] = useState();
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ validatingUser, setValidatingUser ] = useState(true);

    useEffect(() => {
            async function checkAuth() {
                try {
                    const response = await fetch(`${API_BASE}/auth/me`, {credentials: "include"});
                    const data = await response.json();
                    setCurrentUser(data);
                    console.log(data);
                }
                catch (err) {
                    console.error("Error validating authentication", err);
                }
                finally {
                    setValidatingUser(false);
                }
            }
            checkAuth();
        }, []);

    if (!currentUser || currentUser.authenticated !== true) return <Login validatingUser={validatingUser} setCurrentUser={setCurrentUser}/>
    if (currentScreen === "Customer" || currentUser.user.display_name === "Guest") return <Customer />;
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
            <button className="logout-btn" onClick={() => (setCurrentUser(null), fetch(`${API_BASE}/auth/logout`, {credentials: "include", method: "POST"}))}>Log Out</button>
        </div>
    )
}