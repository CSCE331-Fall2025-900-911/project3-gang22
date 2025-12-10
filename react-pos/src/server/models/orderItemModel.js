
// Used for inserting individual order items associated with an order
const { query } = require('../db');

module.exports = {
  async addOrderItem(order_id, item) {
    const { menu_id, quantity, total, customization } = item;
    await query(
      `INSERT INTO p2_order_items (order_id, menu_id, quantity, total, customization)
       VALUES ($1, $2, $3, $4, $5)`,
      [order_id, menu_id, quantity, total, customization]
    );
  }
};
