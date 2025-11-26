import { useEffect } from "react";
import "../styles.css"
import { API_BASE } from "./apibase";

export default function Login({validatingUser}) {

    if (validatingUser) return <div className="page-container-alt"><img src="/images/loading.gif" alt="Loading"/></div>

    return (
        <div className="login-page">
            <div>Log In</div>
            <button className="btn" onClick={() => window.location.href = `${API_BASE}/auth/google`}>Log In</button>
        </div>
    )
}