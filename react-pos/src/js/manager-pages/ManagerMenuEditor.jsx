import React, { useEffect, useMemo, useState } from "react";
import {
    loadMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from "../api";

const emptyForm = {
    drink_name: "",
    price: "",
    category: "",
    picture_url: "",
    tea_type: "",
    milk_type: "",
};

function Field({ label, name, value, onChange, type = "text", placeholder }) {
    return (
        <label style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 8, alignItems: "center" }}>
            <span>{label}</span>
            <input
                name={name}
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder={placeholder}
                className="border p-1 rounded"
                required={["drink_name","price","category","picture_url"].includes(name)}
            />
        </label>
    );
}

export default function ManagerMenuEditor() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    // which row is being edited (by id)
    const [editingId, setEditingId] = useState(null);
    const [editDraft, setEditDraft] = useState(emptyForm);

    const sortedRows = useMemo(
        () => [...rows].sort((a, b) => a.id - b.id),
        [rows]
    );

    function setFormField(name, val) {
        setForm((f) => ({ ...f, [name]: val }));
    }
    function setEditField(name, val) {
        setEditDraft((f) => ({ ...f, [name]: val }));
    }

    async function refresh() {
        try {
            setErr("");
            setLoading(true);
            const data = await loadMenu();
            setRows(data);
        } catch (e) {
            setErr(e.message || "Failed to load menu");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function handleAdd(e) {
        e.preventDefault();
        try {
            setErr("");
            const payload = {
                ...form,
                price: Number(form.price),
                tea_type: form.tea_type || null,
                milk_type: form.milk_type || null,
            };
            const created = await addMenuItem(payload);
            setRows((r) => [...r, created]);
            setForm(emptyForm);
            setAddOpen(false);
        } catch (e) {
            setErr(e.message || "Add failed");
        }
    }

    function startEdit(row) {
        setEditingId(row.id);
        setEditDraft({
            drink_name: row.drink_name ?? "",
            price: String(row.price ?? ""),
            category: row.category ?? "",
            picture_url: row.picture_url ?? "",
            tea_type: row.tea_type ?? "",
            milk_type: row.milk_type ?? "",
        });
    }

    async function saveEdit(id) {
        try {
            setErr("");
            const payload = {
                id,
                ...editDraft,
                price: Number(editDraft.price),
                tea_type: editDraft.tea_type || null,
                milk_type: editDraft.milk_type || null,
            };
            await updateMenuItem(payload);
            setRows((r) =>
                r.map((x) => (x.id === id ? { ...x, ...payload } : x))
            );
            setEditingId(null);
        } catch (e) {
            setErr(e.message || "Update failed");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this menu item?")) return;
        try {
            setErr("");
            await deleteMenuItem(id);
            setRows((r) => r.filter((x) => x.id !== id));
        } catch (e) {
            setErr(e.message || "Delete failed");
        }
    }

    return (
        <div style={{ maxWidth: 1000 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                <button className="nav-btn" onClick={() => setAddOpen((v) => !v)}>
                    {addOpen ? "Close" : "Add Item"}
                </button>
                {loading && <span>Loading…</span>}
                {err && <span style={{ color: "crimson" }}>Error: {err}</span>}
            </div>

            {addOpen && (
                <form onSubmit={handleAdd} style={{ display: "grid", gap: 8, marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                    <Field label="Drink Name" name="drink_name" value={form.drink_name} onChange={setFormField} placeholder="Thai Milk Tea with Boba" />
                    <Field label="Price" name="price" type="number" value={form.price} onChange={setFormField} placeholder="5.25" />
                    <Field label="Category" name="category" value={form.category} onChange={setFormField} placeholder="Milk Tea" />
                    <Field label="Image URL" name="picture_url" value={form.picture_url} onChange={setFormField} placeholder="/images/drink1.jpg" />
                    <Field label="Tea Type" name="tea_type" value={form.tea_type} onChange={setFormField} placeholder="Black / Green / Oolong / etc." />
                    <Field label="Milk Type" name="milk_type" value={form.milk_type} onChange={setFormField} placeholder="Whole / Almond / etc." />
                    <div>
                        <button className="nav-btn" type="submit">Create</button>
                    </div>
                </form>
            )}

            <table className="table">
                <thead>
                <tr>
                    <th style={{ width: 70 }}>Menu ID</th>
                    <th>Drink Name</th>
                    <th style={{ width: 90 }}>Price</th>
                    <th style={{ width: 130 }}>Category</th>
                    <th>Image</th>
                    <th style={{ width: 180 }}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedRows.map((row) => {
                    const isEditing = editingId === row.id;
                    return (
                        <tr key={row.id}>
                            <td>{row.id}</td>

                            <td>
                                {isEditing ? (
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={editDraft.drink_name}
                                        onChange={(e) => setEditField("drink_name", e.target.value)}
                                    />
                                ) : (
                                    row.drink_name
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <input
                                        className="border p-1 rounded w-full"
                                        type="number"
                                        value={editDraft.price}
                                        onChange={(e) => setEditField("price", e.target.value)}
                                    />
                                ) : (
                                    Number(row.price).toFixed(2)
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={editDraft.category}
                                        onChange={(e) => setEditField("category", e.target.value)}
                                    />
                                ) : (
                                    row.category
                                )}
                            </td>

                            <td>
                                {isEditing ? (
                                    <input
                                        className="border p-1 rounded w-full"
                                        value={editDraft.picture_url}
                                        onChange={(e) => setEditField("picture_url", e.target.value)}
                                    />
                                ) : (
                                    row.picture_url
                                )}
                            </td>

                            <td style={{ display: "flex", gap: 6 }}>
                                {isEditing ? (
                                    <>
                                        <button className="nav-btn" onClick={() => saveEdit(row.id)}>Save</button>
                                        <button className="nav-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="nav-btn" onClick={() => startEdit(row)}>Edit</button>
                                        <button className="nav-btn" onClick={() => handleDelete(row.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                {sortedRows.length === 0 && !loading && (
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: 12 }}>No items</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
