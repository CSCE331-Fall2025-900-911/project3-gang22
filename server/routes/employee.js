// routes/employee.js
const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM p2_employees');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
