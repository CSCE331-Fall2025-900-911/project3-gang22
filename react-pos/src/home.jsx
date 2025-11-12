import React, { useState } from "react";
import "./styles.css";
import Customer from "./js/customer.jsx";
import Employee from "./js/employee.jsx";
import Manager from "./js/manager.jsx";
import { LoginButton } from "./js/LoginButton.jsx";
import { useSession } from "./js/useSession.js";

export default function Home() {
    const [screen, setScreen] = useState();
    const { loading, authenticated, user } = useSession();

    // route switching
    if (screen === "Customer") return <Customer />;
    if (screen === "Employee") return <Employee />;
    if (screen === "Manager") return <Manager />;

    const role = user?.role; // 'customer' | 'cashier' | 'manager'

    const canUseCashier = authenticated && (role === "cashier" || role === "manager");
    const canUseManager = authenticated && role === "manager";

    return (
        <div>
            <main className="wrap">
                <h1>Bubble Tea POS</h1>

                {/* Auth status / login */}
                <div style={{ marginBottom: 12 }}>
                    {loading ? (
                        <span>Checking session…</span>
                    ) : authenticated ? (
                        <span>Signed in as {user.email} ({role})</span>
                    ) : (
                        <LoginButton />
                    )}
                </div>

                <nav className="nav">
                    {/* Customer: always allowed */}
                    <button className="nav-btn" onClick={() => setScreen("Customer")}>
                        Customer Kiosk
                    </button>

                    {/* Cashier: needs cashier or manager */}
                    <button
                        className="nav-btn"
                        onClick={() => canUseCashier ? setScreen("Employee") : null}
                        disabled={!canUseCashier}
                        title={!canUseCashier ? "Login as cashier or manager" : ""}
                    >
                        Cashier POS
                    </button>

                    {/* Manager: needs manager */}
                    <button
                        className="nav-btn"
                        onClick={() => canUseManager ? setScreen("Manager") : null}
                        disabled={!canUseManager}
                        title={!canUseManager ? "Manager login required" : ""}
                    >
                        Manager Dashboard
                    </button>
                </nav>
            </main>
        </div>
    );
}
