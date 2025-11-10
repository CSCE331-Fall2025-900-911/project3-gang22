const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'data', 'employee.json');

function readEmployees() {
    try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
    catch { return []; }
}

function writeEmployees(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/employees
router.get('/', (req, res) => {
    res.json(readEmployees());
});

// POST /api/employees  { id, name, role, schedule }
router.post('/', (req, res) => {
    const employees = readEmployees();
    const emp = req.body;
    if (!emp || typeof emp.id !== 'number' || !emp.name || typeof emp.role !== 'number' || !emp.schedule) {
        return res.status(400).json({ error: 'Invalid employee data' });
    }
    if (employees.some(e => e.id === emp.id)) {
        return res.status(409).json({ error: 'ID already exists' });
    }
    employees.push(emp);
    employees.sort((a, b) => a.id - b.id);
    writeEmployees(employees);
    res.status(201).json(emp);
});

// PUT /api/employees/:id
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const employees = readEmployees();
    const idx = employees.findIndex(e => e.id === id);
    if (idx < 0) return res.status(404).json({ error: 'Not found' });

    const cur = employees[idx];
    const next = {
        ...cur,
        ...(req.body.name     != null ? { name: String(req.body.name) } : {}),
        ...(req.body.role     != null ? { role: Number(req.body.role) } : {}),
        ...(req.body.schedule != null ? { schedule: String(req.body.schedule) } : {})
    };
    employees[idx] = next;
    writeEmployees(employees);
    res.json(next);
});

// DELETE /api/employees/:id
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const before = readEmployees();
    const after = before.filter(e => e.id !== id);
    if (after.length === before.length) return res.status(404).json({ error: 'Not found' });
    writeEmployees(after);
    res.status(204).end();
});

module.exports = router;