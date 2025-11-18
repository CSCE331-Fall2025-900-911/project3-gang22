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

router.get('/employee', async (req, res) => {
  try {
    const result = await query('SELECT * FROM p2_employees');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/inventory', async (req, res) => {
  try {
    const result = await query('SELECT * FROM p2_inventory');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/menu_inventory', async (req, res) => {
  try {
    const result = await query('SELECT * FROM p2_menu_inventory');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching menu_inventory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/orders', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing required field: date' });
  }

  try {
    let result;

    if (Array.isArray(date)) {
      if (date.length !== 2) {
        return res.status(400).json({ error: 'Date range must contain exactly two dates' });
      }

      result = await query(
        `SELECT * FROM p2_orders 
         WHERE order_time::date BETWEEN $1::date AND $2::date
         ORDER BY id`,
        [date[0], date[1]]
      );
    } else {
      result = await query(
        `SELECT * FROM p2_orders 
         WHERE order_time::date = $1::date 
         ORDER BY id`,
        [date]
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/sales-report', async (req, res) => {
  const { startDate, endDate, interval } = req.query;

   let timeFormat;
   
   switch (interval.toLowerCase()) {
      case "hour": 
        timeFormat = "YYYY-MM-DD HH24:00";
        break;
      case "day":
        timeFormat = "YYYY-MM-DD";
        break;
      case "week":
        timeFormat = "IYYY-IW";
        break;
      case "month":
        timeFormat ="YYYY-MM";
        break;
      default:
        timeFormat = "YYYY-MM-DD";
    }

  try {
    const result = await query(
      `SELECT m.drink_name AS drink_name,
      TO_CHAR(o.order_time, '${timeFormat}') AS time_label,
      SUM(oi.quantity) AS total_qty,
      SUM(oi.total) AS total_sales
      FROM p2_order_items oi
      JOIN p2_orders o ON oi.order_id = o.id
      JOIN p2_menu m ON oi.menu_id = m.id
      WHERE o.order_time >= $1::timestamp AND o.order_time < $2::timestamp
      GROUP BY drink_name, time_label
      ORDER BY time_label, drink_name`,
      [startDate, endDate]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sales report:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- POST ---

router.post('/menu/add', async (req, res) => {
  const { drink_name, price, category, picture_url, tea_type, milk_type } = req.body;

  if (!drink_name || !price || !category || !picture_url || !tea_type || !milk_type) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO p2_menu (drink_name, price, category, picture_url, tea_type, milk_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [drink_name, price, category, picture_url, tea_type, milk_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding menu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/employee/add', async (req, res) => {
  const { name, role, schedule } = req.body;

  if (!name || !role || !schedule) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO p2_employees (name, role, schedule)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, role, schedule]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/inventory/add', async (req, res) => {
  const { name, unit, quantity, reorder_threshold, unit_cost } = req.body;

  if (!name || !unit || !quantity || !reorder_threshold || !unit_cost) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    const result = await query(
      `INSERT INTO p2_inventory (name, unit, quantity, reorder_threshold, unit_cost)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, unit, quantity, reorder_threshold, unit_cost]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error adding inventory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- PUT ---

router.put('/menu/update', async (req, res) => {
  const { id, drink_name, price, category, picture_url, tea_type, milk_type } = req.body;

  if (!id || !drink_name || !price || !category || !picture_url || !tea_type || !milk_type) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    await query(
      `UPDATE p2_menu
       SET drink_name=$1, price=$2, category=$3, picture_url=$4, tea_type=$5, milk_type=$6
       WHERE id=$7`,
      [drink_name, price, category, picture_url, tea_type, milk_type, id]
    );
    res.json({ message: 'Menu item updated successfully' });
  } catch (err) {
    console.error('Error updating menu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/employee/update', async (req, res) => {
  const { id, name, role, schedule } = req.body;

  if (!id || !name || !role || !schedule) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    await query(
      `UPDATE p2_employees
       SET name=$1, role=$2, schedule=$3
       WHERE id=$4`,
      [name, role, schedule, id]
    );
    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/inventory/update', async (req, res) => {
  const { id, name, unit, quantity, reorder_threshold, unit_cost } = req.body;

  if (!id || !name || !unit || !quantity || !reorder_threshold || !unit_cost) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  try {
    await query(
      `UPDATE p2_inventory
       SET name=$1, unit=$2, quantity=$3, reorder_threshold=$4, unit_cost=$5
       WHERE id=$6`,
      [name, unit, quantity, reorder_threshold, unit_cost, id]
    );
    res.json({ message: 'Inventory updated successfully' });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- DELETE ---

router.delete('/menu/del', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing or invalid required field: id' });
  }

  try {
    await query(`DELETE FROM p2_menu WHERE id=$1`, [id]);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/employee/del', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing or invalid required field: id' });
  }

  try {
    await query(`DELETE FROM p2_employees WHERE id=$1`, [id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/inventory/del', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing or invalid required field: id' });
  }

  try {
    await query(`DELETE FROM p2_inventory WHERE id=$1`, [id]);
    res.json({ message: 'Inventory deleted successfully' });
  } catch (err) {
    console.error('Error deleting inventory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
