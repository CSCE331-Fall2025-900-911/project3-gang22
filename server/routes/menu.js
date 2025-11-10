// server/routes/menu.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'data', 'menu.json');

function readMenu() {
    try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
    catch { return []; }
}

function writeMenu(menu) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(menu, null, 2), 'utf8');
}

// GET /api/menu
router.get('/', (req, res) => {
    res.json(readMenu());
});

// POST /api/menu  { id, name, price, image }
router.post('/', (req, res) => {
    const menu = readMenu();
    const item = req.body;
    if (!item || typeof item.id !== 'number' || !item.name || typeof item.price !== 'number') {
        return res.status(400).json({ error: 'Invalid item' });
    }
    if (menu.some(m => m.id === item.id)) {
        return res.status(409).json({ error: 'ID already exists' });
    }
    menu.push(item);
    menu.sort((a,b)=>a.id-b.id);
    writeMenu(menu);
    res.status(201).json(item);
});

// PUT /api/menu/:id  { name?, price?, image? }
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const menu = readMenu();
    const idx = menu.findIndex(m => m.id === id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });

    const cur = menu[idx];
    const next = {
        ...cur,
        ...(req.body.name  != null ? { name: String(req.body.name) } : {}),
        ...(req.body.price != null ? { price: Number(req.body.price) } : {}),
        ...(req.body.image != null ? { image: String(req.body.image) } : {}),
    };
    menu[idx] = next;
    writeMenu(menu);
    res.json(next);
});

// DELETE /api/menu/:id
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const before = readMenu();
    const after = before.filter(m => m.id !== id);
    if (after.length === before.length) return res.status(404).json({ error: 'Not found' });
    writeMenu(after);
    res.status(204).end();
});

module.exports = router;
