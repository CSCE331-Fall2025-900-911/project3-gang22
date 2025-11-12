// react-pos/src/js/api.js

// If you set VITE_API_URL (e.g., https://project3-gang22-backend.onrender.com)
// we’ll use that. Otherwise we default to your local backend.
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Tiny fetch wrapper:
 * - withCredentials: include cookies only when needed
 * - JSON body/response handling
 * - throws on non-2xx with a readable message
 */
async function apiFetch(path, opts = {}) {
    const {
        withCredentials = false,
        headers = {},
        body,
        method,
        ...rest
    } = opts;

    const res = await fetch(`${API}${path}`, {
        method: method || (body ? 'POST' : 'GET'),
        credentials: withCredentials ? 'include' : 'omit',
        headers: {
            Accept: 'application/json',
            // Only send Content-Type when we actually have a JSON body
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...headers,
        },
        body,
        ...rest,
    });

    if (res.status === 401) throw new Error('Not logged in');
    if (res.status === 403) throw new Error('Forbidden');
    if (!res.ok) {
        let detail = '';
        try {
            const t = await res.text();
            detail = t?.slice(0, 200) || '';
        } catch {}
        throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail}` : ''}`);
    }

    if (res.status === 204) return null; // no content
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
}

/* ===========================
   Manager endpoints (auth)
   =========================== */

export const loadMenu = () =>
    apiFetch('/manager/menu', { withCredentials: true });

export const addMenuItem = (payload) =>
    apiFetch('/manager/menu/add', {
        method: 'POST',
        body: JSON.stringify(payload),
        withCredentials: true,
    });

export const updateMenuItem = (payload) =>
    apiFetch('/manager/menu/update', {
        method: 'PUT',
        body: JSON.stringify(payload),
        withCredentials: true,
    });

export const deleteMenuItem = (id) =>
    apiFetch('/manager/menu/del', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        withCredentials: true,
    });

export const loadEmployees = () =>
    apiFetch('/manager/employee', { withCredentials: true });

export const addEmployee = (payload) =>
    apiFetch('/manager/employee/add', {
        method: 'POST',
        body: JSON.stringify(payload),
        withCredentials: true,
    });

export const updateEmployee = (payload) =>
    apiFetch('/manager/employee/update', {
        method: 'PUT',
        body: JSON.stringify(payload),
        withCredentials: true,
    });

export const deleteEmployee = (id) =>
    apiFetch('/manager/employee/del', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        withCredentials: true,
    });

export const loadInventory = () =>
    apiFetch('/manager/inventory', { withCredentials: true });

export const addInventory = (payload) =>
    apiFetch('/manager/inventory/add', {
        method: 'POST',
        body: JSON.stringify(payload),
        withCredentials: true,
    });

export const updateInventory = (payload) =>
    apiFetch('/manager/inventory/update', {
        method: 'PUT',
        body: JSON.stringify(payload),
        withCredentials: true,
    });

export const deleteInventory = (id) =>
    apiFetch('/manager/inventory/del', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        withCredentials: true,
    });

export const loadOrdersByDate = (dateOrRange) => {
    const qs = Array.isArray(dateOrRange)
        ? `date=${encodeURIComponent(dateOrRange[0])}&date=${encodeURIComponent(dateOrRange[1])}`
        : `date=${encodeURIComponent(dateOrRange)}`;
    return apiFetch(`/manager/orders?${qs}`, { withCredentials: true });
};

export const loadSales = (date) =>
    apiFetch(`/manager/sales?date=${encodeURIComponent(date)}`, { withCredentials: true });

export const loadSalesReport = (dateFmt, range, dateStr) => {
    const qs = `dateFmt=${encodeURIComponent(dateFmt)}&range=${encodeURIComponent(range)}&dateStr=${encodeURIComponent(dateStr)}`;
    return apiFetch(`/manager/sales-report?${qs}`, { withCredentials: true });
};

/* ===========================
   Cashier / Customer (public)
   =========================== */

// Public menu for cashier/customer views (no cookies so CORS stays chill)
export const loadCashierMenu = () =>
    apiFetch('/cashier/menu', { withCredentials: true });

export const submitCashierOrder = (body) =>
    apiFetch('/cashier/order', {
        method: 'POST',
        body: JSON.stringify(body),
        withCredentials: true
    });

/* ===========================
   Optional helpers
   =========================== */

export const getSession = () => apiFetch('/auth/me', { withCredentials: true });
