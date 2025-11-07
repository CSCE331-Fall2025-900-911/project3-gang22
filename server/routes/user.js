const express = require('express');
const router = express.Router();
const { query } = require('../db');

// --- GET ---
router.get('/menu', async (req, res) => {
  try {
    const result = await query('SELECT * FROM p2_menu ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- POST ---
router.post('/Order', async (req, res) => {
  const { 
        order_time,
        menu_ids, quantities, totals,
        card_number, card_expr_m, card_expr_y, card_holder 
    } = req.body;

  if (
        !order_time 
        || !Array.isArray(menu_ids) || !Array.isArray(quantities) || !Array.isArray(totals) 
        || !card_number || !card_expr_m || !card_expr_y || !card_holder) 
    {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    // User has no employee id (i.e. = -1)
    const employee_id = -1;

    // Calculate totals
    const subtotal = totals.reduce((acc, x) => acc + x, 0);
    const tax = subtotal * 0.0625; // in theory calls for specfc state
    const total = subtotal + tax;

    // --- BEGIN ---
    await query('BEGIN');

    // --- POST Order ---
    const orderResult = await query(
      `INSERT INTO p2_orders (subtotal, tax, total, order_time, employee_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [subtotal, tax, total, order_time, employee_id]
    );

    // --- POST Order Items ---
    const order_id = orderResult.rows[0].id;

    for (let i = 0; i < menu_ids.length; i++) {
      await query(
        `INSERT INTO p2_order_items (order_id, menu_id, quantity, total)
         VALUES ($1, $2, $3, $4)`,
        [order_id, menu_ids[i], quantities[i], totals[i]]
      );
    }

    // --- POST Transaction ---
    await query(
      `INSERT INTO p2_transactions (order_id, card_number, card_expr_m, card_expr_y, card_holder)
       VALUES ($1, $2, $3, $4, $5)`,
      [order_id, card_number, card_expr_m, card_expr_y, card_holder]
    );

    // --- COMMIT ---
    await query('COMMIT');

    res.status(201).json({
      message: 'Order successfully created',
      order_id,
      subtotal,
      tax,
      total
    });
  } catch (err) {
    await query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;