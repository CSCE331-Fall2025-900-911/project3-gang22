/* global React, ReactDOM, Chart */
const { useEffect, useMemo, useRef, useState } = React;

/* ------------------------ seed data ------------------------ */
const SEED_MENU = [
    { id:1,  name:'Classic Black Milk Tea with Boba', price:4.50, image:'/images/drink1-3.jpg' },
    { id:2,  name:'Jasmine Green Milk Tea with Boba', price:4.75, image:'/images/drink1-3.jpg' },
    { id:3,  name:'Oolong Milk Tea with Boba',        price:4.95, image:'/images/drink1-3.jpg' },
    { id:4,  name:'Taro Milk Tea with Boba',          price:5.25, image:'/images/drink4.jpg' },
    { id:5,  name:'Thai Milk Tea with Boba',          price:5.10, image:'/images/drink5.jpg' },
    { id:6,  name:'Honeydew Milk Tea with Boba',      price:4.85, image:'/images/drink6.jpg' },
    { id:7,  name:'Matcha Latte with Boba',           price:5.50, image:'/images/drink7.jpg' },
    { id:8,  name:'Brown Sugar Milk Tea with Boba',   price:5.75, image:'/images/drink8.jpg' },
    { id:9,  name:'Strawberry Fruit Tea with Boba',   price:4.60, image:'/images/placeholder.png' },
    { id:10, name:'Mango Fruit Tea with Boba',        price:4.70, image:'/images/drink10.jpg' },
    { id:11, name:'Lychee Fruit Tea with Boba',       price:4.95, image:'/images/drink11.jpg' },
    { id:12, name:'Passionfruit Green Tea with Boba', price:4.90, image:'/images/placeholder.png' },
    { id:13, name:'Peach Oolong Tea with Boba',       price:5.00, image:'/images/drink13.jpg' },
    { id:14, name:'Coconut Milk Tea with Boba',       price:5.15, image:'/images/drink14.jpg' },
    { id:15, name:'Almond Milk Tea with Boba',        price:5.20, image:'/images/placeholder.png' },
    { id:16, name:'Coffee Milk Tea with Boba',        price:5.30, image:'/images/drink16.jpg' },
    { id:17, name:'Wintermelon Milk Tea with Boba',   price:4.80, image:'/images/placeholder.png' },
    { id:18, name:'Avocado Smoothie with Boba',       price:6.25, image:'/images/placeholder.png' },
    { id:19, name:'Strawberry Banana Smoothie w/ Boba', price:6.50, image:'/images/drink19.jpg' },
    { id:20, name:'Mango Slush with Boba',            price:6.00, image:'/images/drink20.jpg' }
];

const EMPLOYEES = [
    { id:1, name:'Ava Chen',   role:0, schedule:'0' },
    { id:2, name:'Ben Nguyen', role:0, schedule:'0' },
    { id:3, name:'Maya Torres',role:1, schedule:'0' },
    { id:4, name:'Luis Park',  role:0, schedule:'0' },
    { id:5, name:'Zoe Tran',   role:0, schedule:'0' }
];

const INVENTORY = SEED_MENU.map(m => ({ sku: m.id, item: m.name, stock: Math.floor(20 + Math.random()*40) }));

/* ------------------------ generic table ------------------------ */
function Img({ src, alt }) {
    const [s, setS] = useState(src);
    return (
        <img
            src={s}
            alt={alt}
            width="56" height="56"
            style={{ objectFit:'cover', borderRadius:8, border:'1px solid #eee' }}
            onError={() => setS('/images/placeholder.png')}
        />
    );
}

