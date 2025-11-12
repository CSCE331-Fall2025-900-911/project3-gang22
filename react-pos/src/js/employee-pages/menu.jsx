const API_BASE = 'https://project3-gang22-backend.onrender.com';

export default async function fetchMenu() {
    const res = await fetch(`${API_BASE}/api/employees/menu`, {
        headers: { Accept: 'application/json' }
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${txt.slice(0,200)}`);
    }

    return res.json();
}
