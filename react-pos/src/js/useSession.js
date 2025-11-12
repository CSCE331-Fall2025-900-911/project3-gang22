import { useEffect, useState } from 'react';
const API = import.meta.env.VITE_API_URL || '';

export function useSession() {
    const [state, set] = useState({ loading: true, authenticated: false, user: null });
    useEffect(() => {
        fetch(`${API}/auth/me`, { credentials: 'include' })
            .then(r => r.json()).then(d => set({ loading: false, ...d }))
            .catch(() => set({ loading: false, authenticated: false, user: null }));
    }, []);
    return state;
}
