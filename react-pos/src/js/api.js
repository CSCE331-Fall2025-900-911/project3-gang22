// react-pos/src/js/api.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Generic fetch that always sends the session cookie
async function apiFetch(path, opts = {}) {
    const res = await fetch(`${API}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
        ...opts
    });
    if (res.status === 401) throw new Error('Not logged in');
    if (res.status === 403) throw new Error('Forbidden');
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    // Try JSON, but allow 204
    return res.status === 204 ? null : res.json();
}

// --- Manager endpoints ---
export const loadMenu        = () => apiFetch('/manager/menu');
export const addMenuItem     = (body) => apiFetch('/manager/menu/add',    { method: 'POST', body: JSON.stringify(body) });
export const updateMenuItem  = (body) => apiFetch('/manager/menu/update', { method: 'PUT',  body: JSON.stringify(body) });
export const deleteMenuItem  = (id)   => apiFetch('/manager/menu/del',    { method: 'DELETE', body: JSON.stringify({ id }) });

export const loadEmployees   = () => apiFetch('/manager/employee');
export const addEmployee     = (body) => apiFetch('/manager/employee/add',    { method: 'POST', body: JSON.stringify(body) });
export const updateEmployee  = (body) => apiFetch('/manager/employee/update', { method: 'PUT',  body: JSON.stringify(body) });
export const deleteEmployee  = (id)   => apiFetch('/manager/employee/del',    { method: 'DELETE', body: JSON.stringify({ id }) });

export const loadInventory   = () => apiFetch('/manager/inventory');
export const addInventory    = (body) => apiFetch('/manager/inventory/add',    { method: 'POST', body: JSON.stringify(body) });
export const updateInventory = (body) => apiFetch('/manager/inventory/update', { method: 'PUT',  body: JSON.stringify(body) });
export const deleteInventory = (id)   => apiFetch('/manager/inventory/del',    { method: 'DELETE', body: JSON.stringify({ id }) });

export const loadSales = (date) =>
    apiFetch(`/manager/sales?date=${encodeURIComponent(date)}`);

export const loadSalesReport = (dateFmt, range, dateStr) => {
    const qs = `dateFmt=${encodeURIComponent(dateFmt)}&range=${encodeURIComponent(range)}&dateStr=${encodeURIComponent(dateStr)}`;
    return apiFetch(`/manager/sales-report?${qs}`);
};

export const loadOrdersByDate = (dateOrRange /* string or [start,end] */) => {
    const qs = Array.isArray(dateOrRange)
        ? `date=${encodeURIComponent(dateOrRange[0])}&date=${encodeURIComponent(dateOrRange[1])}`
        : `date=${encodeURIComponent(dateOrRange)}`;
    return apiFetch(`/manager/orders?${qs}`);
};
