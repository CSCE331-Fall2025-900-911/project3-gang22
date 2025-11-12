import { useEffect, useMemo, useState } from 'react';
import { loadMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../api';

const empty = {
    drink_name: '',
    price: '',
    category: 'Milk Tea',
    picture_url: '',
    tea_type: '',
    milk_type: ''
};

export default function ManagerMenu() {
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState(empty);
    const [editingId, setEditingId] = useState(null);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let live = true;
        setLoading(true);
        loadMenu()
            .then(d => live && setRows(d))
            .catch(e => live && setErr(e.message))
            .finally(() => live && setLoading(false));
        return () => { live = false; };
    }, []);

    function onChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function startAdd() {
        setEditingId(null);
        setForm(empty);
    }
    function startEdit(item) {
        setEditingId(item.id);
        setForm({
            drink_name: item.drink_name || '',
            price: item.price ?? '',
            category: item.category || '',
            picture_url: item.picture_url || '',
            tea_type: item.tea_type || '',
            milk_type: item.milk_type || ''
        });
    }

    function validate(f) {
        if (!f.drink_name.trim()) return 'Name is required.';
        const p = Number(f.price);
        if (Number.isNaN(p) || p < 0) return 'Price must be a non-negative number.';
        if (!f.category.trim()) return 'Category is required.';
        if (!f.picture_url.trim()) return 'Picture URL is required.';
        return '';
    }

    async function save() {
        const v = validate(form);
        if (v) return setErr(v);
        setErr('');
        try {
            if (editingId == null) {
                const created = await addMenuItem({ ...form, price: Number(form.price) });
                setRows(r => [created, ...r]);
            } else {
                const updated = await updateMenuItem({ id: editingId, ...form, price: Number(form.price) });
                setRows(r => r.map(x => (x.id === editingId ? updated : x)));
            }
            startAdd();
        } catch (e) {
            setErr(e.message);
        }
    }

    async function remove(id) {
        const prev = rows;
        setRows(r => r.filter(x => x.id !== id));
        try {
            await deleteMenuItem(id);
        } catch (e) {
            setRows(prev); // rollback
            setErr(e.message);
        }
    }

    const sorted = useMemo(
        () => [...rows].sort((a, b) => a.id - b.id),
        [rows]
    );

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Manager • Menu</h1>
            {err && <div className="mb-3 text-red-600">Error: {err}</div>}
            {loading && <div className="mb-3">Loading…</div>}

            {/* Editor */}
            <div className="border rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                <h2 className="font-semibold col-span-full">
                    {editingId == null ? 'Add Item' : `Edit Item #${editingId}`}
                </h2>

                <label className="flex flex-col">
                    <span>Name</span>
                    <input name="drink_name" value={form.drink_name} onChange={onChange} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col">
                    <span>Price</span>
                    <input name="price" value={form.price} onChange={onChange} className="border p-2 rounded" inputMode="decimal" />
                </label>

                <label className="flex flex-col">
                    <span>Category</span>
                    <input name="category" value={form.category} onChange={onChange} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col">
                    <span>Picture URL</span>
                    <input name="picture_url" value={form.picture_url} onChange={onChange} className="border p-2 rounded" placeholder="/images/drink1.jpg" />
                </label>

                <label className="flex flex-col">
                    <span>Tea Type (optional)</span>
                    <input name="tea_type" value={form.tea_type} onChange={onChange} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col">
                    <span>Milk Type (optional)</span>
                    <input name="milk_type" value={form.milk_type} onChange={onChange} className="border p-2 rounded" />
                </label>

                <div className="col-span-full flex gap-2">
                    <button onClick={save} className="px-4 py-2 rounded bg-blue-600 text-white">
                        {editingId == null ? 'Add' : 'Save'}
                    </button>
                    {editingId != null && (
                        <button onClick={startAdd} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                    )}
                </div>
            </div>

            {/* Table */}
            <table className="w-full border-separate [border-spacing:0]">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Tea</th>
                    <th className="p-2 border">Milk</th>
                    <th className="p-2 border">Actions</th>
                </tr>
                </thead>
                <tbody>
                {sorted.map(it => (
                    <tr key={it.id}>
                        <td className="p-2 border">{it.id}</td>
                        <td className="p-2 border">{it.drink_name}</td>
                        <td className="p-2 border">${Number(it.price).toFixed(2)}</td>
                        <td className="p-2 border">{it.category}</td>
                        <td className="p-2 border">{it.tea_type || '—'}</td>
                        <td className="p-2 border">{it.milk_type || '—'}</td>
                        <td className="p-2 border">
                            <button onClick={() => startEdit(it)} className="px-2 py-1 mr-2 rounded bg-yellow-400">Edit</button>
                            <button onClick={() => remove(it.id)} className="px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                        </td>
                    </tr>
                ))}
                {!sorted.length && !loading && (
                    <tr><td className="p-4 text-center" colSpan="7">No items yet.</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
