const { query } = require('../db');

module.exports = {
  async addTransaction({ customer_name, total, order_time, items }) {
    const { rows } = await query(
      `INSERT INTO p2_orders (customer_name, total, order_time, items)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [customer_name, total, order_time, JSON.stringify(items)]
    );
    return rows[0];
  }
};
