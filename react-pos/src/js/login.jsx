import { useEffect } from "react";
import "../styles.css"
import { API_BASE } from "./apibase";

export default function Login({setCurrentUser}) {


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
        }
        checkAuth();
    }, []);

    return (
        <div className="login-page">
            <div>Log In</div>
            <button className="btn" onClick={() => window.location.href = `${API_BASE}/auth/google`}>Log In</button>
        </div>
    )
}