function Table({ columns, rows, rowKey=(r,i)=>r.id ?? i, actions, rowClass }) {
    return (
        <div className="table-wrap" role="region" aria-label="data table">
            <table style={{ width:'100%', borderCollapse:'separate', borderSpacing:0 }}>
                <thead>
                    <tr>
                        {columns.map(c => (
                            <th key={c.key} style={{textAlign: 'left', padding: '8px', borderBottom: '2px solid #ccc'}}>
                                {c.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {rows.map((r,i)=>(
                    <tr key={rowKey(r,i)} className={rowClass ? rowClass(r) : ''}>
                        {columns.map(c=>(
                            <td key={c.key} style={{ padding:'8px', borderTop:'1px solid #eee' }}>
                                {c.render ? c.render(r[c.key], r) : String(r[c.key] ?? '')}
                            </td>
                        ))}
                        {actions && <td style={{ borderTop:'1px solid #eee' }}>{actions(r)}</td>}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}

/* ------------------------ tiny chart ------------------------ */
function SalesTrends() {
    const ref = useRef(null);
    const chartRef = useRef(null);
    useEffect(() => {
        const ctx = ref.current.getContext('2d');
        const data = [12,19,7,15,22,18,25];
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets:[{ label:'Orders', data }]},
            options:{ responsive:true, maintainAspectRatio:false }
        });
        return () => chartRef.current?.destroy();
    }, []);
    return (
        <div className="panel" style={{ height: 360 }}>
            <h2>Sales Trends</h2>
            <canvas ref={ref}/>
        </div>
    );
}

function nextId(list) {
    return list && list.length
        ? Math.max(...list.map(i => Number(i.id) || 0)) + 1
        : 1;
}
/* ------------------------ Menu Editor (CRUD via /api/menu) ------------------------ */
function MenuEditor() {
    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const emptyForm = { id: '', name: '', price: '', image: '/images/placeholder.png' };
    const [form, setForm] = useState(emptyForm);

    // initial load
    useEffect(() => {
        fetch('/api/menu')
            .then(r => r.json())
            .then(setItems)
            .catch(() => setItems([]));
    }, []);

    function startAdd() {
        setEditingId('NEW');
        setForm({ ...emptyForm, id: nextId(items) });
    }

    function startEdit(row) {
        setEditingId(row.id);
        setForm({
            id: row.id,
            name: row.name,
            price: String(row.price),
            image: row.image || '/images/placeholder.png'
        });
    }

    function cancel() {
        setEditingId(null);
        setForm(emptyForm);
    }

    async function save() {
        const id = Number(form.id);
        const price = Number(form.price);
        if (!form.name.trim() || Number.isNaN(id) || Number.isNaN(price)) {
            alert('Please provide valid id (number), name, and price (number).');
            return;
        }

        const payload = {
            id,
            name: form.name.trim(),
            price,
            image: (form.image || '/images/placeholder.png').trim()
        };

        try {
            if (editingId === 'NEW') {
                // optimistic add
                setItems(prev => [...prev, payload].sort((a, b) => a.id - b.id));

                const r = await fetch('/api/menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!r.ok) throw new Error('Add failed');

                const serverItem = await r.json();
                setItems(prev => prev.map(x => (x.id === id ? serverItem : x)));
            } else {
                // optimistic update
                setItems(prev => prev.map(x => (x.id === id ? payload : x)));

                const r = await fetch(`/api/menu/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!r.ok) throw new Error('Update failed');

                const serverItem = await r.json();
                setItems(prev => prev.map(x => (x.id === id ? serverItem : x)));
            }

            cancel();
        } catch (e) {
            alert(e.message || 'Request failed');
            // recover by reloading from server
            fetch('/api/menu').then(r => r.json()).then(setItems).catch(() => {});
        }
    }

    async function del(row) {
        if (!confirm(`Delete "${row.name}"?`)) return;
        const id = row.id;

        // optimistic delete
        setItems(prev => prev.filter(x => x.id !== id));

        try {
            const r = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
            if (!r.ok && r.status !== 204) throw new Error('Delete failed');
        } catch (e) {
            alert(e.message || 'Request failed');
            fetch('/api/menu').then(r => r.json()).then(setItems).catch(() => {});
        }
    }

    const columns = useMemo(
        () => [
            { key: 'id', label: 'Menu ID' },
            { key: 'name', label: 'Drink Name' },
            { key: 'price', label: 'Price' },
            // thumbnail only — no path text
            { key: 'image', label: 'Image', render: (v, r) => <Img src={v} alt={r.name} /> }
        ],
        []
    );

    return (
        <section className="panel">
            <div className="row gap">
                <h2 className="grow">Menu</h2>
                <button className="btn" onClick={startAdd}>Add Item</button>
            </div>

            {editingId !== null && (
                <div className="card" style={{ padding: 12, margin: '12px 0' }}>
                    <div className="row gap">
                        <label style={{ minWidth: 120 }}>
                            ID
                            <input
                                type="number"
                                value={form.id}
                                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                                style={{ width: 120 }}
                            />
                        </label>

                        <label className="grow">
                            Name
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                style={{ width: '100%' }}
                            />
                        </label>

                        <label>
                            Price
                            <input
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                style={{ width: 120 }}
                            />
                        </label>

                        <label className="grow">
                            Image path
                            <input
                                type="text"
                                value={form.image}
                                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                                placeholder="/images/..."
                                style={{ width: '100%' }}
                            />
                        </label>

                        <Img src={form.image} alt="preview" />
                    </div>

                    <div className="row gap mt-sm">
                        <button className="btn" onClick={save}>Save</button>
                        <button className="btn subtle" onClick={cancel}>Cancel</button>
                    </div>
                </div>
            )}

            <Table
                columns={columns}
                rows={items}
                actions={row => (
                    <div className="row gap-sm">
                        <button className="btn" onClick={() => startEdit(row)}>Edit</button>
                        <button className="btn danger" onClick={() => del(row)}>Delete</button>
                    </div>
                )}
            />
        </section>
    );
}


/* ------------------------ other screens ------------------------ */
function Employees() {
    const columns = [
        { key:'id', label:'ID' },
        { key:'name', label:'Name' },
        { key:'role', label:'Role', render:v => (Number(v)===1?'Manager':'Employee') },
        { key:'schedule', label:'Schedule' }
    ];
    return <section className="panel"><h2>Employees</h2><Table columns={columns} rows={EMPLOYEES} /></section>;
}

/* ---------------------- Inventory Editor ---------------------- */
function InventoryEditor() {
    const [rows, setRows] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const empty = { id:'', name:'', unit:'', quantity:'0', reorder_threshold:'0', unit_cost:'0' };
    const [form, setForm] = useState(empty);

    useEffect(() => {
        fetch('/api/inventory').then(r=>r.json()).then(setRows).catch(()=>setRows([]));
    }, []);

    function startAdd()  { setEditingId('NEW'); setForm({ ...empty, id: nextId(rows) }); }
    function startEdit(r){ setEditingId(r.id); setForm({ ...r,
        quantity:String(r.quantity), reorder_threshold:String(r.reorder_threshold), unit_cost:String(r.unit_cost)
    }); }
    function cancel()    { setEditingId(null); setForm(empty); }

    async function save() {
        const payload = {
            id: Number(form.id),
            name: form.name.trim(),
            unit: form.unit.trim(),
            quantity: Number(form.quantity),
            reorder_threshold: Number(form.reorder_threshold),
            unit_cost: Number(form.unit_cost)
        };
        if (!payload.id || !payload.name || !payload.unit) return alert('ID, name, unit are required.');
        try {
            if (editingId === 'NEW') {
                setRows(prev => [...prev, payload].sort((a,b)=>a.id-b.id));
                const r = await fetch('/api/inventory', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                if (!r.ok) throw new Error('Add failed');
                const serverRow = await r.json();
                setRows(prev => prev.map(x => x.id===serverRow.id? serverRow : x));
            } else {
                setRows(prev => prev.map(x => x.id===payload.id? payload : x));
                const r = await fetch(`/api/inventory/${payload.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                if (!r.ok) throw new Error('Update failed');
                const serverRow = await r.json();
                setRows(prev => prev.map(x => x.id===serverRow.id? serverRow : x));
            }
            cancel();
        } catch (e) {
            alert(e.message || 'Request failed');
            fetch('/api/inventory').then(r=>r.json()).then(setRows).catch(()=>{});
        }
    }

    async function del(r) {
        if (!confirm(`Delete "${r.name}"?`)) return;
        setRows(prev => prev.filter(x => x.id !== r.id));
        try {
            const res = await fetch(`/api/inventory/${r.id}`, { method:'DELETE' });
            if (!res.ok && res.status !== 204) throw new Error('Delete failed');
        } catch(e) {
            alert(e.message || 'Request failed');
            fetch('/api/inventory').then(r=>r.json()).then(setRows).catch(()=>{});
        }
    }

    const columns = useMemo(() => [
        { key:'id',                 label:'ID' },
        { key:'name',               label:'Name' },
        { key:'unit',               label:'Unit' },
        { key:'quantity',           label:'Qty' },
        { key:'reorder_threshold',  label:'Reorder @' },
        { key:'unit_cost',          label:'Unit Cost', render:(v)=>`$${Number(v).toFixed(2)}` },
        { key:'_need',              label:'Needs Restock', render:(_,r)=> r.quantity <= r.reorder_threshold ? '⚠️ Yes' : '—' }
    ], []);

    return (
        <section className="panel">
            <div className="row gap">
                <h2 className="grow">Inventory</h2>
                <button className="btn" onClick={startAdd}>Add Item</button>
            </div>

            {editingId !== null && (
                <div className="card" style={{ padding:12, margin:'12px 0' }}>
                    <div className="row gap">
                        <label> ID <input type="number" value={form.id} onChange={e=>setForm(f=>({...f,id:e.target.value}))} style={{width:100}}/></label>
                        <label className="grow"> Name <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{width:'100%'}}/></label>
                        <label> Unit <input type="text" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} style={{width:100}}/></label>
                        <label> Qty <input type="number" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} style={{width:120}}/></label>
                        <label> Reorder @ <input type="number" value={form.reorder_threshold} onChange={e=>setForm(f=>({...f,reorder_threshold:e.target.value}))} style={{width:120}}/></label>
                        <label> Unit Cost <input type="number" step="0.01" value={form.unit_cost} onChange={e=>setForm(f=>({...f,unit_cost:e.target.value}))} style={{width:120}}/></label>
                    </div>
                    <div className="row gap mt-sm">
                        <button className="btn" onClick={save}>Save</button>
                        <button className="btn subtle" onClick={cancel}>Cancel</button>
                    </div>
                </div>
            )}

            <Table
                columns={columns}
                rows={rows}
                rowClass={(r)=> r.quantity <= r.reorder_threshold ? 'low' : '' }
                actions={(r)=>(
                    <div className="row gap-sm">
                        <button className="btn" onClick={()=>startEdit(r)}>Edit</button>
                        <button className="btn danger" onClick={()=>del(r)}>Delete</button>
                    </div>
                )}
            />
        </section>
    );
}


/* ------------------------ app shell ------------------------ */
const VIEWS = [
    ['menu','Menu'], ['employees','Employees'], ['inventory','Inventory'],
    ['orders','Orders'], ['sales','Sales Trends'], ['restock','Restock'],
    ['usage','Product Usage'], ['xreport','X-Report'], ['zreport','Z-Report']
];

function App() {
    const [view, setView] = useState('menu');
    return (
        <>
            <div className="row gap" style={{ flexWrap:'wrap', marginBottom: 12 }}>
                {VIEWS.map(([key,label]) => (
                    <button key={key} className="btn" onClick={() => setView(key)}>{label}</button>
                ))}
            </div>

            {view === 'menu' && <MenuEditor />}
            {view === 'employees' && <Employees />}
            + {view === 'inventory' && <InventoryEditor />}
            {view === 'sales' && <SalesTrends />}

            {['orders','restock','usage','xreport','zreport'].includes(view) && (
                <section className="panel"><h2>Coming Soon</h2><p>This screen hasn’t been wired yet.</p></section>
            )}
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
