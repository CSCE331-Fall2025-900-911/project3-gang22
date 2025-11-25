import { useEffect } from "react";
import "../styles.css"

export default function Login({setAuthentication}) {

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("http://localhost:3000/auth/me", {credentials: "include"});
                const data = await response.json();
                setAuthentication(data.authenticated);
                console.log(data);
            
            }
            catch (err) {
                console.error("Error validating authentication", err);
            }
        }
        checkAuth();
    }, []);

    return (
        <div className="page-container">
            <div>Log In</div>
            <button className="btn" onClick={() => window.location.href = "http://localhost:3000/auth/google"}>Log In</button>
        </div>
    )
}