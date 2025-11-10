const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'data', 'inventory.json');

function readAll () {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}
function writeAll (rows) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(rows, null, 2), 'utf8');
}

router.get('/', (req, res) => res.json(readAll()));

router.post('/', (req, res) => {
    const rows = readAll();
    const r = req.body || {};
    if ([r.id, r.name, r.unit].some(v => v == null)) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    if (rows.some(x => x.id === Number(r.id))) {
        return res.status(409).json({ error: 'ID exists' });
    }
    const row = {
        id: Number(r.id),
        name: String(r.name),
        unit: String(r.unit),
        quantity: Number(r.quantity ?? 0),
        reorder_threshold: Number(r.reorder_threshold ?? 0),
        unit_cost: Number(r.unit_cost ?? 0)
    };
    rows.push(row);
    rows.sort((a,b)=>a.id-b.id);
    writeAll(rows);
    res.status(201).json(row);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const rows = readAll();
    const i = rows.findIndex(x => x.id === id);
    if (i < 0) return res.status(404).json({ error: 'Not found' });
    const cur = rows[i], b = req.body || {};
    const next = {
        ...cur,
        ...(b.name != null ? { name: String(b.name) } : {}),
        ...(b.unit != null ? { unit: String(b.unit) } : {}),
        ...(b.quantity != null ? { quantity: Number(b.quantity) } : {}),
        ...(b.reorder_threshold != null ? { reorder_threshold: Number(b.reorder_threshold) } : {}),
        ...(b.unit_cost != null ? { unit_cost: Number(b.unit_cost) } : {})
    };
    rows[i] = next;
    writeAll(rows);
    res.json(next);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const before = readAll();
    const after = before.filter(x => x.id !== id);
    if (after.length === before.length) return res.status(404).json({ error: 'Not found' });
    writeAll(after);
    res.status(204).end();
});

module.exports = router;
