const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const INVENTORY_PATH = path.join(__dirname, '..', 'data', 'inventory.json');
const ORDERS_PATH    = path.join(__dirname, '..', 'data', 'orders.json');
const MENU_PATH      = path.join(__dirname, '..', 'data', 'menu.json'); // optional, not required

function readJson(p, fallback) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
    catch { return fallback; }
}
function writeJson(p, data) {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Very simple recipe map:
 * - Each menu item id maps to an array of { invId, amount } deductions.
 * - Amounts are in the unit of the inventory item (ea, kg, L, roll).
 *
 * Tweak these numbers to match reality later.
 */
const BASE_SUPPLIES = [
    { invId: 14, amount: 1 },     // Cups 500ml (ea)
    { invId: 16, amount: 1 },     // Straws (ea)
    { invId: 15, amount: 0.005 }, // Sealing film (roll) ~ half percent per drink
];

const RECIPES = {
    // Milk teas (example ids)
    1:  [ ...BASE_SUPPLIES, { invId: 1, amount: 0.02 }, { invId: 13, amount: 0.02 }, { invId: 7, amount: 0.03 } ],
    2:  [ ...BASE_SUPPLIES, { invId: 2, amount: 0.02 }, { invId: 13, amount: 0.02 }, { invId: 7, amount: 0.03 } ],
    3:  [ ...BASE_SUPPLIES, { invId: 3, amount: 0.02 }, { invId: 13, amount: 0.02 }, { invId: 7, amount: 0.03 } ],
    4:  [ ...BASE_SUPPLIES, { invId: 4, amount: 0.02 }, { invId: 13, amount: 0.02 } ],
    5:  [ ...BASE_SUPPLIES, { invId: 5, amount: 0.02 }, { invId: 13, amount: 0.02 }, { invId: 7, amount: 0.03 } ],
    6:  [ ...BASE_SUPPLIES, { invId: 6, amount: 0.20 }, { invId: 13, amount: 0.02 }, { invId: 7, amount: 0.03 } ], // fresh milk in L
    7:  [ ...BASE_SUPPLIES, { invId: 5, amount: 0.02 }, { invId: 13, amount: 0.02 } ],
    8:  [ ...BASE_SUPPLIES, { invId: 5, amount: 0.02 }, { invId: 13, amount: 0.02 }, { invId: 7, amount: 0.04 } ],

    // Fruit teas/smoothies (use purees)
    9:  [ ...BASE_SUPPLIES, { invId: 9,  amount: 0.03 }, { invId: 13, amount: 0.02 } ],
    10: [ ...BASE_SUPPLIES, /* Mango fruit tea, no puree in inventory list? using syrup */ { invId: 7, amount: 0.04 }, { invId: 13, amount: 0.02 } ],
    11: [ ...BASE_SUPPLIES, { invId: 11, amount: 0.03 }, { invId: 13, amount: 0.02 } ],
    12: [ ...BASE_SUPPLIES, { invId: 12, amount: 0.03 }, { invId: 13, amount: 0.02 } ],
    13: [ ...BASE_SUPPLIES, { invId: 12, amount: 0.03 }, { invId: 13, amount: 0.02 } ],
    19: [ ...BASE_SUPPLIES, { invId: 10, amount: 0.03 }, { invId: 7, amount: 0.02 } ],
    20: [ ...BASE_SUPPLIES, { invId: 7,  amount: 0.04 } ],
};

/** Combine deductions across order items: {invId: totalAmount} */
function planDeductions(cart) {
    const need = new Map(); // invId -> amount
    for (const line of cart) {
        const recipe = RECIPES[line.id] || BASE_SUPPLIES;
        for (const step of recipe) {
            const add = step.amount * Number(line.qty || 0);
            need.set(step.invId, (need.get(step.invId) || 0) + add);
        }
    }
    return need;
}

/** Check if inventory has enough for the need map */
function checkStock(inventory, need) {
    const shortages = [];
    for (const [invId, amt] of need.entries()) {
        const row = inventory.find(r => Number(r.id) === Number(invId));
        if (!row) { shortages.push({ invId, missing: amt }); continue; }
        if (Number(row.quantity) < amt) {
            shortages.push({ invId, missing: amt - Number(row.quantity) });
        }
    }
    return shortages;
}

router.post('/', (req, res) => {
    const body = req.body || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return res.status(400).json({ error: 'No items in order.' });

    const inventory = readJson(INVENTORY_PATH, []);
    const need = planDeductions(items);
    const shortages = checkStock(inventory, need);

    if (shortages.length) {
        return res.status(409).json({ error: 'Insufficient stock', shortages });
    }

    // apply deductions
    for (const [invId, amt] of need.entries()) {
        const i = inventory.findIndex(r => Number(r.id) === Number(invId));
        if (i >= 0) {
            inventory[i] = { ...inventory[i], quantity: Number(inventory[i].quantity) - amt };
        }
    }
    writeJson(INVENTORY_PATH, inventory);

    // record order
    const orders = readJson(ORDERS_PATH, []);
    const record = {
        id: orders.length ? Math.max(...orders.map(o => o.id || 0)) + 1 : 1,
        at: new Date().toISOString(),
        items
    };
    orders.push(record);
    writeJson(ORDERS_PATH, orders);

    res.status(201).json({ ok: true, order: record });
});

module.exports = router;
