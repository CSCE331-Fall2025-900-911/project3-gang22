import { useEffect } from "react";
import "../styles.css"
import { API_BASE } from "./apibase";

//If user is not authorized after validation is done, display button to navigate to google auth.
export default function Login({ validatingUser, setCurrentUser }) {

    const GUEST_CREDENTIALS = { authenticated: true, user: { id: 999, email: '', role: 'customer', display_name: 'Guest' } }

    if (validatingUser) return <div className="page-container-alt"><img src="/images/loading.gif" alt="Loading" /></div>

    return (
        <div className="login-page">
            <div className="login-width-constraint">

                <h1 >Log In?</h1>
                <div style={{height: '8px'}}></div>
                <button className="nav-btn" onClick={() => window.location.href = `${API_BASE}/auth/google`}>With Google</button>
                <div style={{height: '16px'}}></div>
                <button className="nav-btn " onClick={() => setCurrentUser(GUEST_CREDENTIALS)}>Continue as Guest</button>
            </div>
        </div>
    )
}