const { query } = require('../db');

module.exports = {
  async getOrdersBySingleDate(date) {
    const result = await query(
      `SELECT * FROM p2_orders 
       WHERE order_time::date = $1::date
       ORDER BY id`,
      [date]
    );
    return result.rows;
  },

  async getOrdersByDateRange(start, end) {
    const result = await query(
      `SELECT * FROM p2_orders 
       WHERE order_time::date BETWEEN $1::date AND $2::date
       ORDER BY id`,
      [start, end]
    );
    return result.rows;
  },
  
  async createOrder(order) {
    const { subtotal, tax, total, order_time, employee_id } = order;
    const { rows } = await query(
      `INSERT INTO p2_orders (subtotal, tax, total, order_time, employee_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [subtotal, tax, total, order_time, employee_id]
    );
    return rows[0].id;
  }
};
